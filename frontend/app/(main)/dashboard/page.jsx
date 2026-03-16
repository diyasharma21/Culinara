import { getAreas, getCategories, getRecipeOfTheDay } from '@/actions/mealdb.actions';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { getCategoryEmoji, getCountryFlag } from '@/lib/data';
import { ArrowRight, Crown, Earth } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react'

const DashboardPage = async () => {
    const recipeData = await getRecipeOfTheDay();
    const categoriesData = await getCategories();
    const areasData = await getAreas();

    const recipeOfTheDay = recipeData?.recipe;
    const categories = categoriesData?.categories ||[];
    const areas = areasData?.areas ||[];
  return (
    <div className='min-h-screen bg-stone-50 py-16 px-4'>
      <div className='max-w-6xl mx-auto'>
        <div className='mb-5'>
        <h1 className='text-5xl md:text-7xl font-bold text-stone-900 mb-4
            tracking-tight leading-tight'>
                 Authentic Recipes, Eat Daily 🥢
        </h1>
        <p className='text-xl text-stone-600 font-light max-w-2xl'>
            Browse trending dishes from around the world, discover new flavors, and create meals you'll love.
        </p>
        </div>

        {/*Recipe of the Day -Hero Section*/}
        {recipeOfTheDay && (
          <section className='mb-24 relative'>
            <div className='flex items-center gap-2 mb-6'>
              <Crown className="w-6 h-6 text-[#1F5C2E]" />
              <h2 className='text-3xl font-serif font-bold text-stone-900'>
                Today’s Exclusive Creation
              </h2>
            </div>

            <Link href={`/recipe?cook=${encodeURIComponent(
              recipeOfTheDay.strMeal
            )}`}>

              <div className='relative bg-white border-2 border-stone-900
                overflow-hidden hover:border-[#1F5C2E] hover-shadow-lg transition-all duration-300 group cursor-pointer
              '>
                <div className='grid md:grid-cols-2 gap-0'>
                  <div className='relative aspect-4/3 md:aspect-auto border-2
                    md:border-b-0 md:border-r-2 border-stone-900'>
                      <Image
                        src={recipeOfTheDay.strMealThumb}
                        alt={recipeOfTheDay.strMeal}
                        fill
                        className='object-cover'
                      />
                    </div>

                    <div className='p-8 md:p-12 flex flex-col justify-center'>
                      <div className='flex flex-wrap gap-2 mb-6'>
                        <Badge variant='outline'
                          className='border-2 border-[#41a55a] text-[#1F5C2E] bg-[#EAF4EC]
                          font-bold'
                        >
                          {recipeOfTheDay.strCategory}
                        </Badge>

                        <Badge variant='outline'
                          className='border-2 border-stone-900 text-stone-700
                          bg-stone-50 font-bold'
                        >
                          <Earth className='w-3 h-3 mr-1'/>
                          {recipeOfTheDay.strArea}
                        </Badge>
                      </div>

                      <h3 className='text-4xl md:text-5xl font-bold text-stone-900 mb-4
                      group-hover:text-[#2f8143] transition-colors leading-tight'>
                        {recipeOfTheDay.strMeal}
                      </h3>

                      <p className='text-stone-600 mb-6 line-clamp-3 font-light text-lg'>
                        {recipeOfTheDay.strInstructions?.substring(0,200)}...
                      </p>

                      <Button variant='primary' size="lg">
                          Savor It Today<ArrowRight className='w-5 h-5 ml-2'/>
                        </Button>
                    </div>
                </div>
              </div>
            </Link>
          </section>
        )}

        {/*Browse by Categories*/}
        <section className='mb-24'>
          <div className='mb-8'>
            <h2 className='text-4xl md:text-5xl font-bold text-stone-900 mb-2'>
              Explore by Food Category
            </h2>
            <p className='text-stone-600 text-lg font-light'>
              Find recipes organized to match your cravings.
            </p>
          </div>

          <div className='grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4'>
            {categories.map((category) => (
              <Link
                key={category.strCategory}
                href={`/recipes/category/${category.strCategory.toLowerCase() }`}
              >

                <div className='bg-white p-6 border-2 border-stone-200
                hover:border-[#2f8143] hover:shadow-lg transition-all text-center group cursor-pointer'>
                  <div className='text-4xl mb-3'>
                    {getCategoryEmoji(category.strCategory)}
                  </div>
                  <h3 className='font-bold text-stone-900 group-hover:text-[#2f8143] transition-colors text-sm'>
                    {category.strCategory}
                  </h3>
                </div>
              </Link>
            ))}</div>
        </section>

        {/*Browse by Cuisine*/}
         <section className="pb-12">
          <div className="mb-8">
            <h2 className="text-4xl md:text-5xl font-bold text-stone-900 mb-2">
              Taste the World
            </h2>
            <p className="text-stone-600 text-lg font-light">
                Discover authentic dishes from every corner of the world.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {areas.map((area) => (
              <Link
                key={area.strArea}
                href={`/recipes/cuisine/${area.strArea
                  .toLowerCase()
                  .replace(/\s+/g, "-")}`}
              >
                <div className="bg-stone-50 p-5 border-2 border-stone-200 hover:border-[#2f8143] hover:shadow-lg transition-all group cursor-pointer">
                  <div className="flex items-center">
                    <span className="text-3xl gap-3">
                      {getCountryFlag(area.strArea)}
                    </span>
                    <span className="font-bold text-stone-900 group-hover:text-[#2f8143] transition-colors text-sm">
                      {area.strArea}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>


      </div>
    </div>
  )
}

export default DashboardPage;
