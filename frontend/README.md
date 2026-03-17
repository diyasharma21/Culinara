# 🍳 Culinara – AI-Powered Recipe Platform

Culinara is a full-stack AI-powered recipe platform that helps users discover, generate, and manage recipes based on available ingredients.

🔗 Live App: https://culinara-app.vercel.app/

---

## 🚀 Overview

Culinara allows users to:
- Discover recipes from different cuisines
- Generate recipes using AI
- Manage pantry ingredients
- Unlock premium features with Pro plan
- Save and download recipes

---

## 🔐 Authentication

- Secure authentication is implemented using **Clerk**
- Users can:
  - Sign in with existing accounts
  - Sign up using email
- Authentication flow is seamless and secure

---

## 🏠 Home & Dashboard

- Users can:
  - Sign in or explore the app from the home page
- After login, users are redirected to the dashboard

### Dashboard Features:
- **Daily Featured Recipe**
  - Displays a “Today’s Exclusive Creation”
  - Automatically updates every day

- **Explore by Categories**
  - Browse recipes by food types

- **Taste the World**
  - Explore global cuisines (e.g., Indian, Italian, etc.)

---

## 🌍 Explore Recipes

- Users can:
  - Click on cuisines (e.g., Indian)
  - Browse available dishes
- Recipes are dynamically available based on selection

---

## 🥗 My Ingredients (Pantry Management)

Users can manage their ingredients through multiple methods:

- **Manual Entry**
- **File Upload**
- **AI Scan (Image-based detection)**
- **Camera Scan (Mobile support)**

### Smart Cooking Suggestions:
- Based on added ingredients
- App suggests multiple recipes users can cook instantly

---

## 🤖 AI Recipe Generation

### 1. “What can I cook?”
- Uses pantry ingredients
- Generates multiple recipe suggestions using AI

### 2. “How to Cook” Feature
- Users can search for any dish (e.g., *Masala Dosa*)
- Recipe is generated in real-time using AI

### Loading Experience:
- Smooth and interactive loading UI while generating recipes

---

## 📖 Recipe Details

Each recipe includes:

- Ingredients list
- Preparation & cooking time
- Calories per serving
- Step-by-step instructions

---

## 🔒 Free vs Pro Features

### Free Users:
- Can view:
  - Ingredients
  - Basic instructions

### Pro Users (Grand Chef):
Unlock access to:
- Chef Tips
- Nutrition Facts
- Ingredient Substitutions

---

## 💳 Pro Upgrade

- Users can upgrade to **Pro (Grand Chef)**
- Payment is implemented using **Stripe (Test Mode)**
- After upgrade:
  - All premium features are unlocked instantly

---

## 💾 Save & Download Recipes

Users can:
- Save recipes to their collection
- Download recipes as PDF files

---

## 📚 Saved Recipes

- All saved recipes are stored in a dedicated section
- Users can access them anytime

---

## 🧠 Tech Stack

- **Frontend:** Next.js, React
- **Backend:** Strapi (Headless CMS)
- **Authentication:** Clerk
- **AI Integration:** Gemini API
- **Payments:** Stripe (Test Mode)
- **Image API:** Unsplash
- **Deployment:** Vercel

---

## ⚠️ Note

- Stripe payments are in **test mode**
- No real money is charged

---

## 🎯 Conclusion

Culinara provides a complete AI-driven cooking experience by combining:
- Smart ingredient management
- Real-time recipe generation
- Premium feature unlocking
- Seamless user experience

---
