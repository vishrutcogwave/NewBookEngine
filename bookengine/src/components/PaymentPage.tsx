import { useState } from "react";
import { useLocation, Navigate } from "react-router-dom";
import Header from "./Header";
import BookingSummary, {
  type SelectedRoom,
} from "./BookingSummary";
import GuestDetails from "./GuestDetails";
import HotelPolicies from "./HotelPolicies";

const PaymentPage = () => {
  const location = useLocation();

  if (!location.state) {
    return <Navigate to="/" replace />;
  }

  const {
    hotelName,
    supportNumber,
    rooms,
    cancellation,
    checkIn,
    checkOut,
    policyPoints,
  } = location.state as {
    hotelName: string;
    supportNumber: string;
    rooms: SelectedRoom[];
    cancellation: string;
    checkIn: string;
    checkOut: string;
    policyPoints: string[];
  };

  const [guest, setGuest] = useState({
    fullName: "",
    email: "",
    mobile: "",
  });

  const [errors, setErrors] = useState({
    fullName: "",
    email: "",
    mobile: "",
  });

  const handleChange = (field: string, value: string) => {
    setGuest((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Clear error while typing
    setErrors((prev) => ({
      ...prev,
      [field]: "",
    }));
  };

  const getRoomTotal = (room: SelectedRoom) => {
    let total = 0;

    room.RatePlan.PriceDetails.forEach((day) => {
      const prices = day.Prices?.[0];
      if (!prices) return;

      const adult = prices[room.AdultCount.toString()];
      const child =
        room.ChildCount > 0
          ? prices[room.ChildCount.toString()]
          : null;

      if (!adult) return;

      total +=
        adult.AdultPrice +
        (child?.ChildPrice ?? 0) * room.ChildCount;
    });

    return total * room.Quantity;
  };

  const totalAmount = rooms.reduce(
    (sum, room) => sum + getRoomTotal(room),
    0
  );

  const handlePayment = async () => {
    const newErrors = {
      fullName: "",
      email: "",
      mobile: "",
    };

    if (!guest.fullName.trim()) {
      newErrors.fullName = "Full Name is required.";
    }

    if (!guest.email.trim()) {
      newErrors.email = "Email is required.";
    } else if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(guest.email)
    ) {
      newErrors.email = "Please enter a valid email address.";
    }

    if (!guest.mobile.trim()) {
      newErrors.mobile = "Mobile Number is required.";
    } else if (!/^[6-9]\d{9}$/.test(guest.mobile)) {
      newErrors.mobile = "Please enter a valid 10-digit mobile number.";
    }

    setErrors(newErrors);

    if (
      newErrors.fullName ||
      newErrors.email ||
      newErrors.mobile
    ) {
      return;
    }

    console.log("Guest:", guest);
    console.log("Rooms:", rooms);
    console.log("Amount:", totalAmount);

    // Call Payment API here
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Header
        hotelName={hotelName}
        supportNumber={supportNumber}
      />

      <div className="mx-auto max-w-7xl px-4 py-8">
        <div className="grid gap-6 xl:grid-cols-[1fr_420px]">

          <div className="space-y-6">

            <GuestDetails
              fullName={guest.fullName}
              email={guest.email}
              mobile={guest.mobile}
              errors={errors}
              onChange={handleChange}
            />

            <div className="rounded-xl border bg-white p-6 shadow-sm">

              <button
                onClick={handlePayment}
                className="w-full rounded-lg bg-[#173f8a] py-4 text-lg font-semibold text-white transition hover:bg-[#12306b]"
              >
                Proceed To Payment ₹{totalAmount.toLocaleString()}
              </button>

              <p className="mt-3 text-center text-sm text-gray-500">
                🔒 Secure payment powered by our payment gateway.
              </p>

            </div>

            <HotelPolicies
              cancellation={cancellation}
              checkIn={checkIn}
              checkOut={checkOut}
              points={policyPoints}
            />

          </div>
 <div className="w-full xl:w-[420px]">
          <BookingSummary
            rooms={rooms}
            readOnly
          />
          </div>

        </div>
      </div>
    </div>
  );
};

export default PaymentPage;