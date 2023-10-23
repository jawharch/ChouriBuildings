import {useState,useEffect} from 'react'
import { Link } from 'react-router-dom';
import PropTypes from "prop-types";
import axios from 'axios'

  
const Contact = ({listing}) => {
    const [landlord, setLandlord] = useState(null);
    const [message, setMessage] = useState('');
    console.log(listing.userRef)
    const onChange = (e) => {
      setMessage(e.target.value);
    };
  
    useEffect(() => {
      const fetchLandlord = async () => {
        try {
      
          const res = await axios.get(`http://localhost:3000/api/user/${listing.userRef}`);
          
          setLandlord(res.data);
          console.log(res.data)
        } catch (error) {
          console.log(error);
        }
      };
      fetchLandlord();
    }, [listing.userRef]);
    return (
      <>
        {landlord && (
          <div className='flex flex-col gap-2'>
            <p>
              Contact <span className='font-semibold'>{landlord.username}</span>{' '}
              for{' '}
              <span className='font-semibold'>{listing.name.toLowerCase()}</span>
            </p>
            <textarea
              name='message'
              id='message'
              rows='2'
              value={message}
              onChange={onChange}
              placeholder='Enter your message here...'
              className='w-full border p-3 rounded-lg'
            ></textarea>
  
            <Link
            to={`mailto:${landlord.email}?subject=Regarding ${listing.name}&body=${message}`}
            className='bg-slate-700 text-white text-center p-3 uppercase rounded-lg hover:opacity-95'
            >
              Send Message          
            </Link>
          </div>
        )}
      </>
    );
  }
  Contact.propTypes = {
    listing: PropTypes.object, // Specify the expected type
  };
  

export default Contact
