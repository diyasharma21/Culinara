// lib/dummyRecipe.js
// Vegetarian dummy recipe response (fallback when AI fails)

export const DUMMY_RECIPE_RESPONSE = {
  success: true,
  recipe: {
    id: 1,
    documentId: "recipe_veg_1",
    title: "Paneer Butter Masala",
    description:
      "Paneer Butter Masala is a rich and creamy North Indian curry made with soft paneer cubes simmered in a buttery tomato-based gravy. This vegetarian restaurant favorite pairs beautifully with naan, roti, or basmati rice.",

    cuisine: "indian",
    category: "dinner",

    imageUrl:
      "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=800",

    ingredients: [
      { item: "Paneer", amount: "400g cubes", category: "Protein" },
      { item: "Butter", amount: "3 tbsp", category: "Dairy" },
      { item: "Heavy cream", amount: "1/2 cup", category: "Dairy" },
      { item: "Tomato puree", amount: "2 cups", category: "Vegetable" },
      { item: "Onion", amount: "1 large finely chopped", category: "Vegetable" },
      { item: "Garlic", amount: "4 cloves minced", category: "Vegetable" },
      { item: "Ginger", amount: "1 tbsp grated", category: "Vegetable" },
      { item: "Garam masala", amount: "1 tsp", category: "Spice" },
      { item: "Turmeric powder", amount: "1/2 tsp", category: "Spice" },
      { item: "Kashmiri red chili powder", amount: "1 tsp", category: "Spice" },
      { item: "Cumin powder", amount: "1 tsp", category: "Spice" },
      { item: "Kasuri methi", amount: "1 tsp crushed", category: "Spice" },
      { item: "Sugar", amount: "1/2 tsp", category: "Other" },
      { item: "Salt", amount: "to taste", category: "Other" },
      { item: "Fresh cilantro", amount: "for garnish", category: "Other" }
    ],

    instructions: [
      {
        step: 1,
        title: "Prepare the Base",
        instruction:
          "Heat 1 tablespoon butter in a pan over medium heat. Add chopped onions and cook until golden and soft.",
        tip: "Cook onions slowly to develop deeper flavor."
      },
      {
        step: 2,
        title: "Add Aromatics",
        instruction:
          "Add minced garlic and grated ginger. Cook for about 1 minute until fragrant.",
        tip: null
      },
      {
        step: 3,
        title: "Cook the Tomato Masala",
        instruction:
          "Add tomato puree, turmeric, chili powder, cumin powder, and salt. Cook for 10 minutes until the mixture thickens and oil separates.",
        tip: "This step removes the raw tomato flavor."
      },
      {
        step: 4,
        title: "Blend the Sauce",
        instruction:
          "Allow the mixture to cool slightly, then blend into a smooth sauce using a blender.",
        tip: "Blending gives the curry its signature silky texture."
      },
      {
        step: 5,
        title: "Simmer the Curry",
        instruction:
          "Return the sauce to the pan, add cream and sugar, and simmer gently for 5 minutes.",
        tip: null
      },
      {
        step: 6,
        title: "Add Paneer",
        instruction:
          "Add paneer cubes and crushed kasuri methi. Cook for another 5 minutes on low heat.",
        tip: "Avoid overcooking paneer to keep it soft."
      },
      {
        step: 7,
        title: "Finish and Garnish",
        instruction:
          "Stir in the remaining butter and garnish with fresh cilantro. Serve hot with naan or rice.",
        tip: "A swirl of cream on top enhances presentation."
      }
    ],

    prepTime: 15,
    cookTime: 30,
    servings: 4,

    nutrition: {
      calories: "360 ",
      protein: "18g",
      carbs: "20g",
      fat: "24g",
      fiber: "4g",
      sugar: "7g"
    },

    tips: [
      "Use fresh paneer for the best texture.",
      "Add a pinch of sugar to balance tomato acidity.",
      "Crush kasuri methi between your palms before adding for stronger aroma.",
      "Serve with garlic naan or jeera rice for a complete meal."
    ],

    substitutions: [
      {
        original: "Paneer",
        alternatives: ["Tofu", "Halloumi", "Firm cottage cheese"]
      },
      {
        original: "Heavy cream",
        alternatives: ["Coconut cream", "Cashew cream", "Half-and-half"]
      },
      {
        original: "Butter",
        alternatives: ["Ghee", "Olive oil"]
      }
    ],

    isPublic: true,
    createdAt: "2024-01-15T10:30:00Z",
    updatedAt: "2024-01-15T10:30:00Z"
  },

  recipeId: 1,
  isSaved: false,
  fromDatabase: false,

  recommendationsUsed: 3,
  recommendationsLimit: 5,

  message: "Recipe loaded successfully!"
};