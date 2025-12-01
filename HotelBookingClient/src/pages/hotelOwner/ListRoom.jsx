import React, { useState, useEffect } from "react";
import Title from "../../components/Title";
import { useAppContext } from "../../context/AppContext";
import toast from "react-hot-toast";

const ListRoom = () => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const { axios, getToken, user } = useAppContext();

  // Fetch Rooms
  const fetchRooms = async () => {
    try {
      const { data } = await axios.get("/api/rooms/owner", {
        headers: { Authorization: `Bearer ${await getToken()}` },
      });

      if (data.success) {
        setRooms(Array.isArray(data.rooms) ? data.rooms : []);
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) fetchRooms();
  }, [user]);

  // Toggle Room Availability
  const handleToggle = async (index, item) => {
    try {
      const updatedValue = !item.isAvailable;

      const { data } = await axios.put(
        `/api/rooms/${item._id}/availability`,
        { isAvailable: updatedValue },
        { headers: { Authorization: `Bearer ${await getToken()}` } }
      );

      if (data.success) {
        const updatedRooms = [...rooms];
        updatedRooms[index].isAvailable = updatedValue;
        setRooms(updatedRooms);
        toast.success("Availability updated");
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <div>
      <Title
        align="left"
        font="outfit"
        title="Room Listing"
        subTitle="View, edit, or manage all listed rooms. Keep the information up-to-date to provide the best experience for users."
      />

      <p className="text-gray-500 mt-8">All Rooms</p>

      {loading ? (
        <p className="mt-4 text-gray-400">Loading rooms...</p>
      ) : rooms.length === 0 ? (
        <p className="mt-4 text-gray-500">No rooms found.</p>
      ) : (
        <div className="w-full max-w-3xl text-left border border-gray-300 rounded-lg max-h-80 overflow-y-scroll mt-3">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="py-3 px-4 text-gray-800 font-medium">Name</th>
                <th className="py-3 px-4 text-gray-800 font-medium max-sm:hidden">Facility</th>
                <th className="py-3 px-4 text-gray-800 font-medium">Price/Night</th>
                <th className="py-3 px-4 text-gray-800 font-medium text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {rooms.map((item, index) => (
                <tr key={item._id}>
                  <td className="py-3 px-4 text-gray-700 border-t border-gray-300">
                    {item.roomType}
                  </td>
                  <td className="py-3 px-4 text-gray-700 border-t border-gray-300 max-sm:hidden">
                    {item.amenities.join(", ")}
                  </td>
                  <td className="py-3 px-4 text-gray-700 border-t border-gray-300">
                    ₹{item.pricePerNight}
                  </td>
                  <td className="py-3 px-4 border-t border-gray-300 text-center">
                    <label className="relative inline-flex items-center cursor-pointer gap-3">
                      <input
                        type="checkbox"
                        className="sr-only peer"
                        checked={item.isAvailable}
                        onChange={() => handleToggle(index, item)}
                      />
                      <div className="w-12 h-7 bg-slate-300 rounded-full peer-checked:bg-blue-600 transition-colors duration-200">
                        <span className="absolute left-1 top-1 w-5 h-5 bg-white rounded-full transition-transform duration-200 peer-checked:translate-x-5"></span>
                      </div>
                    </label>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ListRoom;
