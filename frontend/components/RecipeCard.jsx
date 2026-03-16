import React from 'react'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card';
import Image from 'next/image';
import Link from 'next/link';
import { Badge } from './ui/badge';
import { ChefHat, Clock, Soup, Users } from 'lucide-react';
import { Button } from './ui/button';

const RecipeCard = ({recipe, variant="default"}) => {

    const getRecipeData = () => {
    // For MealDB recipes (category/cuisine pages)
    if (recipe.strMeal) {
      return {
        title: recipe.strMeal,
        image: recipe.strMealThumb,
        href: `/recipe?cook=${encodeURIComponent(recipe.strMeal)}`,
        showImage: true,
      };
    }
    if (recipe.matchPercentage) {
      return {
        title: recipe.title,
        description: recipe.description,
        category: recipe.category,
        cuisine: recipe.cuisine,
        prepTime: recipe.prepTime,
        cookTime: recipe.cookTime,
        servings: recipe.servings,
        matchPercentage: recipe.matchPercentage,
        missingIngredients: recipe.missingIngredients || [],
        image: recipe.imageUrl, // Add image support
        href: `/recipe?cook=${encodeURIComponent(recipe.title)}`,
        showImage: !!recipe.imageUrl, // Show if image exists
      };
    }

    // For Strapi recipes (saved recipes, search results)
    if (recipe) {
      return {
        title: recipe.title,
        description: recipe.description,
        category: recipe.category,
        cuisine: recipe.cuisine,
        prepTime: recipe.prepTime,
        cookTime: recipe.cookTime,
        servings: recipe.servings,
        image: recipe.imageUrl,
        href: `/recipe?cook=${encodeURIComponent(recipe.title)}`,
        showImage: !!recipe.imageUrl,
      };
    }



    // more conditions
    return{};
    }

    const data = getRecipeData();

    if (variant === "grid") {
    return (
      <Link href={data.href}>
        <Card className="rounded-none overflow-hidden border-stone-200 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer group pt-0">
          {/* Image */}
          {data.showImage ? (
            <div className="relative aspect-square">
              <Image
                src={data.image}
                alt={data.title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />

              <div className='absolute inset-0 bg-linear-to-t from-black/60
               via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity'>
                <div className='absolute bottom-0 left-0 right-0 p-4'>
                    <p className='text-white text-sm font-medium'>
                        Click to View Recipe
                    </p>
                </div>
               </div>
                        </div>): (<div></div>)} 

                        <CardHeader className='text-lg font-bold text-stone-900 group-hover:text-[#2f8143] transition-colors line-clamp-2'>
                            {data.title}
                        </CardHeader>
                </Card>
            </Link>
    )}

    if (variant==='pantry') {
      return(<Card>
        <CardHeader>
          <div className='flex justify-between items-start'>
            <div className='flex-1'>
              <div className='flex flex-wrap gap-2 mb-3'>
                {data.cuisine && (
                  <Badge
                    variant='outline'
                    className='text-[#2f8143] border-green-200 capitalize'
                  >
                    {data.cuisine}
                  </Badge>
                )}
                {data.category && (
                  <Badge
                    variant='outline'
                    className='text-stone-600 border-stone-200 capitalize'
                  >
                    {data.category}
                  </Badge>
                )}
              </div>
            </div>

            {/* match Percentage Bagde */}
            {data.matchPercentage && (
              <div className='flex flex-col items-end gap-1'>
                <Badge 
                  className={`${
                    data.matchPercentage >= 90
                    ? "bg-[#a97a05]"
                    : data.matchPercentage >= 75
                    ? "bg-[#2f8143]"
                    : "bg-stone-600"
                  } text-white text-lg px-3 py-1`}
                >
                  {data.matchPercentage}%
                </Badge>
                <span className='text-xs to-stone-500'>Match</span>
              </div>
            )}
          </div>
          <CardTitle className='text-2xl font-serif font-bold text-stone-900'>
            {data.title}
          </CardTitle>
          {data.description && (
          <CardDescription className='text-stone-600 leading-relaxed mt-2'> 
            {data.description}
          </CardDescription>
        )}
        </CardHeader>

        <CardContent className="space-y-4 flex-1">
          {/* Time & Servings */}
          {(data.prepTime || data.cookTime || data.servings) && (
            <div className="flex gap-4 text-sm text-stone-500">
              {(data.prepTime || data.cookTime) && (
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  <span>
                    {parseInt(data.prepTime || 0) +
                      parseInt(data.cookTime || 0)}{" "}
                    mins
                  </span>
                </div>
              )}
              {data.servings && (
                <div className="flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  <span>{data.servings} servings</span>
                </div>
              )}
            </div>
          )}

          {/* Missing Ingredients */}
          {data.missingIngredients && data.missingIngredients.length > 0 && (
            <div className="p-4 bg-green-50 border border-green-100">
              <h4 className="text-sm font-semibold text-green-900 mb-2">
                You&apos;ll need:
              </h4>
              <div className="flex flex-wrap gap-2">
                {data.missingIngredients.map((ingredient, i) => (
                  <Badge
                    key={i}
                    variant="outline"
                    className="text-[#2f8143] border-green-200 bg-white"
                  >
                    {ingredient}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </CardContent>
        <CardFooter>
          <Link href={data.href} className='w-full'>
            <Button className='w-full bg-[#a97a05] hover:bg-[#6e5106] text-white gap-2'>
              <Soup className='w-4 h-4'/>
               View Full recipe
            </Button>
          </Link>
        </CardFooter>
      </Card>
    )}

    if (variant === 'list') {
      return(
      <Link href={data.href}>
        <Card className='rounded-none border-stone-200 hover:shadow-lg hover:border-green-200 transition-all cursor-pointer group overflow-hidden py-0'>
          <div className='flex flex-col md:flex-row'>
            {/* image - if available */}
            {data.showImage ? (
              <div className='relative w-full md:w-48 aspect-video md:aspect-square flex-shrink-0'>
                <Image
                 src={data.image}
                 alt={data.title}
                 fill
                 className='object-cover group-hover:scale-105 transition-transform duration-500'
                 sizes='(max-width: 768px) 100vw, 192px'
                />
              </div>
            ) :(
              //Fallback gradient when no image
              <div className='relative w-full md:w-48 aspect-video md:aspect-square flex-shrink-0 bg-gradient-to-br from-green-400 to-emerald-400 flex items-center justify-center'>
                <ChefHat className='w-12 h-12 text-white/30'/>
              </div>
            )}
          
    {/* content */}
    <div className='flex-1 py-5'>
      <CardHeader>
        <div className='flex flex-wrap gap-2 mb-2'>
          {data.cuisine && (
            <Badge
             variant='outline'
             className='text-[#2f8143] border-green-200 capitalize'
            >
              {data.cuisine}
            </Badge>
          )}
          {data.category &&(
            <Badge
             variant='outline'
             className='text-stone-600 border-stone-200 capitalize'
            >
              {data.category}
            </Badge>
          )}
        </div>
        <CardTitle className='text-xl font-bold text-stone-900 group-hover:text-[#2f8143] transition-colors'>
          {data.title}
        </CardTitle>

        {data.description &&(
          <CardDescription className='line-clamp-2'>
            {data.description}
          </CardDescription>
        )}
      </CardHeader>

       {(data.prepTime || data.cookTime || data.category) && (
          <CardContent>
            <div className='flex gap-4 text-sm text-stone-500 pt-4'>
              {(data.prepTime || data.cookTime) && (
                <div className='flex items-center gap-1'>
                  <Clock className='w-4 h-4'/>
                  <span>
                    {parseInt(data.prepTime || 0) +
                     parseInt(data.cookTime || 0)}{" "}
                     mins
                  </span>
                </div>
              )}
              {data.servings &&(
                <div className='flex items-center gap-1'>
                  <Users className='w-4 h-4'/>
                  <span>{data.servings} Servings</span>
                </div>
              )}
            </div>
          </CardContent>
       )}
      </div>
    </div>
    </Card>
  </Link>
  )}
  return (
    <></>
  )
}

export default RecipeCard
