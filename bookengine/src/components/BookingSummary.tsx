import { Trash2 } from "lucide-react";
import type { PriceDetail, RatePlan } from "./RoomList";
import { useState } from "react";

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

  onRemoveRoom?: (
    roomTypeId: string,
    ratePlanId: string,
    adults: number,
    children: number,
    removeAll: boolean
  ) => void;

  readOnly?: boolean;

  onContinue?: () => void;
}

const BookingSummary = ({
  rooms,
  onRemoveRoom,
  readOnly = false,
  onContinue
}: Props) => {
  const [removeRoom, setRemoveRoom] = useState<SelectedRoom | null>(null);
  const getRoomTotal = (room: SelectedRoom) => {
  let total = 0;

  room.RatePlan.PriceDetails.forEach((day) => {
    const prices = day.Prices?.[0];
    if (!prices) return;

const adultPax = prices[room.AdultCount.toString()];
const childPax =
  room.ChildCount > 0
    ? prices[room.ChildCount.toString()]
    : null;

if (!adultPax) return;

total +=
  adultPax.AdultPrice +
  (childPax?.ChildPrice ?? 0) * room.ChildCount;
  });

  return total * room.Quantity;
};
  const totalRooms = rooms.reduce((sum, room) => sum + room.Quantity, 0);

const totalAmount = rooms.reduce(
  (sum, room) => sum + getRoomTotal(room),
  0
);

  return (
    <div className="sticky top-5 rounded-xl border bg-white shadow-sm">

      <div className="border-b p-5">
        <h2 className="text-xl font-bold">
          Booking Summary
        </h2>

        <p className="mt-1 text-sm text-gray-500">
          {totalRooms} Room{totalRooms !== 1 ? "s" : ""} Selected
        </p>
      </div>

      {rooms.length === 0 ? (
        <div className="p-10 text-center">
          <p className="text-gray-500">
            No rooms selected
          </p>
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
                      <span className="font-medium">
                        {" "}
                        {room.AdultCount}
                      </span>
                    </p>

                    <p className="text-sm text-gray-600">
                      Children :
                      <span className="font-medium">
                        {" "}
                        {room.ChildCount}
                      </span>
                    </p>

                    <p className="text-sm text-gray-600">
                      Quantity :
                      <span className="font-medium">
                        {" "}
                        {room.Quantity}
                      </span>
                    </p>

               <p className="text-xs text-gray-400">
  Adults :
₹
{room.Price.OfferPricePerNight.toLocaleString()}
</p>

{room.ChildCount > 0 && (
  <p className="text-xs text-gray-400">
    Children :
    ₹
    {(room.Price.ChildRatePerNight * room.ChildCount).toLocaleString()}
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

                 <p className="text-xl font-bold text-[#173f8a]">
 ₹{getRoomTotal(room).toLocaleString()}
</p>

{!readOnly && onRemoveRoom && (
  <button
    onClick={() => {
      if (room.Quantity > 1) {
        setRemoveRoom(room);
      } else {
        onRemoveRoom(
          room.RoomTypeId,
          room.RatePlan.RatePlanId,
          room.AdultCount,
          room.ChildCount,
          true
        );
      }
    }}
    className="mt-3 flex items-center gap-1 text-sm text-red-600 hover:text-red-700"
  >
    <Trash2 size={16} />
    Remove
  </button>
)}

                  </div>

                </div>

              </div>
            ))}

          </div>

          <div className="space-y-3 border-t p-5">

            <div className="flex justify-between">
              <span>Total Rooms</span>

              <span className="font-semibold">
                {totalRooms}
              </span>
            </div>

            <div className="flex justify-between">
              <span>Total Amount</span>

              <span className="text-2xl font-bold text-[#173f8a]">
                ₹{totalAmount.toLocaleString()}
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
  {!readOnly && removeRoom && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
    <div className="w-full max-w-sm rounded-xl bg-white p-6 shadow-xl">

      <h3 className="text-lg font-bold">
        Remove Room
      </h3>

      <p className="mt-2 text-sm text-gray-600">
        You have selected{" "}
        <span className="font-semibold">
          {removeRoom.Quantity}
        </span>{" "}
        rooms.
      </p>

      <p className="mb-6 text-sm text-gray-600">
        What would you like to remove?
      </p>

      <div className="space-y-3">

        <button
         onClick={() => {
  onRemoveRoom?.(
    removeRoom.RoomTypeId,
    removeRoom.RatePlan.RatePlanId,
    removeRoom.AdultCount,
    removeRoom.ChildCount,
    false
  );

  setRemoveRoom(null);
}}
          className="w-full rounded-lg border border-[#173f8a] py-2 font-medium text-[#173f8a] hover:bg-[#173f8a] hover:text-white"
        >
          Remove 1 Room
        </button>

        <button
       onClick={() => {
  onRemoveRoom?.(
    removeRoom.RoomTypeId,
    removeRoom.RatePlan.RatePlanId,
    removeRoom.AdultCount,
    removeRoom.ChildCount,
    true
  );

  setRemoveRoom(null);
}}
          className="w-full rounded-lg bg-red-600 py-2 font-medium text-white hover:bg-red-700"
        >
          Remove All Rooms
        </button>

        <button
          onClick={() => setRemoveRoom(null)}
          className="w-full rounded-lg border py-2 hover:bg-gray-100"
        >
          Cancel
        </button>

      </div>
    </div>
  </div>
)}
    </div>
  );
};

export default BookingSummary;