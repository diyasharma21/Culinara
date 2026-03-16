import { PricingTable } from '@clerk/nextjs'
import React from 'react'

const PricingSection = () => {
  return (
    <div className='max-w-4xl' >
        <div className='mb-16'>
        <h2 className='text-5xl md:text-6xl font-bold mb-4'>Membership Plans</h2>
        <p className='text-xl text-stone-600 font-light'>
            Begin with complimentary access. Upgrade anytime to unlock advanced culinary tools.</p>
        </div>

        <div>
             <PricingTable 
                checkoutProps={{
                    appearance :{
                    elements : {
                    drawerRoot :{
                        zIndex: 2000,
                    }
                }
            }
        }}
        />
        </div>


    </div>
    
    
  )
}

export default PricingSection
