"use client"

import { deletePantryItem, getPantryItems, updatePantryItem } from '@/actions/pantry.actions'
import AddToPantryModal from '@/components/AddToPantryModal'
import PricingModal from '@/components/PricingModal'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import useFetch from '@/hooks/use-fetch'
import { Check, ChefHat, Gem, Loader, Loader2, Plus, ShoppingCart, SquarePen, Trash2, X } from 'lucide-react'
import Link from 'next/link'
import React, { use, useEffect, useState } from 'react'
import { toast } from 'sonner'

const PantryPage = () => {
    const[isModalOpen, setIsModalOpen] = useState(false)
    const[items, setItems] = useState([])
    const[edittingId, setEdittingId] = useState(null)
    const[editValues, setEditValues]= useState({ name: "", quantity:""})

    const {
    loading: loadingItems,
    data: itemsData,
    fn: fetchItems,
    } = useFetch(getPantryItems);

    const {
        loading: deleting,
        data: deleteData,
        fn: deleteItem,
    } = useFetch(deletePantryItem);

    const {
        loading: updating,
        data: updateData,
        fn: updateItem
    } = useFetch(updatePantryItem)

    useEffect(()=> {
        fetchItems()
    }, [])

    useEffect(() => {
        if (itemsData?.success) {
            setItems(itemsData.items)
        }
    }, [itemsData])

    //refresh after delete
    useEffect(() => {
        if(deleteData?.success && !deleting){
            toast.success("Item Removed form Pantry")
            fetchItems()
        }
    }, [deleteData])

    //refresh after update
    useEffect(() => {
        if(updateData?.success){
            toast.success("Item Updated SuccessFully")
            setEdittingId(null)
            fetchItems()
        }
    }, [updateData])

    //handle delete
    const handleDelete= async (itemId) => {
        const formData= new FormData()
        formData.append("itemId", itemId)
        await deleteItem(formData)
    }

    //start edit
    const startEdit =(item) =>{
        setEdittingId(item.documentId)
        setEditValues({
            name: item.name,
            quantity: item.quantity,
        })
    }

    //save edit
    const saveEdit = async ()=> {
        const formData = new FormData()
        formData.append("itemId", edittingId)
        formData.append("name", editValues.name)
        formData.append("quantity", editValues.quantity)
        await updateItem(formData)
    }

    //cancel edit
    const cancelEdit =()=>{
        setEdittingId(null)
        setEditValues({ name: "", quantity: ""})
    }


    const handleModalSuccess =()=>{
        fetchItems()
    }
  return (
    <div className='min-h-screen bg-stone-50 pt-24 pb-16 px-4'>
        <div className='container mx-auto max-w-5xl'>
            <div className='mb-4'>
                <div className='flex items-center justify-between mb-6'>
                    <div className='flex items-center gap-3'>
                        <ShoppingCart className='w-16 h-16 text-[#2f8143]'/>
                        <div>
                            <h1 className='text-4xl md:text-5xl font-bold text-stone-900 tracking-tight'>
                                My Ingredients
                            </h1>
                            <p className='text-stone-600 font-light mt-1'>
                                Organize your pantry, scan what you have, and discover Recipes you can cook instantly.
                            </p>
                        </div>
                    </div>

                    <Button
                        onClick={() => setIsModalOpen(true)}
                        className='hidden md:flex' size='lg' variant='primary'>
                            <Plus className='w-5 h-5'/>
                            Add Ingredients
                    </Button>
                </div>

                {itemsData?.scansLimit !== undefined && (
            <div className="bg-white py-3 px-4 border-2 border-stone-200 inline-flex items-center gap-3">
              <Gem className="w-5 h-5 text-[#2f8143]" />
              <div className="text-sm">
                {itemsData.scansLimit === "unlimited" ? (
                  <>
                    <span className="font-bold text-[#F59E0B]">∞</span>
                    <span className="text-stone-500">
                      {" "}
                      Unlimited AI Scans (Pro Plan)
                    </span>
                  </>
                ) : (
                  <PricingModal>
                    <span className="text-stone-500 cursor-pointer">
                      Upgrade to Pro for Unlimited Ingredients Scans
                    </span>
                  </PricingModal>
                )}
                            </div>
                        </div>
                    )}
                     
            </div>

            {/*Quick Action card- find recipes */}
            {items.length > 0 && (
            <Link href="/pantry/recipes" className="block mb-8">
            <div className="
              bg-gradient-to-r from-[#6e5106] via-[#a97a05] to-[#c1920a]
              border-2 border-[#a77a0a]
              p-6
              text-white
              hover:shadow-xl
              hover:-translate-y-1
              transition-all
              cursor-pointer
              rounded-xl
              ">
            <div className="flex items-center gap-4">

            <div className="bg-white/20 p-3 border-2 border-white/30 group-hover:bg-white/30 transition-colors ">
            <ChefHat className="w-6 h-6 " />
            </div>

            <div className='flex-1'>
                <h3 className='font-bold text-xl mb-1'>
                    What Meals Await in Your Pantry?
                </h3>

                <p className='text-[#f3fa8c] text-sm font-light'>
                    Get AI-Powered Recipe Suggestions from Your {items.length} {" "}
                    Ingredients
                </p>
            </div>

            <div className='hidden sm:block'>
                <Badge className='bg-white/20 text-white border-2 border-white/30
                 font-bold uppercase tracking-wide'>
                    {items.length} {items.length ===1 ? "item" : "items"}
                 </Badge>
            </div>
         </div>
        </div>                    
    </Link>)}


            {/* Loading state */}
            {loadingItems && (
                <div className='flex flex-col items-center justify-center py-20'>
                    <Loader2 className='w-12 h-12 text-[#2f8143] animate-spin mb-4'/>
                    <p className='text-stone-500'>
                        Loading the Ingredients...
                    </p>
                </div>
            )}

            {/* Pantry items Grid */}
            {!loadingItems && items.length >0 && (
                <div>
                    <div className='flex items-center justify-between mb-6'>
                        <h2 className='text-2xl font-bold text-stone-900'>
                            Your Ingredients List
                        </h2>
                        <Badge variant='outline' 
                          className='text-stone-600 border-2 border-stone-900 font-bold uppercase tracking-wide'
                        >
                            {items.length} {items.length ===1 ? "item" : "items"}
                        </Badge>
                    </div>

                    <div className='grid md:grid-cols-2 lg:grid-cols-3 gap-4'>
                        {items.map((item)=>(
                            <div 
                              key={item.documentId}
                              className='bg-white p-5 border-2 border-stone-200 hover:border-[#2f8143]
                              hover:shadow-lg transition-all'
                            >
                                {edittingId === item.documentId? (
                                    <div className='space-y-3'>
                                        <input type="text"
                                        value={editValues.name}
                                        onChange={(e) => 
                                            setEditValues({ ...editValues, name: e.target.value})
                                        }
                                        className='w-full px-3 py-2 border-2 border-stone-200 focus:outline-none
                                        focus:border-[#2f8143] text-sm' 
                                        placeholder='Ingredient Name'/>

                                        <input type="text"
                                        value={editValues.quantity}
                                         onChange={(e) => 
                                            setEditValues({ ...editValues, quantity: e.target.value})
                                        }
                                        className='w-full px-3 py-2 border-2 border-stone-200 focus:outline-none
                                        focus:border-[#2f8143] text-sm'
                                        placeholder='Quantity' />

                                         <div className="flex gap-2">
                        <Button
                          size="sm"
                          onClick={saveEdit}
                          disabled={updating}
                          className="flex-1 bg-[#3fad5b] hover:bg-yellow-700 border-2 border-[#3fad5b]"
                        >
                          {updating ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <Check className="w-4 h-4" />
                          )}
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={cancelEdit}
                          disabled={updating}
                          className="flex-1 border-2 border-stone-900 hover:bg-stone-900 hover:text-white"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>


                                    </div>
                                    ):( 
                                        <div>
                                            <div className='flex items-start justify-between mb-3'>
                                            <div className='flex-1'>
                                                <h3 className='font-bold text-lg text-stone-900 mb-1'>
                                                    {item.name}
                                                </h3>
                                                <p className='text-stone-500 text-sm font-light'>
                                                    {item.quantity}
                                                </p>
                                            </div>

                                            <div className='flex gap-1'>
                                                <Button
                                                    onClick={() => startEdit(item)}
                                                    variant="ghost"
                                                >
                                                    <SquarePen className='w-4 h-4'/>
                                                </Button>
                                                <Button
                                                    onClick={()=> handleDelete(item.documentId)}
                                                    disabled={deleting}
                                                    variant="ghost"
                                                >
                                                    <Trash2 className='w-4 h-4'/>
                                                </Button>
                                            </div>
                                            </div>

                                            <div className='text-xs text-stone-400'> 
                                                Added {new Date(item.createdAt).toLocaleDateString()}
                                            </div>
                                        </div>
                                    )}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Empty state */}
            {!loadingItems && items.length===0 && (
                <div className='bg-white p-12 text-center border-2 border-dashed border-stone-200'>
                    <div className='bg-green-50 w-20 h-20 border-2 border-green-200 flex items-center justify-center mx-auto mb-6'>
                        <ShoppingCart className='w-10 h-10 text-[#2f8143]'/>
                    </div>
                    <h3 className='text-2xl font-bold text-stone-900 mb-2'>
                        Looks like your Pantry is Empty
                    </h3>
                </div>
            )}
        </div>
        {/* Add to pantry modal*/}
        <AddToPantryModal
            isOpen={isModalOpen}
            onClose={()=> setIsModalOpen(false)}
            onSuccess={handleModalSuccess}
        />
      
    </div>
  )
}

export default PantryPage
