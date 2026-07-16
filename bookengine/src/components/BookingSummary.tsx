  import type { PriceDetail, RatePlan } from "./RoomList";
  import { useEffect, useState } from "react";
  import { getOtherCharges, getTaxAmount } from "../api/hotel.service";

  export interface SelectedRoom {
    RoomId: string;

    RoomTypeId: string;
    RoomTypeName: string;
    RoomTypeDescription: string;
    RoomImages: string[];
    Amenities: string[];

    Quantity: number;

    AdultCount: number;
    ChildCount: number;

    RatePlan: RatePlan;
    Price: PriceDetail;
  }

  interface Props {
    rooms: SelectedRoom[];
  onFinalAmountChange?: (amount: number) => void;
    onRemoveRoom?: (
      roomTypeId: string,
      ratePlanId: string,
      adults: number,
      children: number,
      removeAll: boolean,
    ) => void;

    readOnly?: boolean;

    onContinue?: () => void;
  }

  const BookingSummary = ({
    rooms,
    readOnly = false,
    onContinue,
    onFinalAmountChange
  }: Props) => {
    console.log("rooms",rooms);
    const propertyid = localStorage.getItem("propertyid") || "";
const HotelID = localStorage.getItem("HotelID") || "";
const Branchcode = localStorage.getItem("Branchcode") || "";
    
    const [roomTaxes, setRoomTaxes] = useState<
      Record<
        string,
        {
          taxDetails: any[];
          taxAmount: number;
        }
      >
    >({});
const [otherCharges, setOtherCharges] = useState<any[]>([]);
useEffect(() => {
  const fetchOtherCharges = async () => {
    try {
const response = await getOtherCharges({
  propertyid,
  HotelID,
  Branchcode,
});
     const charges = response ?? [];

setOtherCharges(charges);

localStorage.setItem(
  "otherCharges",
  JSON.stringify(charges)
);
    } catch (err) {
      console.error(err);
    }
  };

  fetchOtherCharges();
}, []);
    const getRoomTotal = (room: SelectedRoom) => {
      let total = 0;

      room.RatePlan.PriceDetails.forEach((day) => {
        const prices = day.Prices?.[0];
        if (!prices) return;

        const adultPax = prices[room.AdultCount.toString()];
        const childPax =
          room.ChildCount > 0 ? prices[room.ChildCount.toString()] : null;

        if (!adultPax) return;

        total +=
          adultPax.AdultPrice + (childPax?.ChildPrice ?? 0) * room.ChildCount;
      });

      return total * room.Quantity;
    };
    const totalRooms = rooms.reduce((sum, room) => sum + room.Quantity, 0);

    const totalAmount = rooms.reduce((sum, room) => sum + getRoomTotal(room), 0);
    useEffect(() => {
      if (rooms.length === 0) {
        setRoomTaxes({});
        return;
      }

      const fetchTaxes = async () => {
        const taxes: Record<
          string,
          {
            taxDetails: any[];
            taxAmount: number;
          }
        > = {};

        for (const room of rooms) {
          const roomTotal = getRoomTotal(room);

          try {
       const response = await getTaxAmount({
  propertyid,
  HotelID,
  Branchcode,
  amount: roomTotal,
});

            const totalTax = response.reduce(
              (sum: number, item: any) => sum + Number(item.TaxVaue),
              0,
            );

            const key = `${room.RoomTypeId}-${room.RatePlan.RatePlanId}-${room.AdultCount}-${room.ChildCount}`;

            taxes[key] = {
              taxDetails: response,
              taxAmount: totalTax,
            };
          } catch (err) {
            console.error(err);
          }
        }

        setRoomTaxes(taxes);
        localStorage.setItem(
  "roomTaxes",
  JSON.stringify(taxes)
);
      };

      fetchTaxes();
    }, [rooms]);
    const taxAmount = Object.values(roomTaxes).reduce(
      (sum, room) => sum + room.taxAmount,
      0,
    );
const otherChargesAmount = otherCharges.reduce((sum, charge) => {
  const amount = (totalAmount * Number(charge.Percentage || 0)) / 100;
  return sum + amount;
}, 0);
  const finalAmount = totalAmount + taxAmount + otherChargesAmount;
  useEffect(() => {
  localStorage.setItem(
    "finalAmount",
    JSON.stringify(finalAmount)
  );
}, [finalAmount]);
  useEffect(() => {
  onFinalAmountChange?.(finalAmount);
}, [finalAmount, onFinalAmountChange]);
 return (
  <div className="sticky top-4 rounded-xl border bg-white shadow-sm">
    <div className="border-b p-4">
      <h2 className="text-lg font-bold">Booking Summary</h2>

      <p className="mt-1 text-xs text-gray-500">
        {totalRooms} Room{totalRooms !== 1 ? "s" : ""} Selected
      </p>
    </div>

    {rooms.length === 0 ? (
      <div className="p-8 text-center">
        <p className="text-sm text-gray-500">
          No rooms selected
        </p>
      </div>
    ) : (
      <>
        <div className="max-h-[520px] overflow-y-auto">
          {rooms.map((room) => (
            <div
              key={`${room.RoomTypeId}-${room.RatePlan.RatePlanId}-${room.AdultCount}-${room.ChildCount}`}
              className="border-b p-3"
            >
              <img
                src={room.RoomImages[0]}
                className="h-28 w-full rounded-lg object-cover"
                alt={room.RoomTypeName}
              />

              <h3 className="mt-2 text-base font-semibold">
                {room.RoomTypeName}
              </h3>

              <p className="text-xs text-gray-500">
                {room.RatePlan.RateShortName}
              </p>

              <div className="mt-2 flex flex-wrap gap-2">
                {room.Amenities.slice(0, 3).map((item) => (
                  <span
                    key={item}
                    className="rounded-full bg-gray-100 px-2 py-0.5 text-[10px]"
                  >
                    {item}
                  </span>
                ))}
              </div>

              <div className="mt-3 flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs text-gray-600">
                    Adults :
                    <span className="font-medium">
                      {" "}
                      {room.AdultCount}
                    </span>
                  </p>

                  <p className="text-xs text-gray-600">
                    Children :
                    <span className="font-medium">
                      {" "}
                      {room.ChildCount}
                    </span>
                  </p>

                  <p className="text-xs text-gray-600">
                    Quantity :
                    <span className="font-medium">
                      {" "}
                      {room.Quantity}
                    </span>
                  </p>

                  <p className="text-[10px] text-gray-400">
                    Adults : ₹
                    {room.Price.OfferPricePerNight.toLocaleString()}
                  </p>

                  {room.ChildCount > 0 && (
                    <p className="text-[10px] text-gray-400">
                      Children : ₹
                      {(
                        room.Price.ChildRatePerNight *
                        room.ChildCount
                      ).toLocaleString()}
                    </p>
                  )}

                  <p className="text-[10px] text-gray-400">
                    {room.RatePlan.PriceDetails.length} Night
                    {room.RatePlan.PriceDetails.length > 1
                      ? "s"
                      : ""}
                  </p>

                  <p className="text-[10px] text-gray-400">
                    Qty : {room.Quantity}
                  </p>
                </div>

                <div className="text-right">
                  {(() => {
                    const key = `${room.RoomTypeId}-${room.RatePlan.RatePlanId}-${room.AdultCount}-${room.ChildCount}`;
                    const roomTax = roomTaxes[key];

                    return (
                      <>
                        <p className="text-lg font-bold text-[#173f8a]">
                          ₹{getRoomTotal(room).toLocaleString()}
                        </p>

                        {roomTax?.taxDetails.map((tax) => (
                          <p
                            key={tax.TaxName}
                            className="text-[10px] text-gray-500"
                          >
                            {tax.TaxName} ({tax.TaxPer}%): ₹
                            {tax.TaxVaue}
                          </p>
                        ))}

                        <p className="text-xs font-semibold text-green-700">
                          Total: ₹
                          {(
                            getRoomTotal(room) +
                            (roomTax?.taxAmount ?? 0)
                          ).toLocaleString()}
                        </p>
                      </>
                    );
                  })()}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="space-y-2 border-t p-4">
          <div className="flex justify-between">
            <span className="text-sm">Total Rooms</span>
            <span className="text-sm font-semibold">
              {totalRooms}
            </span>
          </div>

          
       <div className="border-t pt-2">
  <div className="flex items-center justify-between">
    <span className="text-base font-bold">
      Final Amount
    </span>

    <span className="text-xl font-bold text-[#173f8a]">
      ₹{finalAmount.toLocaleString()}
    </span>
  </div>

{otherCharges.length > 0 && (
  <p className="mt-1 text-[10px] text-gray-500">
    Includes{" "}
    <span className="font-medium">
      {otherCharges
        .map(
          (c) => `${c.ChargesParticular} (${c.Percentage}%)`
        )
        .join(", ")}
    </span>
  </p>
)}
</div>

          {!readOnly && (
            <button
              onClick={() => onContinue?.()}
              className="w-full rounded-md bg-[#173f8a] py-2.5 text-sm font-semibold text-white hover:bg-[#102f6c]"
            >
              Continue Booking
            </button>
          )}
        </div>
      </>
    )}
  </div>
);
  };

  export default BookingSummary;
