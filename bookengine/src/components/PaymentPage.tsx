import { useEffect, useState } from "react";
import { useLocation, Navigate } from "react-router-dom";
import Header from "./Header";
import BookingSummary, { type SelectedRoom } from "./BookingSummary";
import GuestDetails from "./GuestDetails";
import HotelPolicies from "./HotelPolicies";
import { createPhonePePayment } from "../api/hotel.service";

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

  useEffect(() => {
  localStorage.setItem("guest", JSON.stringify(guest));
}, [guest]);
  const [errors, setErrors] = useState({
    fullName: "",
    email: "",
    mobile: "",
  });

  // This will be updated by BookingSummary
  const [finalAmount, setFinalAmount] = useState(0);

  const handleChange = (field: string, value: string) => {
    setGuest((prev) => ({
      ...prev,
      [field]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [field]: "",
    }));
  };

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
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(guest.email)) {
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

    try {
      localStorage.removeItem("reservationSubmitted");
sessionStorage.removeItem("merchantOrderId");
      const response = await createPhonePePayment({
        Amount: Math.round(finalAmount * 100),
        RedirectURL: `${window.location.origin}/#/payment-success`,
        branchcode: "HMS_1001",
        Propertycode: "10001",
        HotelId: "FALC_1001",
      });

      sessionStorage.setItem(
        "merchantOrderId",
        response?.merchantOrderId
      );

      if (response?.PaymentURL) {
        window.location.href = response.PaymentURL;
        return;
      }

      if (response?.redirectUrl) {
        window.location.href = response.redirectUrl;
        return;
      }

      if (response?.url) {
        window.location.href = response.url;
        return;
      }

      console.warn(response);
    } catch (error) {
      console.error(error);
      alert("Unable to initiate payment. Please try again.");
    }
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
                Proceed To Payment ₹
                {finalAmount.toLocaleString("en-IN", {
                  maximumFractionDigits: 2,
                })}
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
              onFinalAmountChange={setFinalAmount}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;