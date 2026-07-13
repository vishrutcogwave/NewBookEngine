import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CheckCircle } from "lucide-react";
import { getPhonePePaymentStatus } from "../api/hotel.service";

const PaymentSuccess = () => {
  const navigate = useNavigate();
const merchantOrderID =
  sessionStorage.getItem("merchantOrderId") || "";

  const [loading, setLoading] = useState(true);
  const [payment, setPayment] = useState<any>(null);

useEffect(() => {
  const fetchStatus = async () => {
    try {
      const response = await getPhonePePaymentStatus({
        MerchantorderID: merchantOrderID,
        branchcode: "HMS_1001",
        Propertycode: "10001",
        HotelId: "FALC_1001",
      });

      console.log("Payment Status:", response);

      setPayment(response);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  if (merchantOrderID) {
    fetchStatus();
  } else {
    setLoading(false);
  }
}, [merchantOrderID]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        Loading payment...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4">

      <div className="mx-auto max-w-2xl rounded-2xl bg-white p-10 shadow">

        <div className="flex justify-center">

          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-green-100">

            <CheckCircle
              size={42}
              className="text-green-600"
            />

          </div>

        </div>

        <h1 className="mt-6 text-center text-4xl font-bold">
          Booking Confirmed! 🎉
        </h1>

        <p className="mt-2 text-center text-gray-500">
          A confirmation has been sent to
          <br />
          {payment?.EmailId}
        </p>

        <div className="mx-auto mt-8 w-72 rounded-xl bg-blue-50 p-6 text-center">

          <p className="text-sm font-semibold tracking-widest text-gray-500">
            BOOKING REFERENCE
          </p>

          <h2 className="mt-3 text-4xl font-bold tracking-widest text-[#173f8a]">
            {payment?.BookingReference}
          </h2>

        </div>

        <div className="mt-10 space-y-5 border-y py-6">

          <div className="flex justify-between">
            <span className="text-gray-500">
              Guest Name
            </span>

            <span className="font-semibold">
              {payment?.GuestName}
            </span>
          </div>

          <div className="flex justify-between">
            <span className="text-gray-500">
              Dates
            </span>

            <span className="font-semibold">
              {payment?.StayDates}
            </span>
          </div>

          <div className="flex justify-between">
            <span className="text-gray-500">
              Total Paid
            </span>

            <span className="font-bold text-[#173f8a]">
              ₹{payment?.Amount}
            </span>
          </div>

        </div>

        <div className="mt-10 flex justify-center">

          <button
            onClick={() => navigate("/")}
            className="rounded-lg border border-[#173f8a] px-8 py-3 font-semibold text-[#173f8a] hover:bg-[#173f8a] hover:text-white"
          >
            Back to Hotel
          </button>

        </div>

      </div>

    </div>
  );
};

export default PaymentSuccess;