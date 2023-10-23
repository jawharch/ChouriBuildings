
import {BrowserRouter as Router,Routes,Route} from 'react-router-dom'
import Home from './pages/Home'
import Signin from './pages/Signin'
import SignUp from './pages/SignUp'
import About from './pages/About'
import Profile from './pages/Profile'
import Header from './components/Header'
import { ChakraProvider } from "@chakra-ui/react";
import PrivateProfile from './components/PrivateProfile'
import Createlisting from './pages/Createlisting'
import Updatelisting from './pages/Updatelisitng'
import Lisitng from './pages/Lisitng'
import SearchPage from './pages/SearchPage'
function App() {


  return (
   <Router>
    <ChakraProvider/>
    <Routes>
      <Route path='/' element={<Home/>}/>
      <Route path='/sign-in' element={<Signin/>}/>
      <Route path='/sign-up' element={<SignUp/>}/>
      <Route path='/about' element={<About/>}/>
      <Route path='/listing/:listingId' element={<Lisitng/>}/>
      <Route path='/search' element={<SearchPage/>}/>
      <Route element={<PrivateProfile/>}>
      <Route path='/profile' element={<Profile/>}/>
      <Route path='/create-listing' element={<Createlisting/>}/>
      <Route path='/update-listing/:listingId' element={<Updatelisting/>}/>
      </Route>
    </Routes>
   </Router>
  )
}

export default App
