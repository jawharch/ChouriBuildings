import React, { useEffect, useState } from 'react'
import Header from '../components/Header'
import {app} from '../firebase' 
import {getDownloadURL, getStorage, ref, uploadBytesResumable} from 'firebase/storage' 
import axios from 'axios'
import { useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import {  useToast } from '@chakra-ui/react'


const Createlisting = () => {
    const [files,setfiles]=useState([])
    const {currentUser}=useSelector(state=>state.user)
    const [imageUploadError, setImageUploadError] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState(false);
    const [loading, setLoading] = useState(false);
    const navigate=useNavigate()
    const params=useParams()
    const toast = useToast()
 
    const [formdata,setformdata]=useState(
        {
            imageUrls:[],
            name: '',
            description: '',
            address: '',
            type:'rent',
            bedrooms: 1,
            bathrooms: 1,
            regularPrice: 50,
            discountPrice: 0,
            offer: false,
            parking: false,
            furnished: false,
        }
    )
    // console.log(formdata)
    useEffect(() => {
        const fetchListing=async()=>
        {
            const listingId=params.listingId
            const res=await axios.get(`http://localhost:3000/api/listing/get/${listingId}`)
            if (res.data.success === false) {
                console.log(res.data.message);
                return;
              }
              setformdata(res.data)

        }
        fetchListing()
    
    }, [params.listingId])
    

    console.log(files)
    const handleImageSubmit = () => {
        if (files.length > 0 && files.length + formdata.imageUrls.length < 7) {
          setUploading(true);
          setImageUploadError(false);
          const promises = [];
    
          for (let i = 0; i < files.length; i++) {
            promises.push(storeImage(files[i]));
          }
          Promise.all(promises)
            .then((urls) => {
              setformdata({
                ...formdata,
                imageUrls: formdata.imageUrls.concat(urls),
              });
              setImageUploadError(false);
              setUploading(false);
            })
            .catch((err) => {
              setImageUploadError('Image upload failed (2 mb max per image)');
              setUploading(false);
            });
        } else {
          setImageUploadError('You can only upload 6 images per listing');
          setUploading(false);
        }
      };
    
      const storeImage = async (file) => {
        return new Promise((resolve, reject) => {
          const storage = getStorage(app);
          const fileName = new Date().getTime() + file.name;
          const storageRef = ref(storage, fileName);
          const uploadTask = uploadBytesResumable(storageRef, file);
          uploadTask.on(
            'state_changed',
            (snapshot) => {
              const progress =
                (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
              console.log(`Upload is ${progress}% done`);
            },
            (error) => {
              reject(error);
            },
            () => {
              getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                resolve(downloadURL);
              });
            }
          );
        });
      };
      const handleDeleteImg=(index)=>
      {
        setformdata({
            ...formdata,
            imageUrls:formdata.imageUrls.filter((_,i)=>i!==index)
        })
      }
      const handleChange=(e)=>
      {
        if( e.target.id==='rent' || e.target.id==='sale')
        {
            setformdata(
                {
                    ...formdata,
                    type:e.target.id
                }
            )
        }
        if (
            e.target.id === 'parking' ||
            e.target.id === 'furnished' ||
            e.target.id === 'offer'
          ) {
            setformdata({
              ...formdata,
              [e.target.id]: e.target.checked,
            });
          }
          if (
            e.target.type === 'number' ||
            e.target.type === 'text' ||
            e.target.type === 'textarea'
          ) {
            setformdata({
              ...formdata,
              [e.target.id]: e.target.value,
            });
          }

      }
      const handleFormSubmit=async(e)=>
      {
        e.preventDefault()
        try {
            
            if(formdata.imageUrls.length<1)
            {
                return setError('You must upload a t least one image')
            }
            if (formdata.regularPrice< formdata.discountPrice)
            {
                return setError('Discount price must be lower than regular')
            }
            setLoading(true)
            setError(null)
            const res=await axios.post(`http://localhost:3000/api/listing/update/${params.listingId}`,
            {
                ...formdata,
                userRef:currentUser._id
            })
            console.log(res.data)
            setLoading(false)
            if(res.data.success===false)
            {
                setError(res.data.message)
            }
            toast({
                title: `${formdata.name} listing updated! `,
                status: 'success',
                position:'top-left',
                isClosable: true,
              })
              console.log(res.data._id)
              navigate(`/listing/${res.data._id}`);

            
        } catch (error) {
            setError(error.message)
            setLoading(false)
            
        }

      }
            
  return (
    <div className='bg-slate-200 min-h-screen w-full'>
    <Header/>
    <main className=' p-3 max-w-4xl mx-auto'>
      
      <h1 className='text-3xl font-semibold text-center my-7'>Update a Listing</h1>
      <form onSubmit={handleFormSubmit} className='flex flex-col sm:flex-row gap-6'>
        <div className='flex flex-col gap-4 flex-1'>
        <input  onChange={handleChange} value={formdata.name}type='text' placeholder='Name' id='name' maxLength='62' minLength='10' required className='border p-3 rounded-lg'/>
        <textarea onChange={handleChange} value={formdata.description}  type='text' placeholder='Description' id='description'  required className='border p-3 rounded-lg'/>
        <input onChange={handleChange} value={formdata.address} type='text' placeholder='Address' id='address'  required className='border p-3 rounded-lg'/>
        <div className='flex gap-6 flex-wrap'>
            <div className=' flex gap-2 '>
                <input onChange={handleChange} checked={formdata.type==='sale'} type='checkbox' id='sale' className='w-5'/>
                <span> Sale</span> 

            </div>
            <div className=' flex gap-2'>
                <input type='checkbox' id='rent' className='w-5' onChange={handleChange} checked={formdata.type==='rent'}/>
                <span> Rent</span> 

            </div>
            <div className=' flex gap-2'>
                <input type='checkbox' id='parking' className='w-5' onChange={handleChange} checked={formdata.parking}/>
                <span> Parking spot</span> 

            </div>
            <div className=' flex gap-2'>
                <input type='checkbox' id='furnished' className='w-5'  onChange={handleChange} checked={formdata.furnished}/>
                <span> Furnished</span> 

            </div>
            <div className=' flex gap-2'>
                <input type='checkbox' id='offer' className='w-5'  onChange={handleChange} checked={formdata.offer}/>
                <span> Offer</span> 

            </div>
            

        </div>
        <div className='flex flex-wrap gap-6'>
            <div className='flex items-center gap-2'>
                <input onChange={handleChange} value={formdata.bedrooms} type='number' id='bedrooms' min='1' max='10' required className='p-3 border border-gray-300 rounded-xl'/>
                <p>Beds</p>

            </div>
            <div className='flex items-center gap-2'>
                <input onChange={handleChange} value={formdata.bathrooms} type='number' id='bathrooms' min='1' max='10' required className='p-3 border border-gray-300 rounded-xl'/>
                <p>Baths</p>

            </div>
            <div className='flex items-center gap-2'>
                <input onChange={handleChange} value={formdata.regularPrice} type='number' id='regularPrice' min='1' max='10' required className='p-3 border border-gray-300 rounded-xl'/>
                <div className='flex flex-col items'>
                <p>Regular price</p>
                {formdata.type==='rent'&&
                (
                    <span className='text-xs'>($/month)</span>
                    

                )}
               

            </div>
            {
                formdata.offer&&(
                    <div className='flex items-center gap-2'>
                    <input onChange={handleChange} value={formdata.discountPrice} type='number' id='discountPrice' min='1' max='10' required className='p-3 border border-gray-300 rounded-xl'/>
                    <div className='flex flex-col items'>
                    <p>Discounted price</p>

                    {formdata.type==='rent'&&
                (
                    <span className='text-xs'>($/month)</span>
                    

                )}
                    </div>
    
                </div>

                )
            }
           

        </div>
        </div>

        </div>
        <div className='flex flex-col flex-1 gap-4'>
            <p className='font-semibold'>Images:
            <span className='font-normal text-gray-600 ml-2'>The first image will be the cover (max 6)</span>
            
            </p>
            <div className='flex gap-4'>
                <input onChange={(e)=>setfiles(e.target.files)} className='p-3 border border-gray-300 rounded w-full' type='file' id='images' accept='image/*' multiple />
                <button type='button' disabled={uploading} onClick={handleImageSubmit}className='p-3 text-green-700 border border-green-700 rounded-xl uppercase hover:shadow-lg disabled:opacity-90'>{uploading ? 'Uploading...':'Upload'}</button>

            </div>
            <p className='text-red-700 text-sm'>
            {imageUploadError && imageUploadError}
          </p>
          {
            formdata.imageUrls.length>0 &&
            formdata.imageUrls.map((img,index)=>(
                <div  className='flex justify-between items-center p-3 border ' key={index}>
                    <img src={img} alt="property"  className='w-20 h-20 object-contain rounded-lg' />
                    <button onClick={()=>handleDeleteImg(index)} className='p-3 text-red-700 rounded-lg uppercase hover:opacity-75' type='button'>Delete</button>
                </div>
          ))}
            <button disabled={loading} type='submit' className='p-3 mt-2 bg-slate-900 text-white rounded-lg uppercase hover:opacity-95'>{loading ? 'Updating...':'Updating Listing'}</button>
            {
                error&& <p className='text-red-700 text-sm'>{error}</p>
            }

        </div>
        


      </form>
    </main>
    </div>
  )

}
    
export default Createlisting
