import { Trash2 } from "lucide-react";
import type { PriceDetail, RatePlan } from "./RoomList";

export interface SelectedRoom {
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

  onRemoveRoom: (
    roomTypeId: string,
    ratePlanId: string,
    adults: number,
    children: number
  ) => void;
}

const BookingSummary = ({ rooms, onRemoveRoom }: Props) => {
  const totalRooms = rooms.reduce((sum, room) => sum + room.Quantity, 0);

  const totalAmount = rooms.reduce(
    (sum, room) =>
      sum + room.Price.OfferPricePerNight * room.Quantity,
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
                      ₹
                      {room.Price.OfferPricePerNight.toLocaleString()}
                      {" × "}
                      {room.Quantity}
                    </p>

                  </div>

                  <div className="text-right">

                    <p className="text-xl font-bold text-[#173f8a]">
                      ₹
                      {(
                        room.Price.OfferPricePerNight *
                        room.Quantity
                      ).toLocaleString()}
                    </p>

                    <button
                      onClick={() =>
                        onRemoveRoom(
                          room.RoomTypeId,
                          room.RatePlan.RatePlanId,
                          room.AdultCount,
                          room.ChildCount
                        )
                      }
                      className="mt-3 flex items-center gap-1 text-sm text-red-600 hover:text-red-700"
                    >
                      <Trash2 size={16} />
                      Remove
                    </button>

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

            <button className="w-full rounded-lg bg-[#173f8a] py-3 font-semibold text-white hover:bg-[#102f6c]">
              Continue Booking
            </button>

          </div>
        </>
      )}
    </div>
  );
};

export default BookingSummary;