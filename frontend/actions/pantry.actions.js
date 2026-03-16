"use server"

import { freePantryScans, ProTierLimit } from "@/lib/arcjet";
import { checkUser } from "@/lib/checkUser";
import { request } from "@arcjet/next";

const { GoogleGenerativeAI } = require("@google/generative-ai");

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337"
const  STRAPI_API_TOKEN = process.env.STRAPI_API_TOKEN;
const GEMINI_API_KEY= process.env.GEMINI_API_KEY

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

export async function scanPantryImage(formData) {
    try {
        const user = await checkUser()
        if(!user) {
            throw new Error("User not Authenticated")
        }

        const isPro= user.subscriptionTier === "pro"

        const arcjetClient = isPro? ProTierLimit : freePantryScans

        const req = await request()

        const decision = await arcjetClient.protect(req, {
            userId: user.clerkId,
            requested: 1,
        })

        if(decision.isDenied()){
            if(decision.reason.isRateLimit()) {
                throw new Error(
                    `Monthly Scan Limit Reached. ${
                        isPro
                           ? "Please Contact Support if you need more Scans."
                           : "Upgrade to Pro for Unlimited Scans!"
                    }`
                )
            }

            throw new Error ("Request Denied by Security System")
        }

        const imageFile = formData.get("image");
        if (!imageFile) {
            throw new Error ("No Image Provided")
        }

        //convert the image to base64
        const bytes = await imageFile.arrayBuffer()
        const buffer = Buffer.from(bytes);
        const base64Image= buffer.toString("base64")

        const model= genAI.getGenerativeModel({
            model: "gemini-2.5-flash-lite"
        })

        const prompt = `
            You are a professional chef and expert in identifying food ingredients from pantry and refrigerator images.

Carefully analyze the image step-by-step and visually inspect all areas of the fridge, shelves, containers, and surfaces before identifying ingredients.

Identify all visible edible food ingredients.

Return ONLY a valid JSON array in the following format. Do NOT include any explanations, markdown, or text outside the JSON.

[
  {
    "name": "ingredient name",
    "quantity": "estimated quantity with unit",
    "confidence": 0.95
  }
]

Instructions:

• Identify ONLY edible food ingredients.
• Ignore containers, packaging, utensils, labels, jars, bottles, appliances, and non-food objects unless the food itself is clearly visible.
• Use clear, specific ingredient names (example: "Cherry Tomatoes", "Cheddar Cheese", "Baby Spinach", "Red Onion").
• Do NOT use vague names if a specific ingredient is recognizable.
• Combine duplicate ingredients into a single entry.
• Estimate realistic household quantities such as:
  - "3 eggs"
  - "2 tomatoes"
  - "1 cup milk"
  - "half onion"
  - "1 bunch spinach"
• Confidence must be between 0.70 and 1.00.
• Exclude ingredients below 0.70 confidence.
• Maximum 20 ingredients.
• Do NOT guess ingredients that are not visible.
• If no ingredients are clearly visible, return an empty array [].
• Common pantry staples are acceptable (salt, pepper, oil)
• Ensure the response is STRICT valid JSON. `

         const result = await model.generateContent([
      prompt,
      {
        inlineData: {
          mimeType: imageFile.type,
          data: base64Image,
        },
      },
    ]);

    const response = await result.response;
    const text = response.text();

    // Parse JSON response
    let ingredients;
    try {
      const cleanText = text
        .replace(/```json\n?/g, "")
        .replace(/```\n?/g, "")
        .trim();
      ingredients = JSON.parse(cleanText);
      ingredients=ingredients.map((item) =>({
        ...item,
        name:item.name
        .split(" ")
        .map(word=> word.charAt(0).toUpperCase()+
         word.slice(1).toLowerCase()
      ) .join(" ")
      }))
    } catch (parseError) {
      console.error("Failed to Parse Gemini Response:", text);
      throw new Error("Failed to Parse Ingredients. Please Try Again.");
    }

    if (!Array.isArray(ingredients) || ingredients.length === 0) {
      throw new Error(
        "No Ingredients Detected in the Image. Please Try a Clearer Photo."
      );
    }

    return {
      success: true,
      ingredients: ingredients.slice(0, 20),
      scansLimit: isPro ? "unlimited" : 10,
      message: `Found ${ingredients.length} Ingredients!`,
    };
  } catch (error) {
    console.error("Error Scanning Pantry:", error);
    throw new Error(error.message || "Failed to Scan Image");
  }
}

// Save ingredients to pantry
export async function saveToPantry(formData) {
  try {
    const user = await checkUser();
    if (!user) {
      throw new Error("User Not Authenticated");
    }

    const ingredientsJson = formData.get("ingredients");
    const ingredients = JSON.parse(ingredientsJson);

    if (!ingredients || ingredients.length === 0) {
      throw new Error("No Ingredients to Save");
    }

    // Create pantry items in Strapi
    const savedItems = [];
    for (const ingredient of ingredients) {
      const response = await fetch(`${STRAPI_URL}/api/pantry-items`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${STRAPI_API_TOKEN}`,
        },
        body: JSON.stringify({
          data: {
            name: ingredient.name,
            quantity: ingredient.quantity,
            imageUrl: "",
            owner: user.id,
          },
        }),
      });

      if (response.ok) {
        const data = await response.json();
        savedItems.push(data.data);
      }
    }

    return {
      success: true,
      savedItems,
      message: `Saved ${savedItems.length} Items to your Pantry!`,
    };
  } catch (error) {
    console.error("Error Saving to Pantry:", error);
    throw new Error(error.message || "Failed to Save Items");
  }
}

// Add pantry item manually
export async function addPantryItemManually(formData) {
  try {
    const user = await checkUser();
    if (!user) {
      throw new Error("User Not Authenticated");
    }

    const name = formData.get("name");
    const quantity = formData.get("quantity");

    if (!name || !quantity) {
      throw new Error("Name and Quantity are Required");
    }

    const response = await fetch(`${STRAPI_URL}/api/pantry-items`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${STRAPI_API_TOKEN}`,
      },
      body: JSON.stringify({
        data: {
          name: name.trim(),
          quantity: quantity.trim(),
          imageUrl: "",
          owner: user.id,
        },
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Failed to Add Item:", errorText);
      throw new Error("Failed to Add Item to Pantry");
    }

    const data = await response.json();

    return {
      success: true,
      item: data.data,
      message: "Item Added Successfully!",
    };
  } catch (error) {
    console.error("Error Adding Item Manually:", error);
    throw new Error(error.message || "Failed to Add Item");
  }
}

// Get user's pantry items
export async function getPantryItems() {
  try {
    const user = await checkUser();
    if (!user) {
      throw new Error("User Not Authenticated");
    }

    const response = await fetch(
      `${STRAPI_URL}/api/pantry-items?filters[owner][id][$eq]=${user.id}&sort=createdAt:desc`,
      {
        headers: {
          Authorization: `Bearer ${STRAPI_API_TOKEN}`,
        },
        cache: "no-store",
      }
    );

    if (!response.ok) {
      throw new Error("Failed to Fetch Pantry Items");
    }

    const data = await response.json();

    const isPro = user.subscriptionTier === "pro";

    return {
      success: true,
      items: data.data || [],
      scansLimit: isPro ? "unlimited" : 10,
    };
  } catch (error) {
    console.error("Error Fetching Pantry:", error);
    throw new Error(error.message || "Failed to Load Pantry");
  }
}

// Delete pantry item
export async function deletePantryItem(formData) {
  try {
    const user = await checkUser();
    if (!user) {
      throw new Error("User Not Authenticated");
    }

    const itemId = formData.get("itemId");

    const response = await fetch(`${STRAPI_URL}/api/pantry-items/${itemId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${STRAPI_API_TOKEN}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to Delete Item");
    }

    return {
      success: true,
      message: "Item Removed from Pantry",
    };
  } catch (error) {
    console.error("Error deleting item:", error);
    throw new Error(error.message || "Failed to Delete Item");
  }
}

// Update pantry item
export async function updatePantryItem(formData) {
  try {
    const user = await checkUser();
    if (!user) {
      throw new Error("User Not Authenticated");
    }

    const itemId = formData.get("itemId");
    const name = formData.get("name");
    const quantity = formData.get("quantity");

    const response = await fetch(`${STRAPI_URL}/api/pantry-items/${itemId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${STRAPI_API_TOKEN}`,
      },
      body: JSON.stringify({
        data: {
          name,
          quantity,
        },
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to Update Item");
    }

    const data = await response.json();

    return {
      success: true,
      item: data.data,
      message: "Item Updated Successfully",
    };
  } catch (error) {
    console.error("Error Updating Item:", error);
    throw new Error(error.message || "Failed to Update Item");
  }
}