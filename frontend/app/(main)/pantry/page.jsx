"use client"

import { deletePantryItem, getPantryItems, updatePantryItem } from '@/actions/pantry.actions'
import AddToPantryModal from '@/components/AddToPantryModal'
import PricingModal from '@/components/PricingModal'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import useFetch from '@/hooks/use-fetch'
import { Check, ChefHat, Gem, Loader2, Plus, ShoppingCart, SquarePen, Trash2, X } from 'lucide-react'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
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

    useEffect(() => {
        if(deleteData?.success && !deleting){
            toast.success("Item Removed form Pantry")
            fetchItems()
        }
    }, [deleteData])

    useEffect(() => {
        if(updateData?.success){
            toast.success("Item Updated SuccessFully")
            setEdittingId(null)
            fetchItems()
        }
    }, [updateData])

    const handleDelete= async (itemId) => {
        const formData= new FormData()
        formData.append("itemId", itemId)
        await deleteItem(formData)
    }

    const startEdit =(item) =>{
        setEdittingId(item.documentId)
        setEditValues({
            name: item.name,
            quantity: item.quantity,
        })
    }

    const saveEdit = async ()=> {
        const formData = new FormData()
        formData.append("itemId", edittingId)
        formData.append("name", editValues.name)
        formData.append("quantity", editValues.quantity)
        await updateItem(formData)
    }

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

            {/* HEADER */}
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

                    {/* Desktop Button */}
                    <Button
                        onClick={() => setIsModalOpen(true)}
                        className='hidden md:flex'
                        size='lg'
                        variant='primary'
                    >
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
                                        {" "}Unlimited AI Scans (Pro Plan)
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

            {/* QUICK ACTION */}
            {items.length > 0 && (
                <Link href="/pantry/recipes" className="block mb-8">
                    <div className="bg-gradient-to-r from-[#6e5106] via-[#a97a05] to-[#c1920a] border-2 border-[#a77a0a] p-6 text-white hover:shadow-xl hover:-translate-y-1 transition-all cursor-pointer rounded-xl">
                        <div className="flex items-center gap-4">
                            <div className="bg-white/20 p-3 border-2 border-white/30">
                                <ChefHat className="w-6 h-6" />
                            </div>

                            <div className='flex-1'>
                                <h3 className='font-bold text-xl mb-1'>
                                    What Meals Await in Your Pantry?
                                </h3>
                                <p className='text-[#f3fa8c] text-sm font-light'>
                                    Get AI-Powered Recipe Suggestions from Your {items.length} Ingredients
                                </p>
                            </div>

                            <div className='hidden sm:block'>
                                <Badge className='bg-white/20 text-white border-2 border-white/30 font-bold uppercase tracking-wide'>
                                    {items.length} {items.length ===1 ? "item" : "items"}
                                </Badge>
                            </div>
                        </div>
                    </div>                    
                </Link>
            )}

            {/* LOADING */}
            {loadingItems && (
                <div className='flex flex-col items-center justify-center py-20'>
                    <Loader2 className='w-12 h-12 text-[#2f8143] animate-spin mb-4'/>
                    <p className='text-stone-500'>Loading the Ingredients...</p>
                </div>
            )}

            {/* ITEMS */}
            {!loadingItems && items.length >0 && (
                <div>
                    <div className='flex items-center justify-between mb-6'>
                        <h2 className='text-2xl font-bold text-stone-900'>
                            Your Ingredients List
                        </h2>
                        <Badge variant='outline' className='text-stone-600 border-2 border-stone-900 font-bold uppercase tracking-wide'>
                            {items.length} {items.length ===1 ? "item" : "items"}
                        </Badge>
                    </div>

                    <div className='grid md:grid-cols-2 lg:grid-cols-3 gap-4'>
                        {items.map((item)=>(
                            <div key={item.documentId} className='bg-white p-5 border-2 border-stone-200 hover:border-[#2f8143] hover:shadow-lg transition-all'>
                                
                                {edittingId === item.documentId? (
                                    <div className='space-y-3'>
                                        <input
                                            value={editValues.name}
                                            onChange={(e)=>setEditValues({...editValues,name:e.target.value})}
                                            className='w-full px-3 py-2 border-2 border-stone-200 focus:border-[#2f8143]'
                                        />
                                        <input
                                            value={editValues.quantity}
                                            onChange={(e)=>setEditValues({...editValues,quantity:e.target.value})}
                                            className='w-full px-3 py-2 border-2 border-stone-200 focus:border-[#2f8143]'
                                        />
                                        <div className="flex gap-2">
                                            <Button onClick={saveEdit}>
                                                <Check className="w-4 h-4"/>
                                            </Button>
                                            <Button onClick={cancelEdit}>
                                                <X className="w-4 h-4"/>
                                            </Button>
                                        </div>
                                    </div>
                                ) : (
                                    <div>
                                        <h3 className='font-bold'>{item.name}</h3>
                                        <p className='text-sm text-gray-500'>{item.quantity}</p>
                                        <div className='flex gap-2 mt-2'>
                                            <Button onClick={()=>startEdit(item)}><SquarePen/></Button>
                                            <Button onClick={()=>handleDelete(item.documentId)}><Trash2/></Button>
                                        </div>
                                    </div>
                                )}

                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* EMPTY */}
            {!loadingItems && items.length===0 && (
                <div className='text-center py-20'>
                    <ShoppingCart className='w-12 h-12 mx-auto text-[#2f8143]'/>
                    <p>No ingredients yet</p>
                </div>
            )}
        </div>

        {/* 🔥 MOBILE FLOATING BUTTON (ADDED FIX) */}
        <Button
            onClick={() => setIsModalOpen(true)}
            className="fixed bottom-6 right-6 md:hidden z-50 rounded-full w-14 h-14 shadow-lg bg-[#2f8143]"
        >
            <Plus className="w-6 h-6 text-white" />
        </Button>

        <AddToPantryModal
            isOpen={isModalOpen}
            onClose={()=> setIsModalOpen(false)}
            onSuccess={handleModalSuccess}
        />
    </div>
  )
}

export default PantryPage