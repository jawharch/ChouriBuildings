import React, { useEffect, useState } from 'react'
import Header from '../components/Header'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import ListingItems from '../components/ListingItems'
const SearchPage = () => {
    const navigate=useNavigate()
    const [sideBarData,setsideBarData]=useState({
        searchTerm:'',
        type:'all',
        parking:false,
        furnished:false,
        offer:false,
        sort:'created-at',
        order:'desc'


    })
    const [loading,setloading]=useState(false)
    const [listings,setlistings]=useState([])
    const [showMore,setshowMore]=useState(false)
    useEffect(() => {
        const urlParams = new URLSearchParams(location.search);
        const searchTermFromUrl = urlParams.get('searchTerm');
        const typeFromUrl = urlParams.get('type');
        const parkingFromUrl = urlParams.get('parking');
        const furnishedFromUrl = urlParams.get('furnished');
        const offerFromUrl = urlParams.get('offer');
        const sortFromUrl = urlParams.get('sort');
        const orderFromUrl = urlParams.get('order');
    
        if (
          searchTermFromUrl ||
          typeFromUrl ||
          parkingFromUrl ||
          furnishedFromUrl ||
          offerFromUrl ||
          sortFromUrl ||
          orderFromUrl
        ) {
          setsideBarData({
            searchTerm: searchTermFromUrl || '',
            type: typeFromUrl || 'all',
            parking: parkingFromUrl === 'true' ? true : false,
            furnished: furnishedFromUrl === 'true' ? true : false,
            offer: offerFromUrl === 'true' ? true : false,
            sort: sortFromUrl || 'created_at',
            order: orderFromUrl || 'desc',
          });
        }
        const fetchListings=async()=>
        { 
            setloading(true)
            setshowMore(false)
            const searchQuery=urlParams.toString()
           const res=await axios.get(`http://localhost:3000/api/listing/get?${searchQuery}`)
           if(res.data.length>8)
           {
            setshowMore(true)
           }
           else
           {
            setshowMore(false)
           }
           setlistings(res.data)
           setloading(false)
        }
        fetchListings()
        
        }, [location.search]);
        console.log(listings)
   
    const handleChange=(e)=>
    {
        if(e.target.id==='all' || e.target.id==='sale' || e.target.id==='rent')
        {
            setsideBarData({
                ...sideBarData, type:e.target.id
            })
        }
        if(e.target.id==='searchTerm')
        {
            setsideBarData({
                ...sideBarData,searchTerm:e.target.value
            })
        }
        if(e.target.id==='parking' || e.target.id==='furnished' || e.target.id==='offer')
        {
            setsideBarData({
                ...sideBarData,[e.target.id]:e.target.checked || e.target.checked==='true' ? true:false
            })
        }
        if(e.target.id==='sort_order')
        {
            const sort=e.target.value.split('_')[0] || 'created_at'
            const order=e.target.value.split('_')[1] || 'desc'
            setsideBarData({...sideBarData,sort,order})
        }

    }
    const handleSubmit=(e)=>
    {
        e.preventDefault()
        const urlParams=new URLSearchParams()
        urlParams.set('searchTerm',sideBarData.searchTerm)
        urlParams.set('type',sideBarData.type)
        urlParams.set('parking',sideBarData.parking)
        urlParams.set('furnished',sideBarData.furnished)
        urlParams.set('offer',sideBarData.offer)
        urlParams.set('sort',sideBarData.sort)
        urlParams.set('order',sideBarData.order)
        const searchQuery=urlParams.toString()
        navigate(`/search/?${searchQuery}`)


    }
    const showMoreClick=async()=>
    {
        const numberoflistings=listings.length
        const startIndex=numberoflistings
        const urlParams = new URLSearchParams(location.search);
        urlParams.set('startIndex',startIndex)
        const searchQuery=urlParams.toString()
        const res=await axios.get(`http://localhost:3000/api/listing/get?${searchQuery}`)
        
        if (res.data.length<9)
        {
            setshowMore(false)
        }
        setlistings([...listings,...res.data])
        console.log(listings)



    }
  return (
    <>
    <Header/>
    <div className='flex flex-col md:flex-row'>
      <div className='p-7 border-b-2 md:border-r-2 md:min-h-screen'>
        <form onSubmit={handleSubmit} className='flex flex-col gap-8' >
            <div className='flex items-center gap-2'>
                <label className='whitespace-nowrap'>SearchTerm:</label>
                <input type='text' id='searchTerm' value={sideBarData.searchTerm} onChange={handleChange} placeholder='Search...' className='border rounded-lg p-3 w-full'/>
            </div>
            <div className='flex gap-2 flex-wrap items-center'>
                <label className='font-semibold'>Type:</label>
                <div className='flex gap-2'>
                    <input type='checkbox' id="all" className='w-5' checked={sideBarData.type==='all'} onChange={handleChange} />
                    <span>Rent & Sale</span>
                </div>
                <div className='flex gap-2'>
                    <input type='checkbox' id="rent" className='w-5' checked={sideBarData.type==='rent'} onChange={handleChange}/>
                    <span>Rent </span>
                </div>
                <div className='flex gap-2'>
                    <input type='checkbox' id="sale" className='w-5' checked={sideBarData.type==='sale'} onChange={handleChange}/>
                    <span> Sale</span>
                </div>
                <div className='flex gap-2'>
                    <input type='checkbox' id="offer" className='w-5' checked={sideBarData.offer} onChange={handleChange}/>
                    <span> Offer</span>
                </div>
            </div>
            <div className='flex gap-2 flex-wrap items-center'>
                <label className='font-semibold'>Amenities:</label>
                <div className='flex gap-2'>
                    <input type='checkbox' id="parking" className='w-5' checked={sideBarData.parking} onChange={handleChange}/>
                    <span>Parking</span>
                </div>
                <div className='flex gap-2'>
                    <input type='checkbox' id="furnished" className='w-5' checked={sideBarData.furnished} onChange={handleChange}/>
                    <span>Furnished </span>
                </div>
               
            </div>
            <div className='flex items-center gap-2'>
                <label >Sort:</label>
                <select defaultValue={'created_at_desc'} onChange={handleChange} className='border rounded-lg p-3' id="sort_order">
                    <option value='regularPrice_desc'>Price hight to low</option>
                    <option value='regularPrice_asc'>Price low to high</option>
                    <option value='createdAt_desc'>Latest</option>
                    <option value='createdAt_asc'>Oldest</option>
                </select>
            </div>
            <button className='bg-slate-700 text-white p-3 rounded-lg'>Search</button>

        </form>
      </div>
      <div className=' flex-1'>
       <h1 className='text-3xl font-semibold border-b p-3 text-slate-700 mt-4'>Listing results:</h1>
       <div className='p-7 flex flex-wrap gap-4'>
        {!loading && listings.length===0 &&(
            <p className='text-xl text-slate-700'>No listing found !</p>
        )}
        {
            loading &&
            (
                <p className='text-xl text-slate-700 text-center w-full'>Loading...</p>
            )
        }
        {
            !loading && listings && listings.map((listing)=>
            (
                <ListingItems key={listing._id} listing={listing}/>
            ))

        }
        {showMore &&(
            <button className='text-green-700 hover:underline p-7 text-center w-full' onClick={showMoreClick}>
                Show more

            </button>
        )}
       </div>

      </div>
    </div>
    </>
  )
}

export default SearchPage
