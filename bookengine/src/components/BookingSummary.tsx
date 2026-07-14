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
        propertyid: "10001",
        HotelID: "FALC_1001",
        Branchcode: "HMS_1001",
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
              propertyid: "10001",
              HotelID: "FALC_1001",
              Branchcode: "HMS_1001",
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
      <div className="sticky top-5 rounded-xl border bg-white shadow-sm">
        <div className="border-b p-5">
          <h2 className="text-xl font-bold">Booking Summary</h2>

          <p className="mt-1 text-sm text-gray-500">
            {totalRooms} Room{totalRooms !== 1 ? "s" : ""} Selected
          </p>
        </div>

        {rooms.length === 0 ? (
          <div className="p-10 text-center">
            <p className="text-gray-500">No rooms selected</p>
          </div>
        ) : (
          <>
            <div className="max-h-[520px] overflow-y-auto">
              {rooms.map((room) => (
                <div
                  key={`${room.RoomTypeId}-${room.RatePlan.RatePlanId}-${room.AdultCount}-${room.ChildCount}`}
                  className="border-b p-4"
                >
                  <img
                    src={room.RoomImages[0]}
                    className="h-32 w-full rounded-lg object-cover"
                    alt={room.RoomTypeName}
                  />

                  <h3 className="mt-3 text-lg font-semibold">
                    {room.RoomTypeName}
                  </h3>

                  <p className="text-sm text-gray-500">
                    {room.RatePlan.RateShortName}
                  </p>

                  <div className="mt-2 flex flex-wrap gap-2">
                    {room.Amenities.slice(0, 3).map((item) => (
                      <span
                        key={item}
                        className="rounded-full bg-gray-100 px-2 py-1 text-xs"
                      >
                        {item}
                      </span>
                    ))}
                  </div>

                  <div className="mt-3 flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">
                        Adults :
                        <span className="font-medium"> {room.AdultCount}</span>
                      </p>

                      <p className="text-sm text-gray-600">
                        Children :
                        <span className="font-medium"> {room.ChildCount}</span>
                      </p>

                      <p className="text-sm text-gray-600">
                        Quantity :
                        <span className="font-medium"> {room.Quantity}</span>
                      </p>

                      <p className="text-xs text-gray-400">
                        Adults : ₹{room.Price.OfferPricePerNight.toLocaleString()}
                      </p>

                      {room.ChildCount > 0 && (
                        <p className="text-xs text-gray-400">
                          Children : ₹
                          {(
                            room.Price.ChildRatePerNight * room.ChildCount
                          ).toLocaleString()}
                        </p>
                      )}

                      <p className="text-xs text-gray-400">
                        {room.RatePlan.PriceDetails.length} Night
                        {room.RatePlan.PriceDetails.length > 1 ? "s" : ""}
                      </p>

                      <p className="text-xs text-gray-400">
                        Qty : {room.Quantity}
                      </p>
                    </div>

                    <div className="text-right">
                      {(() => {
                        const key = `${room.RoomTypeId}-${room.RatePlan.RatePlanId}-${room.AdultCount}-${room.ChildCount}`;
                        const roomTax = roomTaxes[key];

                        return (
                          <>
                            <p className="text-xl font-bold text-[#173f8a]">
                              ₹{getRoomTotal(room).toLocaleString()}
                            </p>

                            {roomTax?.taxDetails.map((tax) => (
                              <p
                                key={tax.TaxName}
                                className="text-xs text-gray-500"
                              >
                                {tax.TaxName} ({tax.TaxPer}%): ₹{tax.TaxVaue}
                              </p>
                            ))}

                            <p className="text-sm font-semibold text-green-700">
                              Total: ₹
                              {(
                                getRoomTotal(room) + (roomTax?.taxAmount ?? 0)
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
            <div className="space-y-3 border-t p-5">
              <div className="flex justify-between">
                <span>Total Rooms</span>
                <span className="font-semibold">{totalRooms}</span>
              </div>

              <div className="flex justify-between">
                <span>Room Amount</span>
                {otherCharges.map((charge) => {
  const amount =
    (totalAmount * Number(charge.Percentage || 0)) / 100;

  return (
    <div
      key={charge.Rno}
      className="flex justify-between"
    >
      <span>
        {charge.ChargesParticular} ({charge.Percentage}%)
      </span>

      <span className="font-semibold">
        ₹{amount.toLocaleString(undefined, {
          maximumFractionDigits: 2,
        })}
      </span>
    </div>
  );
})}
                <span className="font-semibold">
                  ₹{totalAmount.toLocaleString()}
                </span>
              </div>

              <div className="border-t pt-3 flex justify-between">
                <span className="text-lg font-bold">Final Amount</span>
{otherCharges.length > 0 && (
  <div className="rounded-lg bg-blue-50 p-3 text-xs text-blue-800">
    <span className="font-semibold">Note:</span>{" "}
    Final amount includes{" "}
    {otherCharges.map((c) => c.ChargesParticular).join(", ")}.
  </div>
)}
                <span className="text-2xl font-bold text-[#173f8a]">
                  ₹{finalAmount.toLocaleString()}
                </span>
              </div>

              {!readOnly && (
                <button
                  onClick={() => onContinue?.()}
                  className="w-full rounded-lg bg-[#173f8a] py-3 font-semibold text-white hover:bg-[#102f6c]"
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
