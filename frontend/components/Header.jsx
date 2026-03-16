import { SignedIn, SignedOut, SignInButton, SignUpButton, UserButton } from '@clerk/nextjs'
import React from 'react'
import { Button } from './ui/button'
import Link from 'next/link'
import Image from 'next/image'
import {  Bookmark,   GemIcon,   RefrigeratorIcon,  } from 'lucide-react'
import UserDropdown from './UserDropdown'
import { checkUser } from '@/lib/checkUser'
import PricingModal from './PricingModal'
import { Badge } from './ui/badge'
import HowToCookModal from './HowToCookModal'

const Header = async() => {
const user = await checkUser(); // replace with actual user fetching logic
  return (
    <header className='fixed top-0 w-full border-b border-stone-200 bg-stone-50/80 
    backdrop-blur-md z-50 supports-backdrop-filter:bg-stone-50/60'>
      <nav className='container mx-auto px-4 h-16 flex items-center justify-between'>
        <Link href={user ? "/dashboard" : "/"}>
            <Image 
                src="/Culinara Logo.png" 
                alt="Culinara Logo"
                width={140}
                height={140}
                className='w-18'
            />
        </Link>
        
        {/* Navigation Links */}
        <div className="hidden md:flex items-center space-x-8 text-sm font-medium text-stone-800">
  
            <Link
                href="/recipes"
                className="flex gap-1.5 items-center transition-colors duration-200 hover:text-[#3F8E4F]"
            >
            <Bookmark className="w-4 h-4" />
                Saved Recipes
            </Link>

            <Link
                href="/pantry"
                className="flex gap-1.5 items-center transition-colors duration-200 hover:text-[#3F8E4F]"
            >
            <RefrigeratorIcon className="w-4 h-4" />
             My Ingredients
            </Link>

</div>
        <div className='flex items-center space-x-4'>
            <SignedIn>
                {/*How to Cook*/}
                <HowToCookModal/>

{user && (
  <PricingModal subscriptionTier={user.subscriptionTier}>
    <Badge
      variant="outline"
      className={`flex h-8 px-3 gap-1.5 rounded-full text-xs font-semibold transition-all ${
        user.subscriptionTier === "pro"
          ? "!bg-gradient-to-r !from-[#0F3D1F] !to-[#5EDB72] !text-white !border-none shadow-md"
          : "bg-[#EAF4EC] text-[#2E6E3A] border-[#CFE5D4] cursor-pointer hover:bg-[#D7ECDC] hover:border-[#B7D8C2]"
      }`}
    >
      <GemIcon
        className={`h-3 w-3 ${
          user.subscriptionTier === "pro"
            ? "text-white fill-white/20"
            : "text-[#3F8E4F]"
        }`}
      />
      <span>
        {user.subscriptionTier === "pro" ? "Grand Chef" : "Free Access"}
      </span>
    </Badge>
  </PricingModal>

)}
                <UserDropdown/>
                
            </SignedIn>

            <SignedOut>
                <SignInButton mode='modal'>
                    <Button variant='ghost'
                     className="text-stone-600
                    hover:text-[#234924] hover:bg-[#ecfaec]
                     font-medium"
                    >Sign In</Button>
                </SignInButton>
                <SignUpButton mode='modal'>
                    <Button variant='primary' className="rounded-full px-6">
                        Explore Culinara
                    </Button>
                </SignUpButton>
              </SignedOut>
              {/* Show the user button when the user is signed in */}
              
              </div>
              </nav>
    </header>
  )
}

export default Header
