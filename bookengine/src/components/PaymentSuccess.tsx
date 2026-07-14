import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CheckCircle } from "lucide-react";
import {
  getPhonePePaymentStatus,
  submitReservationData,
} from "../api/hotel.service";

const PaymentSuccess = () => {
  const navigate = useNavigate();

  const merchantOrderID = sessionStorage.getItem("merchantOrderId") || "";

  const [loading, setLoading] = useState(true);
  const [payment, setPayment] = useState<any>(null);
  const [reservationStatus, setReservationStatus] = useState<
    "loading" | "success" | "pending" | "failed"
  >("loading");

  const [errorMessage, setErrorMessage] = useState("");

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

        // Proceed only if payment is completed
        if (response.state === "PENDING") {
          setReservationStatus("pending");
          return;
        }

        if (response.state !== "COMPLETED") {
          setReservationStatus("failed");
          setErrorMessage("Payment failed.");
          return;
        }

        const alreadySubmitted =
          localStorage.getItem("reservationSubmitted") === "true";

        if (!alreadySubmitted) {
          const guest = JSON.parse(localStorage.getItem("guest") || "{}");

          const selectedRooms = JSON.parse(
            localStorage.getItem("selectedRooms") || "[]",
          );

          const otherCharges = JSON.parse(
            localStorage.getItem("otherCharges") || "[]",
          );

          const checkIn = localStorage.getItem("checkInDate") || "";

          const checkOut = localStorage.getItem("checkOutDate") || "";
          const roomTaxes = JSON.parse(
            localStorage.getItem("roomTaxes") || "{}",
          );

          const finalAmount = Number(localStorage.getItem("finalAmount") || 0);

          const payload = {
            data: [
              {
                UserDetails: {
                  user_name: guest.fullName,
                  mobile: guest.mobile,
                  email: guest.email,
                  idtype: "",
                  idnumber: "",
                },

                BookingsDetails: {
                  ota_unique_id: "",
                  date_of_booking: new Date().toISOString(),
                  hotel_id: 10001,
                  hotel_name: "New Rainbow Business Hotel",
                  check_in: checkIn,
                  check_out: checkOut,
                  booking_id: response.orderId,
                  grand_total: String(finalAmount),
                  paid_amount: String(finalAmount),
                  channel: "PHONEPE",
                  booking_instruction: "",
                  status: "SUCCESS",
                },

                RoomDetails: selectedRooms.map((room: any) => {
                  const key = `${room.RoomTypeId}-${room.RatePlan.RatePlanId}-${room.AdultCount}-${room.ChildCount}`;

                  const taxInfo = roomTaxes[key];

                  const roomTax = taxInfo?.taxAmount ?? 0;

                  const roomRate =
                    room.Quantity *
                    (room.Price?.OfferPricePerNight ??
                      room.Price?.PricePerNight ??
                      0);

                  return {
                    room_type_id: room.RoomTypeId,

                    room_type_name: room.RoomTypeName,

                    no_of_rooms: room.Quantity,

                    totroom_rate: roomRate,

                    totroom_tax: roomTax,

                    totroom_total: roomRate + roomTax,

                    discounted_room_rate_before_tax:
                      room.Price?.OfferPricePerNight,

                    discount:
                      (room.Price?.PricePerNight ?? 0) -
                      (room.Price?.OfferPricePerNight ?? 0),

                    plan: room.RatePlan?.RateShortName,

                    rate_plan_id: room.RatePlan?.RatePlanId,

                    adult: room.AdultCount,

                    child: room.ChildCount,

                    Price:
                      room.RatePlan?.PriceDetails?.map((day: any) => {
                        const perDayTax =
                          roomTax / room.RatePlan.PriceDetails.length;

                        return {
                          staydate: day.ProcessDate,

                          room_rate: room.Price?.OfferPricePerNight,

                          room_tax: Number(perDayTax.toFixed(2)),

                          room_total:
                            room.Price?.OfferPricePerNight + perDayTax,
                        };
                      }) ?? [],
                  };
                }),

                paiddetails: {
                  orderId: response.orderId,
                  state: response.state,
                  amount: response.amount,
                  currency: response.currency,
                  expireAt: response.expireAt,

                  metaInfo: {
                    udf1: response.metaInfo?.udf1 || "",
                    udf2: response.metaInfo?.udf2 || "",
                    udf3: response.metaInfo?.udf3 || "",
                    udf4: response.metaInfo?.udf4 || "",
                    udf5: response.metaInfo?.udf5 || "",
                  },

                  paymentDetails:
                    response.paymentDetails?.map((item: any) => ({
                      paymentMode: item.paymentMode,
                      transactionId: item.transactionId,
                      timestamp: item.timestamp,
                      amount: item.amount,
                      currency: item.currency,
                      feeAmount: item.feeAmount,
                      payableAmount: item.payableAmount,
                      state: item.state,

                      splitInstruments:
                        item.splitInstruments?.map((split: any) => ({
                          amount: split.amount,
                          currency: split.currency,

                          rail: {
                            type: split.rail?.type,
                            authorizationCode: split.rail?.authorizationCode,
                          },

                          instrument: {
                            type: split.instrument?.type,
                            bankId: split.instrument?.bankId,
                            arn: split.instrument?.arn,
                            brn: split.instrument?.brn,
                          },
                        })) || [],
                    })) || [],
                },

                othercharges: otherCharges.map((charge: any) => ({
                  Rno: charge.Rno,
                  ChargesParticular: charge.ChargesParticular,
                  Percentage: charge.Percentage,
                  Amount: (finalAmount * Number(charge.Percentage)) / 100,
                })),
              },
            ],

            b_status: "SUCCESS",
          };

          console.log("Reservation Payload", payload);

          const reservationResponse = await submitReservationData({
            propertyid: "10001",
            HotelID: "FALC_1001",
            Branchcode: "HMS_1001",
            payload,
          });

          console.log("Reservation Response", reservationResponse);

          localStorage.setItem("reservationSubmitted", "true");
sessionStorage.removeItem("merchantOrderId");
          setReservationStatus("success");
        }
      } catch (e) {
        console.error(e);
        setReservationStatus("failed");
        setErrorMessage("Something went wrong while creating the reservation.");
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

  if (loading || reservationStatus === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-100">
        <div className="rounded-xl bg-white p-8 shadow-lg text-center">
          <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-[#173f8a] border-t-transparent" />
          <p className="mt-4 text-lg font-medium text-gray-700">
            Processing your booking...
          </p>
        </div>
      </div>
    );
  }

  if (reservationStatus === "pending") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-yellow-50">
        <div className="max-w-md rounded-2xl bg-white p-10 shadow-lg text-center">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-yellow-100">
            ⏳
          </div>

          <h1 className="mt-6 text-3xl font-bold text-yellow-700">
            Payment Pending
          </h1>

          <p className="mt-4 text-gray-600">
            Your payment is currently being processed. Please wait a few moments
            and refresh the page.
          </p>

          <button
            onClick={() => window.location.reload()}
            className="mt-8 rounded-lg bg-yellow-600 px-6 py-3 font-semibold text-white hover:bg-yellow-700"
          >
            Refresh Status
          </button>
        </div>
      </div>
    );
  }

  if (reservationStatus === "failed") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-red-50">
        <div className="max-w-md rounded-2xl bg-white p-10 shadow-lg text-center">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-red-100">
            ❌
          </div>

          <h1 className="mt-6 text-3xl font-bold text-red-600">
            Booking Failed
          </h1>

          <p className="mt-4 text-gray-600">
            {errorMessage ||
              "Something went wrong while confirming your booking."}
          </p>

          <button
            onClick={() => navigate("/")}
            className="mt-8 rounded-lg bg-red-600 px-6 py-3 font-semibold text-white hover:bg-red-700"
          >
            Back to Hotel
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4">
      <div className="mx-auto max-w-2xl rounded-2xl bg-white p-10 shadow-lg">
        <div className="flex justify-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
            <CheckCircle size={42} className="text-green-600" />
          </div>
        </div>

        <h1 className="mt-6 text-center text-4xl font-bold">
          Booking Confirmed! 🎉
        </h1>

        <p className="mt-2 text-center text-gray-500">
          Your reservation has been confirmed successfully.
        </p>

        <div className="mx-auto mt-8 w-80 rounded-xl bg-blue-50 p-6 text-center">
          <p className="text-sm font-semibold tracking-widest text-gray-500">
            BOOKING REFERENCE
          </p>

          <h2 className="mt-3 break-all text-2xl font-bold text-[#173f8a]">
            {payment?.orderId}
          </h2>
        </div>

        <div className="mt-10 space-y-5 border-y py-6">
          <div className="flex justify-between">
            <span className="text-gray-500">Payment Status</span>
            <span className="font-semibold text-green-600">
              {payment?.state}
            </span>
          </div>

          <div className="flex justify-between">
            <span className="text-gray-500">Payment Mode</span>
            <span className="font-semibold">
              {payment?.paymentDetails?.[0]?.paymentMode}
            </span>
          </div>

          <div className="flex justify-between">
            <span className="text-gray-500">Transaction ID</span>
            <span className="font-semibold break-all">
              {payment?.paymentDetails?.[0]?.transactionId}
            </span>
          </div>

          <div className="flex justify-between">
            <span className="text-gray-500">Total Paid</span>
            <span className="font-bold text-[#173f8a]">
              ₹{(payment?.amount ?? 0) / 100}
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
