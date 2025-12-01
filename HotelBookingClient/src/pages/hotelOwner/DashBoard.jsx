import React, { useEffect, useState } from "react";
import Title from "../../components/Title";
import { assets } from "../../assets/assets";
import { useAppContext } from "../../context/AppContext";

const DashBoard = () => {
  const [dashBoardData, setDashBoardData] = useState({
    bookings:[],
    totalBookings:0,
    totalRevenue:0
  });
  const { currency, user, getToken, toast, axios } = useAppContext();

  const fetchDashboardData = async () => {
    try {
      const token = await getToken();
      const { data } = await axios.get("/api/bookings/hotel", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (data.success) {
        setDashBoardData(data.dashBoardData);
      } else {
        toast.error(data.message || "Failed to fetch dashboard data");
      }
    } catch (err) {
      toast.error(err?.message || "Something went wrong");
    }
  };

  useEffect(() => {
    if (user) {
      fetchDashboardData();
    }
  }, [user]);

  // Optional: simple loading state
  if (!dashBoardData) {
    return (
      <div>
        <Title
          align="left"
          font="outfit"
          title="Dashboard"
          subTitle="Monitor Your Room Listings, track Bookings and analyze revenue-all in one place. Stay updated with real-time insights to ensure smooth operations"
        />
        <p className="mt-6 text-neutral-500 text-sm">Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div>
      <Title
        align="left"
        font="outfit"
        title="Dashboard"
        subTitle="Monitor Your Room Listings, track bookings, and analyze revenue – all in one place. Stay updated with real-time insights to ensure smooth operations."
      />

      {/* Stats cards */}
      <div className="flex flex-wrap gap-4 my-8">
        {/* Total Bookings */}
        <div className="bg-primary/5 border border-primary/10 rounded flex items-center p-4 pr-8">
          <img
            src={assets.totalBookingIcon}
            alt="Booking-Icon"
            className="max-sm:hidden h-10"
          />
          <div className="flex flex-col sm:ml-4 font-medium">
            <p className="text-blue-500 text-lg">Total Bookings</p>
            <p className="text-neutral-700 text-base">
              {dashBoardData.totalBookings ?? 0}
            </p>
          </div>
        </div>

        {/* Total Revenue */}
        <div className="bg-primary/5 border border-primary/10 rounded flex items-center p-4 pr-8">
          <img
            src={assets.totalRevenueIcon}
            alt="Revenue-Icon"
            className="max-sm:hidden h-10"
          />
          <div className="flex flex-col sm:ml-4 font-medium">
            <p className="text-blue-500 text-lg">Total Revenue</p>
            <p className="text-neutral-700 text-base">
              {currency?.symbol || "₹"}
              {dashBoardData.totalRevenue ?? 0}
            </p>
          </div>
        </div>
      </div>

      {/* Recent Bookings */}
      <h2 className="text-xl text-blue-950/70 font-medium mb-5">
        Recent Bookings
      </h2>

      <div className="w-full max-w-3xl text-left border border-gray-300 rounded-lg max-h-80 overflow-y-scroll">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="py-3 px-4 text-gray-800 font-medium">User Name</th>
              <th className="py-3 px-4 text-gray-800 font-medium max-sm:hidden">
                Room Name
              </th>
              <th className="py-3 px-4 text-gray-800 font-medium text-center">
                Total Amount
              </th>
              <th className="py-3 px-4 text-gray-800 font-medium text-center">
                Payment Status
              </th>
            </tr>
          </thead>
          <tbody className="text-sm">
            {(dashBoardData.bookings || []).map((item, index) => (
              <tr key={index}>
                <td className="py-3 px-4 text-gray-700 border-t border-gray-300">
                  {item.user?.username || "N/A"}
                </td>
                <td className="py-3 px-4 text-gray-700 border-t border-gray-300 max-sm:hidden">
                  {item.room?.roomType || "N/A"}
                </td>
                <td className="py-3 px-4 text-gray-700 border-t border-gray-300 text-center">
                  {currency?.symbol || "₹"}
                  {item.totalPrice}
                </td>
                <td className="py-3 px-4 border-t border-gray-300">
                  <button
                    className={`py-1 px-3 text-sm rounded-full mx-auto block ${
                      item.isPaid
                        ? "bg-green-100 text-green-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {item.isPaid ? "Completed" : "Pending"}
                  </button>
                </td>
              </tr>
            ))}

            {dashBoardData.bookings?.length === 0 && (
              <tr>
                <td
                  className="py-4 px-4 text-center text-gray-500 border-t border-gray-300"
                  colSpan={4}
                >
                  No bookings found yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DashBoard;
