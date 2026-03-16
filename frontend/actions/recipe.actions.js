"use server";

import { checkUser } from "@/lib/checkUser";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { freeMealRecommendations, proTierLimit } from "@/lib/arcjet";
import { request } from "@arcjet/next";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const STRAPI_URL =
  process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337";
const STRAPI_API_TOKEN = process.env.STRAPI_API_TOKEN;
const UNSPLASH_ACCESS_KEY = process.env.UNSPLASH_ACCESS_KEY;

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

// Helper function to normalize recipe title
function normalizeTitle(title) {
  return title
    .trim()
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
}

// Helper function to fetch image from Unsplash
async function fetchRecipeImage(recipeName) {
  try {
    if (!UNSPLASH_ACCESS_KEY) {
      console.warn("⚠️ UNSPLASH_ACCESS_KEY not set, skipping image fetch");
      return "";
    }

    const searchQuery = `${recipeName} food close up`;

const response = await fetch(
  `https://api.unsplash.com/search/photos?query=${encodeURIComponent(searchQuery)}&per_page=5&orientation=landscape&content_filter=high`,
  {
    headers: {
      Authorization: `Client-ID ${UNSPLASH_ACCESS_KEY}`,
    },
  }
);

    if (!response.ok) {
      console.error("❌ Unsplash API error:", response.statusText);
      return "";
    }

    const data = await response.json();

    if (data.results && data.results.length > 0) {
      const photo = data.results[0];
      console.log("✅ Found Unsplash image:", photo.urls.regular);
      return photo.urls.regular;
    }

    console.log("ℹ️ No Unsplash image found for:", recipeName);
    return "";
  } catch (error) {
    console.error("❌ Error fetching Unsplash image:", error);
    return "";
  }
}

// Get or generate recipe details
export async function getOrGenerateRecipe(formData) {
  try {
    const user = await checkUser();
    if (!user) {
      throw new Error("User not authenticated");
    }

    const recipeName = formData.get("recipeName");
    if (!recipeName) {
      throw new Error("Recipe name is required");
    }

    // Normalize the title (e.g., "apple cake" → "Apple Cake")
    const normalizedTitle = normalizeTitle(recipeName);
    const safeTitle = normalizedTitle.replace(/&/g, "and")
    console.log("🔍 Searching for recipe:", safeTitle);

    const isPro = user.subscriptionTier === "pro";

    // Step 1: Check if recipe already exists in DB (case-insensitive search)
    const searchResponse = await fetch(
      `${STRAPI_URL}/api/recipes?filters[title][$eqi]=${encodeURIComponent(
        safeTitle
      )}&populate=*`,
      {
        headers: {
          Authorization: `Bearer ${STRAPI_API_TOKEN}`,
        },
        cache: "no-store",
      }
    );

    if (searchResponse.ok) {
      const searchData = await searchResponse.json();

      if (searchData.data && searchData.data.length > 0) {
        console.log("✅ Recipe found in database:", searchData.data[0].id);

        // Check if user has saved this recipe
        const savedRecipeResponse = await fetch(
          `${STRAPI_URL}/api/saved-recipes?filters[user][id][$eq]=${user.id}&filters[recipe][id][$eq]=${searchData.data[0].documentId}`,
          {
            headers: {
              Authorization: `Bearer ${STRAPI_API_TOKEN}`,
            },
            cache: "no-store",
          }
        );

        let isSaved = false;
        if (savedRecipeResponse.ok) {
          const savedData = await savedRecipeResponse.json();
          isSaved = savedData.data && savedData.data.length > 0;
        }

        return {
          success: true,
          recipe: searchData.data[0],
          recipeId: searchData.data[0].documentId,
          isSaved: isSaved,
          fromDatabase: true,
          isPro,
          message: "Recipe loaded from database",
        };
      }
    }

    // Step 2: Recipe doesn't exist, generate with Gemini
    console.log("🤖 Recipe not found, generating with Gemini...");

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-lite" });

    const prompt = `
You are a professional chef and recipe expert. Generate a detailed recipe for: "${normalizedTitle}"

CRITICAL:
• The "title" field MUST be EXACTLY: "${normalizedTitle}" (do not modify it or add words like "Classic", "Easy", etc.)
• Return STRICT raw JSON only.
• Do NOT include markdown, explanations, comments, or text outside the JSON.

Return ONLY a valid JSON object with this exact structure:

{
  "title": "${normalizedTitle}",
  "description": "Brief 2–3 sentence description of the dish",
  "category": "Must be ONE of these EXACT values: breakfast, lunch, dinner, snack, dessert",
  "cuisine": "Must be ONE of these EXACT values: italian, chinese, mexican, indian, american, thai, japanese, mediterranean, french, korean, vietnamese, spanish, greek, turkish, moroccan, brazilian, caribbean, middle-eastern, british, german, portuguese, other",
   "prepTime": "Time in minutes (number only)",
  "cookTime": "Time in minutes (number only)",
  "servings": "Number of servings (number only)",
  "ingredients": [
    {
      "item": "Ingredient Name (capitalized)",
      "amount": "quantity with unit",
      "category": "Protein|Vegetable|Spice|Dairy|Grain|Other"
    }
  ],
  "instructions": [
    {
      "step": 1,
      "title": "Short step title",
      "instruction": "Clear beginner-friendly instruction",
      "tip": "Optional cooking tip"
    }
  ],
  "nutrition": {
    "calories": "calories per serving",
    "protein": "grams",
    "carbs": "grams",
    "fat": "grams"
  },
  "tips": [
    "General cooking tip 1",
    "General cooking tip 2",
    "General cooking tip 3"
  ],
  "substitutions": [
    {
      "original": "ingredient name",
      "alternatives": ["substitute 1", "substitute 2"]
    }
  ]
}

CATEGORY RULES:
• Pancakes, eggs, cereal, smoothies → breakfast
• Sandwiches, salads, pasta, light meals → lunch
• Full cooked meals or heavier dishes → dinner
• Light items between meals → snack
• Cakes, cookies, sweet treats → dessert

CUISINE RULES:
• Use lowercase only
• Choose the closest match from the allowed cuisine list
• If uncertain, use "other"

INGREDIENT RULES:
• Ingredient names must NOT contain quantities
• Quantities must only appear in the "amount" field
• Capitalize the first letter of each ingredient name
• Combine duplicate ingredients into one entry
• Use realistic household quantities

INSTRUCTION RULES:
• Provide 6–10 steps
• Step numbers must start at 1 and increase sequentially
• Each step must be clear and beginner-friendly
• Include practical cooking tips where useful
• Keep the total number of steps under 12

GENERAL GUIDELINES:
• Use commonly available ingredients
• Keep preparation and cooking times realistic
• Ensure the output is STRICT valid JSON
`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Parse JSON response
    let recipeData;
    try {
      const cleanText = text
        .replace(/```json\n?/g, "")
        .replace(/```\n?/g, "")
        .trim();
      recipeData = JSON.parse(cleanText);
    } catch (parseError) {
      console.error("Failed to parse Gemini response:", text);
      throw new Error("Failed to generate recipe. Please try again.");
    }

    // FORCE the title to be our normalized version
    recipeData.title = normalizedTitle;

    // Validate and sanitize category
    const validCategories = [
      "breakfast",
      "lunch",
      "dinner",
      "snack",
      "dessert",
    ];
    const category = validCategories.includes(
      recipeData.category?.toLowerCase()
    )
      ? recipeData.category.toLowerCase()
      : "dinner";

    // Validate and sanitize cuisine
    const validCuisines = [
      "italian",
      "chinese",
      "mexican",
      "indian",
      "american",
      "thai",
      "japanese",
      "mediterranean",
      "french",
      "korean",
      "vietnamese",
      "spanish",
      "greek",
      "turkish",
      "moroccan",
      "brazilian",
      "caribbean",
      "middle-eastern",
      "british",
      "german",
      "portuguese",
      "other",
    ];
    const cuisine = validCuisines.includes(recipeData.cuisine?.toLowerCase())
      ? recipeData.cuisine.toLowerCase()
      : "other";

    // Step 3: Fetch image from Unsplash
    console.log("🖼️ Fetching image from Unsplash...");
    const imageUrl = await fetchRecipeImage(safeTitle);

    // Step 4: Save generated recipe to database
    const strapiRecipeData = {
      data: {
        title: safeTitle,
        description: recipeData.description,
        cuisine,
        category,
        ingredients: JSON.parse(recipe.ingredients || "[]"),
        instructions: JSON.parse(recipe.instructions || "[]"),
        prepTime: Number(recipeData.prepTime),
        cookTime: Number(recipeData.cookTime),
        servings: Number(recipeData.servings),
        nutrition: JSON.parse(recipe.nutrition || "{}"),
        tips:JSON.parse(recipe.tips || "[]"),
        substitutions: JSON.parse(recipe.substitutions || "[]"),
        imageUrl: imageUrl || "",
        isPublic: true,
        author: user.id,
      },
    };

    console.log(
      "📤 Saving new recipe to database with title:",
      normalizedTitle
    );

    const createRecipeResponse = await fetch(`${STRAPI_URL}/api/recipes`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${STRAPI_API_TOKEN}`,
      },
      body: JSON.stringify(strapiRecipeData),
    });

    if (!createRecipeResponse.ok) {
      const errorText = await createRecipeResponse.text();
      console.error("❌ Failed to save recipe:", errorText);
      throw new Error("Failed to save recipe to database");
    }

    const createdRecipe = await createRecipeResponse.json();
    console.log("✅ Recipe saved to database:", createdRecipe.data.id);

    return {
      success: true,
      recipe: {
        ...recipeData,
        title: safeTitle,
        category,
        cuisine,
        imageUrl: imageUrl || "",
      },
      recipeId: createdRecipe.data.documentId,
      isSaved: false,
      fromDatabase: false,
      recommendationsLimit: isPro ? "unlimited" : 5,
      isPro,
      message: "Recipe generated and saved successfully!",
    };
  } catch (error) {
    console.error("❌ Error in getOrGenerateRecipe:", error);
    throw new Error(error.message || "Failed to load recipe");
  }
}

// Save recipe to user's collection (bookmark)
export async function saveRecipeToCollection(formData) {
  try {
    const user = await checkUser();
    if (!user) {
      throw new Error("User not authenticated");
    }

    const recipeId = formData.get("recipeId");
    if (!recipeId) {
      throw new Error("Recipe ID is required");
    }

    // Check if already saved
    const existingResponse = await fetch(
      `${STRAPI_URL}/api/saved-recipes?filters[user][id][$eq]=${user.id}&filters[recipe][id][$eq]=${recipeId}`,
      {
        headers: {
          Authorization: `Bearer ${STRAPI_API_TOKEN}`,
        },
        cache: "no-store",
      }
    );

    if (existingResponse.ok) {
      const existingData = await existingResponse.json();
      if (existingData.data && existingData.data.length > 0) {
        return {
          success: true,
          alreadySaved: true,
          message: "Recipe is already in your collection",
        };
      }
    }

    // Create saved recipe relation
    const saveResponse = await fetch(`${STRAPI_URL}/api/saved-recipes`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${STRAPI_API_TOKEN}`,
      },
      body: JSON.stringify({
        data: {
          user: user.id,
          recipe: recipeId,
          savedAt: new Date().toISOString(),
        },
      }),
    });

    if (!saveResponse.ok) {
      const errorText = await saveResponse.text();
      console.error("❌ Failed to save recipe:", errorText);
      throw new Error("Failed to save recipe to collection");
    }

    const savedRecipe = await saveResponse.json();
    console.log("✅ Recipe saved to user collection:", savedRecipe.data.id);

    return {
      success: true,
      alreadySaved: false,
      savedRecipe: savedRecipe.data,
      message: "Recipe saved to your collection!",
    };
  } catch (error) {
    console.error("❌ Error saving recipe to collection:", error);
    throw new Error(error.message || "Failed to save recipe");
  }
}

// Remove recipe from user's collection (unbookmark)
export async function removeRecipeFromCollection(formData) {
  try {
    const user = await checkUser();
    if (!user) throw new Error("User not authenticated");

    const recipeId = formData.get("recipeId");

    console.log("USER ID:", user.id);
    console.log("RECIPE ID:", recipeId);

    const searchResponse = await fetch(
      `${STRAPI_URL}/api/saved-recipes?filters[user][id][$eq]=${user.id}&populate=*`,
      {
        headers: {
          Authorization: `Bearer ${STRAPI_API_TOKEN}`,
        },
        cache: "no-store",
      }
    );

    const searchData = await searchResponse.json();

    console.log("ALL SAVED RECIPES:", searchData);

    if (!searchData.data || searchData.data.length === 0) {
      return { success: true };
    }

    const savedRecord = searchData.data.find(
      (item) => item.recipe?.documentId == recipeId
    );

    console.log("MATCHED RECORD:", savedRecord);

    if (!savedRecord) {
      console.log("No matching recipe found");
      return { success: true };
    }

    const deleteResponse = await fetch(
      `${STRAPI_URL}/api/saved-recipes/${savedRecord.documentId}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${STRAPI_API_TOKEN}`,
        },
      }
    );

    console.log("DELETE RESPONSE:", deleteResponse.status);

    return { success: true };
  } catch (error) {
    console.error(error);
    throw new Error("Failed to remove recipe");
  }
}
// Get recipes based on pantry ingredients
export async function getRecipesByPantryIngredients() {
  try {
    const user = await checkUser();
    if (!user) {
      throw new Error("User not authenticated");
    }

    // ✅ ARCJET RATE LIMIT CHECK
    const isPro = user.subscriptionTier === "pro";
    const arcjetClient = isPro ? proTierLimit : freeMealRecommendations;

    // Create a request object for Arcjet
    const req = await request();

    const decision = await arcjetClient.protect(req, {
      userId: user.clerkId,
      requested: 1,
    });

    if (decision.isDenied()) {
      if (decision.reason.isRateLimit()) {
        throw new Error(
          `Monthly AI recipe limit reached. ${
            isPro ? "Please contact support." : "Upgrade to Pro!"
          }`
        );
      }
      throw new Error("Request denied");
    }

    // Get user's pantry items
    const pantryResponse = await fetch(
      `${STRAPI_URL}/api/pantry-items?filters[owner][id][$eq]=${user.id}`,
      {
        headers: {
          Authorization: `Bearer ${STRAPI_API_TOKEN}`,
        },
        cache: "no-store",
      }
    );

    if (!pantryResponse.ok) {
      throw new Error("Failed to fetch pantry items");
    }

    const pantryData = await pantryResponse.json();

    if (!pantryData.data || pantryData.data.length === 0) {
      return {
        success: false,
        message: "Your pantry is empty. Add ingredients first!",
      };
    }

    const ingredients = pantryData.data.map((item) => item.name).join(", ");

    console.log("🥘 Finding recipes for ingredients:", ingredients);

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-lite" });

    const prompt = `
You are a professional chef AI.

Using these available pantry ingredients:
${ingredients}

Suggest **5 realistic recipes** that can be cooked primarily using these ingredients.

It is acceptable if the recipe requires **1–2 common pantry staples** such as:
salt, pepper, oil, butter, garlic, water, or basic spices.

Return **ONLY a valid JSON array**.
Do NOT include markdown, explanations, or any text outside JSON.

Format:

[
  {
    "title": "Recipe name",
    "description": "Brief 1–2 sentence description of the dish",
    "matchPercentage": 85,
    "missingIngredients": ["ingredient1", "ingredient2"],
    "category": "breakfast|lunch|dinner|snack|dessert",
    "cuisine": "italian|chinese|mexican|indian|american|thai|japanese|mediterranean|french|korean|vietnamese|spanish|greek|turkish|moroccan|brazilian|caribbean|middle-eastern|british|german|portuguese|other",
    "prepTime": 20,
    "cookTime": 30,
    "servings": 4
  }
]

Rules:
• Generate EXACTLY 5 recipes
• matchPercentage must be between **70 and 100**
• Higher matchPercentage means more pantry ingredients are used
• missingIngredients should contain **only 0–2 simple ingredients**
• Prefer using the provided pantry ingredients
• Do NOT invent unusual ingredients
• Sort recipes by **matchPercentage descending**
• Recipes should be realistic and commonly cooked
• prepTime and cookTime must be numbers (minutes only)
• servings must be a number

Ensure the response is **STRICT valid JSON**.
`;
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    let recipeSuggestions;
    try {
      const cleanText = text
        .replace(/```json\n?/g, "")
        .replace(/```\n?/g, "")
        .trim();
      recipeSuggestions = JSON.parse(cleanText);
    } catch (parseError) {
      console.error("Failed to parse Gemini response:", text);
      throw new Error(
        "Failed to generate recipe suggestions. Please try again."
      );
    }

    return {
      success: true,
      recipes: recipeSuggestions,
      ingredientsUsed: ingredients,
      recommendationsLimit: isPro ? "unlimited" : 5,
      message: `Found ${recipeSuggestions.length} recipes you can make!`,
    };
  } catch (error) {
    console.error("❌ Error in getRecipesByPantryIngredients:", error);
    throw new Error(error.message || "Failed to get recipe suggestions");
  }
}

// Get user's saved recipes
export async function getSavedRecipes() {
  try {
    const user = await checkUser();
    if (!user) {
      throw new Error("User not authenticated");
    }

    // Fetch saved recipes with populated recipe data
    const response = await fetch(
      `${STRAPI_URL}/api/saved-recipes?filters[user][id][$eq]=${user.id}&populate[recipe][populate]=*&sort=savedAt:desc`,
      {
        headers: {
          Authorization: `Bearer ${STRAPI_API_TOKEN}`,
        },
        cache: "no-store",
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch saved recipes");
    }

    const data = await response.json();

    // Extract recipes from saved-recipes relations
    const recipes = data.data
      .map((savedRecipe) => savedRecipe.recipe)
      .filter(Boolean); // Remove any null recipes

    return {
      success: true,
      recipes,
      count: recipes.length,
    };
  } catch (error) {
    console.error("Error fetching saved recipes:", error);
    throw new Error(error.message || "Failed to load saved recipes");
  }
}