import { useEffect, useState } from "react";
import { getHotelData } from "../api/hotel.service";
import Header from "../components/Header";
import HotelInfo from "../components/HotelInfo";
import ImageGallery from "../components/ImageGallery";
import HotelDescription from "../components/HotelDescription";
import AvailabilityFilter from "../components/AvailabilityFilter";


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
  };

}


const LandingPage = () => {

  const [hotelData, setHotelData] = useState<HotelResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [checkInDate, setCheckInDate] = useState("Sat, 04 Jul 2026");
const [checkOutDate, setCheckOutDate] = useState("Sun, 05 Jul 2026");
const [numNights, setNumNights] = useState(1);
const [adults, setAdults] = useState(2);
const [children, setChildren] = useState(1);

  useEffect(() => {
    fetchHotelData();
  }, []);

  const fetchHotelData = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getHotelData({
        propertyid: "10001",
        HotelID: "FALC_1001",
        Branchcode: "HMS_1001",
        checkindate: "07/04/2026",
        checkoutdate: "07/05/2026",
      });

      setHotelData(response);
    } catch (err) {
      console.error(err);
      setError("Unable to load hotel information.");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
  console.log({
    checkInDate,
    checkOutDate,
    numNights,
    adults,
    children,
  });

  // Later you can call your API here
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
            onClick={fetchHotelData}
            className="mt-4 rounded-md bg-[#163A84] px-5 py-2 text-white transition hover:bg-[#0f2d68]"
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

<HotelDescription
  description={Hotel.HotelDetail}
/>


<AvailabilityFilter
  checkIn={checkInDate}
  checkOut={checkOutDate}
  nights={numNights}
  onSearch={handleSearch}
/>



    {/* Other Sections */}
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Add your next components here */}
    </main>
  </div>
);
};

export default LandingPage;