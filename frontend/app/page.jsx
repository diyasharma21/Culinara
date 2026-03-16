import PricingSection from "@/components/PricingSection";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { FEATURES, HOW_IT_WORKS_STEPS, SITE_STATS } from "@/lib/data";
import { auth } from "@clerk/nextjs/server";
import { ArrowRight, ChefHat, Clock, Star, User2, Users, Users2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default async function Home() {
  const { has } = await auth();
  const subscriptionTier = has({ plan: "pro" }) ? "pro" : "free";

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900">
      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row items-center gap-12 md:gap-20">
            
            {/* LEFT SIDE - TEXT */}
            <div className="flex-1 text-center md:text-left">
              
              <Badge
                variant="outline"
                className="border-2 border-[#1F5C2E] text-[#1F5C2E] bg-[#EAF4EC] text-sm font-bold mb-6 uppercase tracking-wide"
              >
                <ChefHat className="mr-1" />
                AI-Powered Culinary Platform
              </Badge>

              <h1 className="text-6xl md:text-8xl font-bold mb-6 leading-[0.9] tracking-tight">
                Redefine{" "}
                <span className="italic underline decoration-4 decoration-[#1F5C2E]">
                  leftovers
                </span>{" "}
                into
                Authenticity.✨
              </h1>

              <p className="text-xl md:text-2xl text-stone-600 mb-10 max-w-lg mx-auto md:mx-0 font-light">
                Snap what’s in your fridge. Unlock personalized recipe ideas instantly.
                Waste less, cook smarter and savor better meals tonight.
              </p>

              <Link href="/dashboard">
                <Button
                  size="xl"
                  variant="primary"
                  className="px-8 py-6 text-lg"
                >
                  Unlock Free Recipes
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>

              <p className="mt-6 text-sm text-stone-500">
                <span className="font-bold text-stone-900">10k+ kitchens </span>
                elevated their everyday cooking
              </p>
            </div>

            {/* RIGHT SIDE - HERO IMAGE */}
              <div className="flex-1 flex justify-center md:justify-end">
              <Card
                className="relative w-full max-w-[420px] aspect-[4/5] md:aspect-4/5 border-4 border-stone-900 bg-stone-200 overflow-hidden py-0"
              >
                <Image
                  src="/noodles.png"
                  alt="Tasty Dish"
                  width={500}
                  height={500}
                  className="w-full h-full object-cover"
                />

     <Card className="absolute bottom-6 left-6 right-8 bg-white/95 backdrop-blur-sm border-2 border-stone-900 py-0">
  <CardContent className="p-3">
    
    {/* Top Row */}
    <div className="flex justify-between items-start mb-3">
      <div>
        <h3 className="font-semibold text-lg text-stone-900">
          Rustic Tomato Basil Pasta
        </h3>

        <div className="flex gap-0.5 mt-1">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className="w-3 h-3 fill-[#D4A017] text-[#D4A017]"
            />
          ))}
        </div>
      </div>

      <Badge
        variant="outline"
        className="border border-green-600 bg-green-50 text-green-700 font-semibold text-xs px-2 py-0.5 rounded-full"
      >
        98% MATCH
      </Badge>
    </div>

    {/* Bottom Row */}
    <div className="flex gap-5 text-xs text-stone-500 font-medium">
      <span className="flex items-center gap-1">
        <Clock className="w-3 h-3" /> 25 mins
      </span>
      <span className="flex items-center gap-1">
        <Users className="w-3 h-3" /> 2 servings
      </span>
    </div>

  </CardContent>
</Card>
              </Card></div>
            </div>

          
        </div>
      </section>

      <section className="py-12 border-y-2 border-stone-900 bg-stone-900">
        <div className="max-w-5xl mx-auto
          grid grid-cols-2 md:grid-cols-4 gap-8
          text-center px-4
        ">
          {SITE_STATS.map((stat, i) => (
            <div key={i}>
              <div className="text-4xl font-bold mb-1 text-stone-50">
                {stat.val}
              </div>
              <Badge
                variant="secondary"
                className="bg-transparent text-green-400 text-sm uppercase tracking-wider font-medium border-none"
              >
                {stat.label}
              </Badge>
            </div>
          ))}
          
        </div>
      </section>

      <section className="py-24 px-4"> 
        <div className="max-w-6xl mx-auto">
          <div className="mb-16">
            <h2 className=" text-5xl md:text-6xl font-bold mb-4">
              Your AI Kitchen
            </h2>
            <p className=" text-stone-600 text-xl font-light">
              Smart tools that transform simple ingredients into remarkable meals.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {FEATURES.map((feature, index) => {
            const IconComponent = feature.icon;
            return (
            <Card
                key={index}
                className="border border-stone-200 bg-white 
                 hover:border-[#2E6E3A] hover:shadow-xl 
                 transition-allgroup  py-0" >
            <CardContent className="p-8">
              <div className="flex justify-between items-start mb-6">
          
                  <div className="border-2 border-stone-200 
                          bg-[#EAF4EC] 
                          p-3 
                          group-hover:border-[#2E6E3A] 
                          group-hover:bg-[#D7ECDC] 
                          transition-colors">
                    <IconComponent className="w-6 h-6 text-[#1F5C2E]" />
                  </div>

          
            <Badge
             variant="secondary"
             className="text-xs font-medium 
                       bg-[#F4F8F5] 
                       text-[#2E6E3A] 
                       uppercase tracking-wide 
                       border border-[#D7ECDC]"
           >
                {feature.limit}
            </Badge>
            </div>

            <h3 className="text-2xl font-semibold mb-3 text-stone-900">
                {feature.title}
            </h3>

            <p className="text-stone-600 text-lg font-light leading-relaxed">
              {feature.description}
            </p>
          </CardContent>
        </Card>
      );
    })}
          </div>
        </div>
      </section>

      <section className="py-24 px-4 border-y-2 border-stone-200 bg-stone-900 text-stone-50">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-5xl md:text-6xl font-bold mb-16">
            Your Meal in 3 Steps
          </h2>

          <div className="space-y-12">
            {HOW_IT_WORKS_STEPS.map ((item, i)=> {
              return(
                <div key={i}>
                  <div className="flex gap-6 items-start">
                    <Badge 
                      variant="outline"
                      className="text-6xl font-bold text-green-400 border-none bg-transparent p-0 h-auto"
                    >
                      {item.step}
                    </Badge>

                    <div>
                      <h3 className="text-2xl font-bold mb-3">
                        {item.title}
                      </h3>
                      <p className="text-lg text-stone-400 font-light">
                        {item.desc}
                      </p>
                    </div>
                    
                  </div>
                  {i < HOW_IT_WORKS_STEPS.length - 1 && (
                      <hr className="my-8 bg-stone-700"/>
                    )}
                </div>
              )
            })}
          </div>
        </div>
      </section>

      <section className="py-24 px-4">
        <div className="max-w-5xl mx-auto">
          <PricingSection subscriptionTier={subscriptionTier} />
        </div>
      </section>
    </div>
  );
}