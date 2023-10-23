// eslint-disable-next-line no-unused-vars
import {useState,useEffect} from 'react'
import Header from '../components/Header'
import {Link, useNavigate} from 'react-router-dom'
import { FaSearch } from 'react-icons/fa';
import ListingItems from '../components/ListingItems';

const Home = () => {
  const [searchTerm,setsearchTerm]=useState('')
  const navigate=useNavigate()
  const [offerListings, setOfferListings] = useState([]);
  const [saleListings, setSaleListings] = useState([]);
  const [rentListings, setRentListings] = useState([]);
  useEffect(() => {
    const fetchOfferListings = async () => {
      try {
        const res = await fetch('http://localhost:3000/api/listing/get?offer=true&limit=4');
        const data = await res.json();
        setOfferListings(data);
        fetchRentListings();
      } catch (error) {
        console.log(error);
      }
    };
    const fetchRentListings = async () => {
      try {
        const res = await fetch('http://localhost:3000/api/listing/get?type=rent&limit=4');
        const data = await res.json();
        setRentListings(data);
        fetchSaleListings();
      } catch (error) {
        console.log(error);
      }
    };

    const fetchSaleListings = async () => {
      try {
        const res = await fetch('http://localhost:3000/api/listing/get?type=sale&limit=4');
        const data = await res.json();
        setSaleListings(data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchOfferListings();
  }, []);
  const handleSUbmit=()=>
  {
    const urlParams=new URLSearchParams(window.location.search)
    urlParams.set('searchTerm',searchTerm)
    const searchQuery=urlParams.toString()
    navigate(`/search?${searchQuery}`)

  }
  useEffect(()=>
  {
    const urlParams=new URLSearchParams(location.search)
    const searchTermFromUrl=urlParams.get('searchTerm')
    if (searchTermFromUrl)
    {
      setsearchTerm(searchTermFromUrl)
    }

  },[location.search])
  return (
    <>
    <Header/>
    <div>
      <div className='flex flex-col gap-6 p-28 px-3 max-w-6xl mx-auto'>
        <h1 className='text-slate-700 font-bold text-3xl lg:text-6xl'>Find your place <br/>
        here </h1>
        <div className='text-gray-400 text-xs sm:text-sm'>
          best place to find your place to live
        </div>
        <div className='  grid  grid-cols-2  content-center gap-2'>

       
        <Link to={'/search'} className='text-sx sm:text-sm text-blue-800 font-bold hover:underline flex-2'>
          Lets get started ...

        </Link>
        <div className='flex gap-2 items-center justify-center   '>
        <input onChange={(e)=>setsearchTerm(e.target.value)} type='text'  placeholder='Search for a place'className='border border-black rounded-lg p-3 w-[400px] h-25  ' />
          <button onClick={handleSUbmit}>
          <FaSearch/>
          </button>
          </div>
        </div>
      </div>
      <div className='max-w-6xl mx-auto p-3 flex flex-col gap-8 my-10'>
        {offerListings && offerListings.length > 0 && (
          <div className=''>
            <div className='my-3'>
              <h2 className='text-2xl font-semibold text-slate-600'>Recent offers</h2>
              <Link className='text-sm text-blue-800 hover:underline' to={'/search?offer=true'}>Show more offers</Link>
            </div>
            <div className='flex flex-wrap gap-4'>
              {offerListings.map((listing) => (
                <ListingItems listing={listing} key={listing._id} />
              ))}
            </div>
          </div>
        )}
        {rentListings && rentListings.length > 0 && (
          <div className=''>
            <div className='my-3'>
              <h2 className='text-2xl font-semibold text-slate-600'>Recent places for rent</h2>
              <Link className='text-sm text-blue-800 hover:underline' to={'/search?type=rent'}>Show more places for rent</Link>
            </div>
            <div className='flex flex-wrap gap-4'>
              {rentListings.map((listing) => (
                <ListingItems listing={listing} key={listing._id} />
              ))}
            </div>
          </div>
        )}
        {saleListings && saleListings.length > 0 && (
          <div className=''>
            <div className='my-3'>
              <h2 className='text-2xl font-semibold text-slate-600'>Recent places for sale</h2>
              <Link className='text-sm text-blue-800 hover:underline' to={'/search?type=sale'}>Show more places for sale</Link>
            </div>
            <div className='flex flex-wrap gap-4'>
              {saleListings.map((listing) => (
                <ListingItems listing={listing} key={listing._id} />
              ))}
            </div>
          </div>
        )}
      </div>
      

    
    </div>
    </>
  )
}

export default Home
