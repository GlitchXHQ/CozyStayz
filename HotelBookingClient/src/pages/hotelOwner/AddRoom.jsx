import React, { useState, useEffect } from 'react'
import Title from '../../components/Title'
import { assets } from '../../assets/assets'
import { useAppContext } from '../../context/AppContext'
import { toast } from 'react-hot-toast'

const AddRoom = () => {

  const { axios, getToken } = useAppContext()

  const [images, setImages] = useState({ 1: null, 2: null, 3: null, 4: null })
  const [imagePreview, setImagePreview] = useState({ 1: null, 2: null, 3: null, 4: null })

  const [input, setInput] = useState({
    roomType: '',
    pricePerNight: '',
    amenities: {
      'Free Wifi': false,
      'Free BreakFast': false,
      'Room Service': false,
      'Mountain View': false,
      'Pool Access': false
    }
  })

  const [loading, setLoading] = useState(false)

  // Clean old previews (prevent memory leak)
  useEffect(() => {
    return () => {
      Object.values(imagePreview).forEach(url => url && URL.revokeObjectURL(url))
    }
  }, [imagePreview])

  const handleImageChange = (key, file) => {
    setImages(prev => ({ ...prev, [key]: file }))
    const previewURL = URL.createObjectURL(file)
    setImagePreview(prev => ({ ...prev, [key]: previewURL }))
  }

  const onSubmitHandler = async (e) => {
    e.preventDefault()

    if (!input.roomType || !input.pricePerNight || Number(input.pricePerNight) <= 0) {
      toast.error("Fill all fields properly")
      return
    }

    if (!Object.values(images).some(img => img)) {
      toast.error("Upload at least one image")
      return
    }

    setLoading(true)
    try {
      const formData = new FormData()
      formData.append("roomType", input.roomType)
      formData.append("pricePerNight", input.pricePerNight)

      const selectedAmenities = Object.keys(input.amenities).filter(key => input.amenities[key])
      formData.append("amenities", JSON.stringify(selectedAmenities))

      Object.keys(images).forEach(key => {
        if (images[key]) formData.append("images", images[key])
      })

      const { data } = await axios.post("/api/rooms", formData, {
        headers: { Authorization: `Bearer ${await getToken()}` }
      })

      if (data.success) {
        toast.success(data.message)
        setInput({
          roomType: '',
          pricePerNight: '',
          amenities: {
            'Free Wifi': false,
            'Free BreakFast': false,
            'Room Service': false,
            'Mountain View': false,
            'Pool Access': false
          }
        })
        setImages({ 1: null, 2: null, 3: null, 4: null })
        setImagePreview({ 1: null, 2: null, 3: null, 4: null })
      } else {
        toast.error(data.message)
      }

    } catch (err) {
      toast.error(err?.response?.data?.message || err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={onSubmitHandler}>
      <Title
        align='left'
        font="outfit"
        title="Add Room"
        subTitle="Provide accurate room details, pricing & amenities to improve booking experience"
      />

      <p className='text-gray-800 mt-8 font-medium'>Images</p>

      <div className='grid grid-cols-2 sm:flex sm:gap-4 gap-2 my-2 flex-wrap'>
        {Object.keys(images).map((key) => (
          <label htmlFor={`roomImage${key}`} key={key}>
            <img
              className='h-32 w-32 rounded border cursor-pointer object-cover opacity-90 hover:opacity-100'
              src={imagePreview[key] || assets.uploadArea}
              alt=""
            />
            <input
              type="file"
              accept="image/*"
              id={`roomImage${key}`}
              hidden
              onChange={e => handleImageChange(key, e.target.files[0])}
            />
          </label>
        ))}
      </div>

      <div className='flex flex-row max-sm:flex-col sm:gap-4 mt-4'>
        <div className='flex flex-col '>
          <p className='text-gray-800 font-medium'>Room Type</p>
          <select
            value={input.roomType}
            onChange={e => setInput({ ...input, roomType: e.target.value })}
            className="border border-gray-300 mt-2 rounded p-2 w-48"
          >
            <option value="">Select Room Type</option>
            <option value="Single Bed">Single Bed</option>
            <option value="Double Bed">Double Bed</option>
            <option value="Luxury Room">Luxury Room</option>
            <option value="Family Suite">Family Suite</option>
          </select>
        </div>

        <div>
          <p className='text-gray-800 font-medium'>Price / night</p>
          <input
            type="number"
            placeholder='0'
            className='border border-gray-300 mt-2 rounded p-2 w-32'
            value={input.pricePerNight}
            onChange={e => setInput({ ...input, pricePerNight: e.target.value })}
          />
        </div>
      </div>

      <p className='text-gray-800 mt-6 font-medium'>Amenities</p>
      <div className='grid grid-cols-2 gap-2 mt-2 text-gray-600 max-w-sm'>
        {Object.keys(input.amenities).map((amenity) => (
          <div key={amenity} className='flex items-center gap-2'>
            <input
              type="checkbox"
              id={amenity}
              checked={input.amenities[amenity]}
              onChange={() =>
                setInput(prev => ({
                  ...prev,
                  amenities: {
                    ...prev.amenities,
                    [amenity]: !prev.amenities[amenity]
                  }
                }))
              }
            />
            <label htmlFor={amenity}>{amenity}</label>
          </div>
        ))}
      </div>

      <button
        className='bg-primary text-white px-8 py-2 rounded mt-8 cursor-pointer disabled:opacity-50'
        disabled={loading}
      >
        {loading ? "Adding..." : "Add Room"}
      </button>
    </form>
  )
}

export default AddRoom
