"use client"

import { UserButton } from '@clerk/nextjs'
import { Bookmark, Refrigerator } from 'lucide-react'
import React from 'react'

const UserDropdown = () => {
  return (
    <UserButton>
        <UserButton.MenuItems>
            <UserButton.Link
              label ="Saved Recipes"
              labelIcon={<Bookmark size={16}/>}
              href="/recipes"
            />
            <UserButton.Link
              label="My Ingredients"
              labelIcon={<Refrigerator size={16}/>}
              href="/pantry"
            />
            <UserButton.Action label="manageAccount"/>
        </UserButton.MenuItems>
    </UserButton>
  )
}

export default UserDropdown
