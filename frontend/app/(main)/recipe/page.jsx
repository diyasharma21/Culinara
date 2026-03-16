"use client"
import { getOrGenerateRecipe, removeRecipeFromCollection, saveRecipeToCollection } from '@/actions/recipe.actions'
import ProLockedSection from '@/components/ProLockedSection'
import { RecipePDF } from '@/components/RecipePDF'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import useFetch from '@/hooks/use-fetch'
import { PDFDownloadLink } from '@react-pdf/renderer'
import { AlertOctagon, ArrowLeft, Bookmark, BookmarkCheck, BookmarkCheckIcon, CheckSquare, CheckSquare2, ChefHat, Clock, DownloadCloud, FlameIcon, Lightbulb, Loader2, Users } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useSearchParams, useRouter } from 'next/navigation'
import  { Suspense,  useEffect,  useState } from 'react'
import { ClockLoader } from 'react-spinners'
import { toast } from 'sonner'


function RecipeContent() {
    const searchParams = useSearchParams()
    const recipeName = searchParams.get("cook")
    const router = useRouter()

    const [recipe, setRecipe] = useState(null);
    const [recipeId, setRecipeId] = useState(null);
    const [isSaved, setIsSaved] = useState(false)

    
  // Get or generate recipe
  const {
    loading: loadingRecipe,
    data: recipeData,
    fn: fetchRecipe,
  } = useFetch(getOrGenerateRecipe);

  // Save to collection
  const {
    loading: saving,
    data: saveData,
    fn: saveToCollection,
  } = useFetch(saveRecipeToCollection);

  // Remove from collection
  const {
    loading: removing,
    data: removeData,
    fn: removeFromCollection,
  } = useFetch(removeRecipeFromCollection);

  // Fetch recipe on mount
  useEffect(() => {
    if (recipeName && !recipe) {
      const formData = new FormData();
      formData.append("recipeName", recipeName);
      fetchRecipe(formData);
    }
  }, [recipeName]);

  // Update recipe when data arrives
  useEffect(() => {
    if (recipeData?.success) {
      setRecipe(recipeData.recipe);
      setRecipeId(recipeData.recipeId);
      setIsSaved(recipeData.isSaved);

      if (recipeData.fromDatabase) {
        toast.success("Recipe loaded from database");
      } else {
        toast.success("New recipe generated and saved!");
      }
    }
  }, [recipeData]);

  // Handle save success
  useEffect(() => {
    if (saveData?.success) {
      if (saveData.alreadySaved) {
        toast.info("Recipe is already in your collection");
      } else {
        setIsSaved(true);
        toast.success("Recipe saved to your collection!");
      }
    }
  }, [saveData]);

  // Handle remove success
  useEffect(() => {
    if (removeData?.success) {
      setIsSaved(false);
      toast.success("Recipe removed from collection");
    }
  }, [removeData]);

  // Toggle save/unsave
  const handleToggleSave = async () => {
    if (!recipeId) return;

    const formData = new FormData();
    formData.append("recipeId", recipeId);

    if (isSaved) {
      await removeFromCollection(formData);
    } else {
      await saveToCollection(formData);
    }
  };


  //no recipe name in url
  if(!recipeName) {
    return( <div className='min-h-screen bg-stone-50 pt-24 pb-16'>
        <div className='container mx-auto max-w-4xl text-center py-20'>
            <div className='bg-green-50 w-20 h-20 border-2 border-green-200 flex items-center justify-center mx-auto mb-6'>
                <AlertOctagon className='w-10 h-10 text-[#2f8143]'/>
            </div>
            <h2 className='text-2xl font-bold text-stone-900 mb-2'>
                Recipe Not Specified
            </h2>
            <p className='text-stone-600 mb-6 font-light'>
                Pick a Recipe from the Dashboard to to discover the Full Recipe. 
            </p>
            <Link href="/dashboard">
                <Button variant='primary'>
                    Return to Dashboard
                </Button>
            </Link>
        </div>
    </div>
  )}
 
  console.log(recipe, recipeData)

  if(loadingRecipe === null || loadingRecipe){
    return (<div className='min-h-screen bg-stone-50 pt-24 pb-16'>
        <div className='container mx-auto max-w-4xl text-center py-20'>
          <ClockLoader className='mx-auto mb-6' color="#2f8143"/>
          <h2 className='text-3xl font-bold text-stone-900 mb-2 tracking-tight'>
            Creating Your Recipe
          </h2>
          <p className='text-stone-600 font-light'>
            Our AI Chef is generating the step-by-step Cooking Guide for{" "}
            <span className='font-bold text-[#2f8143]'>{recipeName}</span>
            ...
          </p>
          <div className='mt-8 max-w-md mx-auto'>
            <div className='flex items-center gap-3 text-sm text-stone-500'>
                <div className='flex-1 h-1 bg-stone-200 overflow-hidden relative'>
                    <div className='absolute left-0 top-0 h-full bg-[#2f8143] animate-slow-fill'/>
                </div>
            </div>
          </div>
        </div>
    </div>
  )}

  //error state
  if(loadingRecipe === false && !recipe){
    return(
        <div className='min-h-screen bg-stone-50 pt-24 pb-16'>
            <div className='container mx-auto max-w-full text-center py-20'>
                <div className='bg-green-50 w-20 h-20 border-2 border-green-200 flex items-center justify-center mx-auto mb-6'>
                    <AlertOctagon className='w-10 h-10  text-[#2f8143] '/>
                </div>
                <h2 className='text-2xl font-bold text-stone-900 mb-2'>
                    Unable to Generate the Recipe
                </h2>
                <p className='text-stone-600 mb-6 font-light'>
                  Something went wrong while generating the recipe. Please try again.
                </p>

                <div className='flex gap-3 justify-center'>
                    <Button
                     onClick={() => router.back()}
                     variant='outline'
                     className='border-2 border-stone-900 hover:bg-stone-900 hover:text-white'
                    >
                        <ArrowLeft className='w-4 h-4 mr-2'/>
                        Back to Recipes
                    </Button>
                    <Button 
                     onClick={() => window.location.reload()}
                     variant='primary'
                    >
                        Retry 
                    </Button>
                </div>
            </div>
        </div>
    
  )}

    return(
        <div className='min-h-screen bg-stone-50 pt-24 pb-16 '>
            <div className='container mx-auto max-w-4xl '>
                <div className='mb-8'>
                    <Link
                     href='/dashboard'
                     className='inline-flex items-center gap-2 text-stone-600 hover:text-[#2f8143]  transition-colors mb-2 font-medium'
                    >
                        <ArrowLeft className='w-4 h-4'/>
                        Return to Dashboard
                    </Link>

                    <div className='bg-white p-8 md:p-10 border-2 border-stone-200 mb-6'>
                        {recipe.imageUrl && (
                            <div className='relative w-full h-72 overflow-hidden mb-7'>
                                <Image
                                  src={recipe.imageUrl}
                                  alt={recipe.title}
                                  fill
                                  className='object-cover'
                                  sizes='(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px '
                                  priority
                                />
                            </div>
                        )}

                        <div className='flex flex-wrap gap-2 mb-4'>
                            <Badge
                              variant='outline'
                              className='text-[#2f8143] border-2 border-green-200 capitalize'
                            >
                                {recipe.cuisine}
                            </Badge>
                            <Badge
                              variant='outline'
                              className='text-stone-600 border-2 border-stone-200 capitalize'
                            >
                                {recipe.category}
                            </Badge>
                        </div>

                        {/* Title */}
                        <h1 className='text-4xl md:text-5xl font-bold text-stone-900 mb-4 tracking-tight'>
                            {recipe.title}
                        </h1>

                        {/* Description */}
                        <p className='text-lg text-stone-600 mb-6 font-light'>
                            {recipe.description}
                        </p>

                        <div className='flex flex-wrap gap-6 text-stone-600 mb-6'>
                            <div className='flex items-center gap-2'>
                                <Clock className='w-5 h-5 text-[#2f8143] '/>
                                <span className='font-medium'>
                                    {parseInt(recipe.prepTime) + parseInt(recipe.cookTime)} mins total
                                </span>
                            </div>

                            <div className='flex items-center gap-2'>
                                <Users className='w-5 h-5 text-[#2f8143] '/>
                                <span className='font-medium'>
                                    {recipe.servings} servings
                                </span>
                            </div>

                            {recipe.nutrition?.calories && (
                                <div className='flex items-center gap-2'>
                                    <FlameIcon className='w-5 h-5 text-[#2f8143] '/>
                                    <span className='font-medium'>
                                        {recipe.nutrition.calories} cal/serving
                                    </span>
                                </div>
                            )}
                        </div>

                        <div className='flex flex-wrap gap-3'>
                            <Button
                              onClick={handleToggleSave}
                              disabled={saving || removing}
                              className={`${
                                isSaved
                                 ? "bg-[#a97a05] hover:bg-[#6e5106] border-2 border-[#a77a0a]"
                                 : "bg-[#2f8143] hover:bg-[#0d5f18] border-2 border-[#0d5f18]"
                              } text-white gap-2 transition-all`}
                            >
                                {saving || removing ? (
                                    <>
                                      <Loader2 className='w-4 h-4 animate-spin'/>
                                      {saving ? "Saving..." : "Removing..."}
                                    </>
                                ) : isSaved ? (
                                    <>
                                     <BookmarkCheck className='w-4 h-4'/>
                                       Saved to Recipes
                                    </>
                                ):(
                                    <>
                                     <Bookmark className='w-4 h-4'/>
                                     Save to Recipes
                                    </>
                                )}
                            </Button>

                            {/* PDF download button */}
                             <PDFDownloadLink
                                document={<RecipePDF recipe={recipe} />}
                                fileName={`${recipe.title
                                  .replace(/\s+/g, "-")
                                  .toLowerCase()}.pdf`}
                            >
                                {({ loading }) => (
                                  <Button
                                    variant="outline"
                                    className="border-2 border-[#2f8143] text-[#2f8143] hover:bg-green-50 gap-2"
                                    disabled={loading}
                                  >
                                    <DownloadCloud className="w-4 h-4" />
                                    {loading ? "Preparing PDF..." : "Download PDF"}
                                  </Button>
                                )}
                            </PDFDownloadLink>
                        </div>
                    </div>
                </div>

                <div className='grid lg:grid-cols-3 gap-6'>
                    {/* left col- ingredients and nutrition */}
                    <div className='lg:col-span-1 space-y-6'>
                        <div className='bg-white p-6 border-stone-200 lg:sticky lg:top-24'>
                            <h2 className='text-2xl font-bold text-stone-900 mb-4 flex items-center gap-2'>
                                <ChefHat className='w-6 h-6 text-[#2f8143]'/>
                                 Ingredients
                            </h2>

                            {Object.entries(
                                recipe.ingredients.reduce((acc, ing) => {
                                    const cat = ing.category || "Other";
                                    if (!acc[cat]) acc[cat] =[];
                                    acc[cat].push(ing);
                                    return acc
                                }, {})
                            ).map(([category, items]) => (
                                <div key={category} className='mb-6 last:mb-0'>
                                    <h3 className='text-sm font-bold text-stone-500 uppercase tracking-wide mb-3'>
                                        {category}
                                    </h3>

                                    <ul className='space-y-2'>
                                        {items.map((ingredient, i) => (
                                            <li
                                             key={i}
                                             className='flex justify-between items-start gap-2 text-stone-700 py-2 border-b border-stone-100 last:border-0'
                                            >
                                                <span className='flex-1 break-words'>{ingredient.item}</span>
                                                <span className='font-bold text-[#2f8143] text-sm break-words text-right max-w-[130px]'>
                                                    {ingredient.amount}
                                                </span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ))}

                            {/* nutrition info */}
                            {recipe.nutrition  && (
                                <div className='mt-6 pt-6 border-t-2 border-stone-200'>
                                    <h3 className='font-bold text-stone-900 mb-3 uppercase tracking-wide text-sm'>
                                        Nutrition Facts
                                    </h3> 
                                     <ProLockedSection
                                         isPro={recipeData.isPro}
                                         lockText="Nutrition info is Pro-only"
                                     >
                                      
                                      <div className="grid grid-cols-2 gap-3">
                                       <div className="bg-green-50 p-3 text-center border-2 border-green-100">
                                        <div className="text-2xl font-bold text-[#2f8143]">
                                        {recipe.nutrition.calories}
                                      </div>
                                      <div className="text-xs text-stone-500 font-bold uppercase tracking-wide">
                                        Calories
                                      </div>
                                    </div>

                                    <div className="bg-stone-50 p-3 text-center border-2 border-stone-100">
                                      <div className="text-2xl font-bold text-stone-900 leading-tight">
                                        {recipe.nutrition.protein}
                                     </div>
                                      <div className="text-xs text-stone-500 font-bold uppercase tracking-wide mt-2">
                                        Protein
                                      </div>
                                    </div>

                                     <div className="bg-stone-50 p-3 text-center border-2 border-stone-100">
                                      <div className="text-2xl font-bold text-stone-900 leading-tight">
                                       {recipe.nutrition.carbs}
                                     </div>
                                     <div className="text-xs text-stone-500 font-bold uppercase tracking-wide mt-2">
                                       Carbs
                                     </div>
                                    </div>

                                    <div className="bg-stone-50 p-3 text-center border-2 border-stone-100">
                                      <div className="text-2xl font-bold text-stone-900 leading-tight">
                                        {recipe.nutrition.fat}
                                      </div>
                                      <div className="text-xs text-stone-500 font-bold uppercase tracking-wide mt-2">
                                        Fat
                                      </div>
                                    </div>
                                  </div>
                                  </ProLockedSection>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* right col- instructions & tips */}
                    <div className='lg:col-span-2 space-y-6'>
                        <div className='bg-white p-8 border-2 border-stone-200'>
                            <h2 className='text-2xl font-bold text-stone-900 mb-6'>
                                Step-by-Step Instructions
                            </h2>

                            <div>
                                {recipe.instructions.map((step, index) => (
                                    <div
                                     key={step.step}
                                     className={`relative pl-12 pb-8 ${
                                        index !== recipe.instructions.length - 1
                                        ? "border-l-2 border-green-300 ml-5"
                                        : "ml-5"
                                     }`}
                                    >
                                        {/* Step Number */}
                                        <div className='absolute -left-5 top-0 w-10 h-10 bg-[#2f8143] text-white flex
                                         items-center justify-center font-bold border-2 border-[#2b743c] '>
                                            {step.step}
                                         </div>

                                         <div>
                                            <h3 className='font-bold text-lg text-stone-900 mb-2'>
                                                {step.title}
                                            </h3>
                                            <p className='text-stone-700 font-light mb-3'>
                                                {step.instruction}
                                            </p>

                                            {step.tip && (
                                                <div className='bg-green-50 border-l-4 border-[#2f8143] p-4'>
                                                    <p className='text-sm text-[#024112] flex items-start gap-2'>
                                                        <Lightbulb className='w-4 h-4 mt-0.5 shrink-0 fill-[#2f8143]'/>
                                                        <span>
                                                            <strong className='font-bold'>Pro Tip:</strong>{" "}
                                                            {step.tip}
                                                        </span>
                                                    </p>
                                                </div>
                                            )}
                                         </div>
                                    </div>
                                ))}
                            </div>

                            <div className='mt-8 p-6 bg-gradient-to-br from-yellow-50 to-amber-50 border-2 border-[#FFF5D6]'>
                                <div className='flex items-start gap-3'>
                                    <CheckSquare2 className='w-6 h-6 text-[#c1920a] flex-shrink-0 mt-0.5'/>
                                    <div>
                                        <h3 className='font-bold text-[#6e5106] mb-1'>
                                            And That's it!
                                        </h3>
                                        <p className='text-sm text-[#a97a05] font-light'>
                                            Your {recipe.title} is ready to Serve and Enjoy every Bite! 
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {recipe.tips && recipe.tips.length >0 && (
                            <div className='bg-gradient-to-br from bg-green-50 to-emerald-50 p-8 border-2 border-green-200'>
                                <h2 className='text-2xl font-bold text-stone-900 mb-4 flex items-center gap-2'>
                                    <Lightbulb className='w-6 h-6 text-[#2f8143] fill-[#2f8143]'/>
                                    Chef's Secret Tips
                                    {!recipeData.isPro &&(
                                        <span className='text-xs bg-green-100 text-[#2f8143]  px-2 py-0.5 rounded-full font-semibold'>
                                            PRO
                                        </span>
                                    )}
                                </h2>

                                <ProLockedSection
                                 isPro={recipeData.isPro}
                                 lockText="Chef tips are Pro-only"
                                 ctaText="Unlock Pro Tips →"
                                >

                                <ul className='space-y-3'>
                                    {recipe.tips.map((tip,i) => (
                                        <li
                                         key={i}
                                         className='flex items-start gap-3 text-stone-700'
                                        >
                                            <CheckSquare2 className='w-5 h-5 text-[#2f8143] flex-shrink-0 mt-0.5'/>
                                            <span className='font-light'>{tip}</span>
                                        </li>
                                    ))}
                                </ul>
                                </ProLockedSection>
                            </div>
                        )}

                        {recipe.substitutions && recipe.substitutions.length >0 && (
                            <div className='bg-white p-8 border-2 border-stone-200'>
                                <h2 className='text-2xl font-bold text-stone-900 mb-4 flex items-center gap-2'>
                                    Ingredient Substitutions
                                    {!recipeData.isPro && (
                                        <span className='text-xs bg-green-100 text-[#2f8143]  px-2 py-0.5 rounded-full font-semibold'>
                                            PRO
                                        </span>
                                    )}
                                </h2>

                                <p className='text-stone-600 mb-6 text-sm font-light'>
                                    Missing an Ingredient? These alternatives will work well:
                                </p>

                                <ProLockedSection
                                  isPro={recipeData.isPro}
                                  lockText="Substitutions are Pro-only"
                                >

                                <div className='space-y-4'>
                                    {recipe.substitutions.map((sub, i) => (
                                        <div
                                         key={i}
                                         className='border-b-2 border-stone-100 pb-4 last:border-0 last:pb-0'
                                        >
                                            <h3 className='font-bold text-stone-900 mb-2'>
                                                Instead of{" "}
                                                <span className='text-[#2f8143]'>
                                                    {sub.original}
                                                </span>
                                                :
                                            </h3>
                                            <div className='flex flex-wrap gap-2'>
                                                {sub.alternatives.map((alt,j) => (
                                                    <Badge
                                                     key={j}
                                                     variant='outline'
                                                     className='text-stone-600 border-2 border-stone-200'
                                                    >
                                                        {alt}
                                                    </Badge>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                </ProLockedSection>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    ) 
}
export default function Recipepage() {
  return (
    <Suspense fallback={
        <div className='min-h-screen bg-stone-50 pt-24 pb-16 px-4'>
            <div className='container mx-auto max-w-4xl text-center py-20'>
              <Loader2 className='w-16 h-16 text-[#2f8143] animate-spin mx-auto mb-6'/>
              <p className='text-stone-600'>Loading recipe...</p>
            </div>
    </div>
    }>
    <RecipeContent/>
    </Suspense>
  )
}


