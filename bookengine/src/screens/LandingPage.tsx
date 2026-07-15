import { useEffect, useState } from "react";
import { getHotelData } from "../api/hotel.service";

import Header from "../components/Header";
import HotelInfo from "../components/HotelInfo";
import ImageGallery from "../components/ImageGallery";
import HotelDescription from "../components/HotelDescription";
import AvailabilityFilter from "../components/AvailabilityFilter";
import type { PriceDetail, RatePlan, RoomType } from "../components/RoomList";
import RoomList from "../components/RoomList";
import BookingSummary, { type SelectedRoom } from "../components/BookingSummary";
import Footer from "../components/Footer";
import { useLocation, useNavigate } from "react-router-dom";

interface HotelResponse {
  Hotel: {
    Name: string;
    HotelAddress: string;
    HotelDetail: string;
    Amenities: string[];
    Images: string[];

    HotelContact: {
      MobileNo: string;
      EmailId: string;
    };

    Policies: {
      Cancellation: string;
      CheckinTime: string;
      CheckoutTime: string;
    };
  };

  RoomTypes: RoomType[];

  BookingPolicy: {
    PolicyPoints: string[];
  };
}

const LandingPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

const [hotelConfig, setHotelConfig] = useState({
  propertyid: "",
  HotelID: "",
  Branchcode: "",
});
  const [hotelData, setHotelData] = useState<HotelResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
const [selectedRooms, setSelectedRooms] = useState<SelectedRoom[]>([]);
const getToday = () => {
  return new Date().toISOString().split("T")[0]; // yyyy-MM-dd
};


useEffect(() => {
  localStorage.setItem("selectedRooms", JSON.stringify(selectedRooms));
}, [selectedRooms]);
useEffect(() => {
  const hash = window.location.hash;

  let propertyid = "";
  let HotelID = "";
  let Branchcode = "";

  if (hash.includes("?")) {
    const query = hash.substring(hash.indexOf("?"));
    const params = new URLSearchParams(query);

    propertyid = params.get("propertyid") || "";
    HotelID = params.get("HotelID") || "";
    Branchcode = params.get("Branchcode") || "";

    if (propertyid) localStorage.setItem("propertyid", propertyid);
    if (HotelID) localStorage.setItem("HotelID", HotelID);
    if (Branchcode) localStorage.setItem("Branchcode", Branchcode);
  }

  setHotelConfig({
    propertyid: propertyid || localStorage.getItem("propertyid") || "",
    HotelID: HotelID || localStorage.getItem("HotelID") || "",
    Branchcode: Branchcode || localStorage.getItem("Branchcode") || "",
  });
}, [location]);
const getTomorrow = () => {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  return tomorrow.toISOString().split("T")[0];
};

const [checkInDate, setCheckInDate] = useState(getToday);
const [checkOutDate, setCheckOutDate] = useState(getTomorrow);
  const [numNights, setNumNights] = useState(1);
useEffect(() => {
  localStorage.setItem("checkInDate", checkInDate);
  localStorage.setItem("checkOutDate", checkOutDate);
}, [checkInDate, checkOutDate]);
  const formatDate = (date: string) => {
    const [year, month, day] = date.split("-");
    return `${month}/${day}/${year}`;
  };

const fetchHotelData = async (
  checkIn: string = checkInDate,
  checkOut: string = checkOutDate
) => {
  try {
    setLoading(true);
    setError("");

    const response = await getHotelData({
      propertyid: hotelConfig.propertyid,
      HotelID: hotelConfig.HotelID,
      Branchcode: hotelConfig.Branchcode,
      checkindate: formatDate(checkIn),
      checkoutdate: formatDate(checkOut),
    });

    console.log("response", response);

    setHotelData(response);
  } catch (err) {
    console.error(err);
    setError("Unable to load hotel information.");
  } finally {
    setLoading(false);
  }
};
useEffect(() => {
  if (
    !hotelConfig.propertyid ||
    !hotelConfig.HotelID ||
    !hotelConfig.Branchcode
  ) {
    return;
  }

  const checkIn = new Date(checkInDate);
  const checkOut = new Date(checkOutDate);

  const diff =
    (checkOut.getTime() - checkIn.getTime()) /
    (1000 * 60 * 60 * 24);

  setNumNights(diff > 0 ? diff : 0);

  fetchHotelData(checkInDate, checkOutDate);
}, [checkInDate, checkOutDate, hotelConfig]);

  const handleSearch = () => {
    fetchHotelData(checkInDate, checkOutDate);
  };
const handleBookRoom = (
  room: RoomType,
  ratePlan: RatePlan,
  price: PriceDetail,
  adults: number,
  children: number,
  roomId?: string
) => {
  setSelectedRooms(prev => {

 const existingIndex = prev.findIndex(
  item => item.RoomId === roomId
);

if (roomId && existingIndex !== -1) {
  return prev.map(item =>
    item.RoomId === roomId
      ? {
          ...item,
          AdultCount: adults,
          ChildCount: children,
          Price: price,
          RatePlan: {
            ...item.RatePlan,
            PricePerNight: price.OfferPricePerNight,
          },
        }
      : item
  );
}
return [
  ...prev,
  {
    RoomId: roomId!, // use the RoomId from RoomCard
    RoomTypeId: room.RoomTypeId,
    RoomTypeName: room.RoomTypeName,
    RoomTypeDescription: room.RoomTypeDescription,
    RoomImages: room.RoomImages,
    Amenities: room.Amenities,

    Quantity: 1,

    AdultCount: adults,
    ChildCount: children,

    RatePlan: ratePlan,
    Price: price,
  },
];
  });
};
const handleRemoveRoom = (roomId: string) => {
  setSelectedRooms((prev) =>
    prev.filter((room) => room.RoomId !== roomId)
  );
};
const handleContinueBooking = () => {
  if (!hotelData) return;

  if (selectedRooms.length === 0) {
    alert("Please select at least one room.");
    return;
  }

  navigate("/payment", {
    state: {
      hotelName: hotelData.Hotel.Name,
      supportNumber: hotelData.Hotel.HotelContact.MobileNo,

      rooms: selectedRooms,

      cancellation: hotelData.Hotel.Policies.Cancellation,
      checkIn: hotelData.Hotel.Policies.CheckinTime,
      checkOut: hotelData.Hotel.Policies.CheckoutTime,

      policyPoints: hotelData.BookingPolicy.PolicyPoints,
    },
  });
};
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-100">
        <div className="text-lg font-medium text-gray-600">
          Loading hotel details...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-100 px-4">
        <div className="rounded-lg border border-red-200 bg-red-50 px-6 py-4 text-center">
          <h2 className="text-lg font-semibold text-red-600">Error</h2>

          <p className="mt-2 text-gray-600">{error}</p>

          <button
            onClick={handleSearch}
            className="mt-4 rounded-md bg-[#163A84] px-5 py-2 text-white hover:bg-[#0f2d68]"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!hotelData) return null;

  const { Hotel } = hotelData;

  return (
    <div className="min-h-screen bg-gray-100">
      <Header
        hotelName={Hotel.Name}
        supportNumber={Hotel.HotelContact.MobileNo}
      />

      <HotelInfo
        name={Hotel.Name}
        address={Hotel.HotelAddress}
        mobile={Hotel.HotelContact.MobileNo}
        email={Hotel.HotelContact.EmailId}
        amenities={Hotel.Amenities}
      />

      <ImageGallery images={Hotel.Images} />

      <HotelDescription description={Hotel.HotelDetail} />

      <AvailabilityFilter
        checkIn={checkInDate}
        checkOut={checkOutDate}
        nights={numNights}
        onCheckInChange={setCheckInDate}
        onCheckOutChange={setCheckOutDate}
        onSearch={handleSearch}
      />

<div className="w-full px-4 py-8 xl:px-8 2xl:px-10">
  <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1fr_420px]">

    {/* Room List */}

    <div className="min-w-0">
<RoomList
  rooms={hotelData.RoomTypes}
  selectedRooms={selectedRooms}
  onBookRoom={handleBookRoom}
  onRemoveRoom={handleRemoveRoom}
/>
    </div>

    {/* Booking Summary */}

    <div className="w-full xl:w-[420px]">
<BookingSummary
  rooms={selectedRooms}
  onRemoveRoom={handleRemoveRoom}
  onContinue={handleContinueBooking}
/>
    </div>

  </div>
</div>
<Footer hotelName={Hotel.Name} />
    </div>
  );
};

export default LandingPage;