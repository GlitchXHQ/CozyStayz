import axios from 'axios'
import { createContext, useContext, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useUser, useAuth, useClerk } from '@clerk/clerk-react'
import { toast } from 'react-hot-toast'

axios.defaults.baseURL = import.meta.env.VITE_BACKEND_URL

const AppContext = createContext()

export const AppProvider = ({ children }) => {
  const currency = import.meta.env.VITE_CURRENCY || '$'
  const navigate = useNavigate()
  const { user } = useUser()
  const { getToken } = useAuth()
  const { openSignIn } = useClerk()

  const [isOwner, setIsOwner] = useState(false)
  const [showHotelReg, setShowHotelReg] = useState(false)
  const [searchedCities, setSearchCities] = useState([])
  const [ rooms, setRooms] = useState([])  


  const fetchRooms=async()=>{
    try{
      const {data}=await axios.get('/api/rooms')
      if(data.success)
        setRooms(data.rooms)
      else
        toast.error(data.message)
    }catch(err)
    {
      toast.error(err.message)
    }
  }

  const fetchUser = async () => {
    try {
      const token = await getToken()
      const { data } = await axios.get('/api/user', {
        headers: { Authorization: `Bearer ${token}` },
      })

      if (data.success) {
        setIsOwner(data.role === 'hotelOwner')
        setSearchCities(data.recentSearchedCities || [])
      } else {
        setTimeout(fetchUser, 5000)
      }
    } catch (err) {
      toast.error(err?.message || 'Something went wrong')
    }
  }

  useEffect(() => {
    if (user) 
      fetchUser()
  }, [user])

  const value = {
    currency,
    navigate,
    user,
    getToken,
    isOwner,
    setIsOwner,
    axios,
    showHotelReg,
    setShowHotelReg,
    searchedCities,
    setSearchCities,
    fetchUser,
    openSignIn,
    rooms,
    setRooms,
    fetchRooms
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export const useAppContext = () => useContext(AppContext)
