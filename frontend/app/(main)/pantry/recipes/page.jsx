"use client"

import { getRecipesByPantryIngredients } from '@/actions/recipe.actions'
import PricingModal from '@/components/PricingModal'
import RecipeCard from '@/components/RecipeCard'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import useFetch from '@/hooks/use-fetch'
import { AlertOctagon, ArrowLeft, ChefHat, Gem, Lightbulb, Loader2, ShoppingCart, SparklesIcon } from 'lucide-react'
import Link from 'next/link'
import React, { useEffect } from 'react'

const PantryRecipesPage = () => {

    const{
        loading,
        data: recipesData,
        fn: fetchSuggestions,
    } = useFetch(getRecipesByPantryIngredients)

    //load suggestions on mount
    useEffect(()=> {
        fetchSuggestions()
    },[])

    const recipes = recipesData?.recipes || []
    const ingredientsUsed = recipesData?.ingredientsUsed || ""
  return (
    <div className='min-h-screen bg-stone-50 pt-24 pb-16 px-4'>
      <div className='container mx-auto max-w-6xl'>
        <div className='mb-8'>
            <Link
             href="/pantry"
             className='inline-flex items-center gap-2 text-stone-600 hover:text-[#2f8143]
             transition-colors mb-4 font-medium'
            >
                <ArrowLeft className='w-4 h-4'/>
                Back to My Ingredients
            </Link>

            <div className='flex items-center gap-3 mb-6'>
                <ChefHat className='w-16 h-16 text-[#a97a05]'/>
                <div>
                    <h1 className='text-4xl md:text-5xl font-bold text-stone-900 tracking-tight'> 
                      What Meals Await In Your Pantry?
                    </h1>
                    <p className='text-stone-600 font-light'>
                        Get AI-Powered Recipe Suggestions from Your Ingredients
                    </p>
                </div>
            </div>

            {/* Ingredients Used */}
            {ingredientsUsed && (
                <div className='bg-white p-4 border-2 border-stone-200 mb-4'>
                    <div className='flex items-start gap-3'>
                    <ShoppingCart className='w-5 h-5 text-[#2f8143] mt-0.5 shrink-0'/>
                    <div>
                        <h3 className='font-bold text-stone-900 mb-1'>
                            Ingredients You Have:
                        </h3>
                        <p className='text-stone-600 text-sm font-light'>
                            {ingredientsUsed}
                        </p>
                    </div>
                    </div>
                </div>
            )}

            {recipesData !== undefined && (
                <div className='bg-green-50 p-4 border-2 border-green-200 inline-flex items-center gap-3'>
                    <Gem className='w-5 h-5 text-[#2f8143]'/>
                    <div className='text-sm'>
                        {recipesData.recommendationsLimit === "unlimited" ? (
                            <>
                              <span className='font-bold text-[#a97a05]'>∞</span>
                              <span className='text-[#2f8143] font-light'>
                                {" "}
                                Unlimted AI Recommendations (Pro Plan)
                              </span>
                            </>
                        ) : (
                            <span className='text-[#2f8143] font-light'>
                                Upgrade To Pro for Unlimited AI Recommendations
                            </span>
                        )}
                    </div>
                </div>
            )}
        </div>

        {/*Loading State */}
        {loading && (
            <div className='flex flex-col items-center justify-center py-20'>
                <Loader2 className='w-12 h-12 text-[#a97a05] animate-spin mb-6'/>
                <h2 className='text-2xl font-bold text-stone-900 mb-2'>
                    Finding Delicious Recipes...
                </h2>
                <p className='text-stone-600 font-light'>
                    Our AI Chef is Scanning your Ingredients to Generate Meals you can Cook
                </p>
            </div>
        )}

        {/*Recipe Grid- Using Recipe Card Component */}
        {!loading && recipes.length > 0 && (
  <div>
    <div className="flex items-center justify-between mb-6">
      
      <div>
        <div className="flex items-center gap-2 mb-1">
          <Lightbulb className="w-5 h-5 text-[#a97a05]" />
          <h2 className="text-2xl font-bold text-stone-900">
            Recipes You Can Cook
          </h2>
        </div>

        
      </div>

      <Badge
        variant="outline"
        className="border-2 border-stone-900 text-stone-900 font-bold uppercase tracking-wide"
      >
        {recipes.length} {recipes.length === 1 ? "recipe" : "recipes"}
      </Badge>
    </div>

    <div className="grid md:grid-cols-2 gap-6">
      {recipes.map((recipe, index) => (
        <RecipeCard key={index} recipe={recipe} variant="pantry" />
      ))}
    </div>

    <div className='mt-8 text-center'>
        <Button
         onClick={() => fetchSuggestions(new FormData())}
         variant='outline'
         className='border-2 border-stone-900 hover:bg-stone-900 hover:text-white gap-2'
         disabled={loading}
        >
            {loading ? (
                <>
                <Loader2 className='w-4 h-4 animate-spin'/>
                 AI is Generating
                </>
            ): (
                <>
                    <SparklesIcon className='w-4 h-4'/>
                        Generate New Recipes
                </>
            )}
        </Button>
    </div>
  </div>
)}

        {/*Empty Pantry state */}
         {!loading && recipes.length === 0 && recipesData?.success === false && (
            <div className='bg-white p-12 text-center border-2 border-dashed border-stone-200'>
                <div className='bg-green-50 w-20 h-20 border-2 border-green-200 flex items-center justify-center mx-auto mb-6'>
                    <AlertOctagon className='w-10 h-10 text-[#2f8143]  '/>
                </div>
                <h3 className='text-2xl font-bold text-stone-900 mb-2'>
                    No Ingredients Added Yet
                </h3>
                <p className='text-stone-600 mb-8 max-w-md mx-auto font-light'>
                    Add Ingredients to your Pantry First so our AI CHEF can suggest you the Yummy Recipes to make!
                </p>
            </div>
         )}
         {!loading && recipesData === undefined && (
  <div className="bg-gradient-to-br from-[#F3FAF5] to-[#EAF4EC] p-12 text-center border-2 border-[#CFE6D4]">

    <div className="bg-[#EAF4EC] w-20 h-20 border-2 border-[#CFE6D4] flex items-center justify-center mx-auto mb-6">
      <Gem className="w-10 h-10 text-[#2F8143]" />
    </div>

    <h3 className="text-2xl font-bold text-stone-900 mb-2">
      AI Recommendations Limit Reached
    </h3>

    <p className="text-stone-600 mb-8 max-w-md mx-auto font-light">
      You’ve used all your AI recipe suggestions this month. Upgrade to Pro to unlock unlimited personalized recipe ideas.
    </p>
    <PricingModal>
        <Button 
            variant='primary'
            className='gap-2'
        >
            <Gem className='w-4 h-4'/>
             Get Unlimited AI Recipes
        </Button>
    </PricingModal>

  </div>
)}
      </div>
    </div>
  )
}

export default PantryRecipesPage
