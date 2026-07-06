import { useState } from "react";
import {
  BedDouble,
  Users,
  ChevronLeft,
  ChevronRight,
  Wifi,
  Tv,
  ShieldCheck,
} from "lucide-react";
import type {
  PriceDetail,
  RatePlan,
  RoomType,
} from "./RoomList";

interface Props {
  room: RoomType;

  bookedRooms: number;

  onBookRoom: (
    room: RoomType,
    ratePlan: RatePlan,
    price: PriceDetail,
    adults: number,
    children: number
  ) => void;
}

const RoomCard = ({
  room,
  bookedRooms,
  onBookRoom,
}: Props) => {
  const [currentImage, setCurrentImage] = useState(0);

  const [selectedRatePlan, setSelectedRatePlan] = useState(
    room.RatePlans.find((x) => x.IsDefaultSelect) ??
      room.RatePlans[0]
  );

  const [adultCount, setAdultCount] = useState(
    room.MaxOccupancy.DefaultAdult
  );

  const [childCount, setChildCount] = useState(0);

  
  const nextImage = () => {
    setCurrentImage((prev) =>
      prev === room.RoomImages.length - 1 ? 0 : prev + 1
    );
  };

  const previousImage = () => {
    setCurrentImage((prev) =>
      prev === 0
        ? room.RoomImages.length - 1
        : prev - 1
    );
  };

  return (
    <div className="mb-8 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">

      <div className="grid grid-cols-1 lg:grid-cols-[330px_1fr]">

        {/* IMAGE */}

   <div className="relative h-full min-h-[700px] overflow-hidden">

  <img
    src={room.RoomImages[currentImage]}
    alt={room.RoomTypeName}
    className="absolute inset-0 h-full w-full object-cover"
  />

          {room.RoomImages.length > 1 && (
            <>
              <button
                onClick={previousImage}
                className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-white p-2 shadow"
              >
                <ChevronLeft size={18} />
              </button>

              <button
                onClick={nextImage}
                className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-white p-2 shadow"
              >
                <ChevronRight size={18} />
              </button>

              <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2">

                {room.RoomImages.map((_, index) => (
                  <div
                    key={index}
                    className={`h-2 w-2 rounded-full ${
                      currentImage === index
                        ? "bg-white"
                        : "bg-white/50"
                    }`}
                  />
                ))}

              </div>
            </>
          )}

     <div
  className={`absolute left-4 top-4 rounded-md px-3 py-1 text-xs font-semibold text-white ${
    room.Availability.RoomsLeft <= 2
      ? "bg-red-600"
      : room.Availability.RoomsLeft <= 5
      ? "bg-orange-500"
      : "bg-green-600"
  }`}
>
  {room.Availability.RoomsLeft <= 0
    ? "Sold Out"
    : room.Availability.RoomsLeft <= 2
    ? `Only ${room.Availability.RoomsLeft} Left`
    : `${room.Availability.RoomsLeft} Rooms Available`}
</div>

        </div>

        {/* RIGHT SIDE */}

        <div className="p-6">

          <div className="flex items-start justify-between">

            <div>

              <h2 className="text-3xl font-bold text-gray-900">
                {room.RoomTypeName}
              </h2>

              <div className="mt-2 flex items-center gap-2 text-sm text-gray-500">

                <Users size={16} />

                Max {room.MaxOccupancy.Adults} Adults

                {room.MaxOccupancy.Children > 0 &&
                  ` • ${room.MaxOccupancy.Children} Child`}

              </div>

            </div>

          </div>

          {/* Amenities */}

          <div className="mt-6 flex flex-wrap gap-3">

            {room.Amenities.map((item) => (
              <div
                key={item}
                className="flex items-center gap-2 rounded-full bg-gray-100 px-4 py-2 text-sm"
              >
                {item.toLowerCase().includes("king") && (
                  <BedDouble size={16} />
                )}

                {item.toLowerCase().includes("internet") && (
                  <Wifi size={16} />
                )}

                {item.toLowerCase().includes("tv") && (
                  <Tv size={16} />
                )}

                {item}
              </div>
            ))}

          </div>

          {/* Description */}

          <p className="mt-6 leading-7 text-gray-600">
            {room.RoomTypeDescription}
          </p>

          <div className="my-6 border-t" />

          {/* RATE PLANS */}

          <div className="space-y-5">

            {room.RatePlans.map((plan) => {
const remainingRooms =
  Math.max(0, room.Availability.RoomsLeft - bookedRooms);

const prices = plan.PriceDetails.flatMap(
  (x) => x.PriceDetailsDay
);

const price =
  prices.find(
    (x) => x.RatePax === 1
  ) ?? prices[0];

// Base room price only
const totalPerNight =
  price.OfferPricePerNight *
  room.MaxOccupancy.DefaultAdult;
              const selected =
                selectedRatePlan.RatePlanId ===
                plan.RatePlanId;

              return (

                <div
                  key={plan.RatePlanId}
                  onClick={() =>
                    setSelectedRatePlan(plan)
                  }
                  className={`overflow-hidden rounded-xl border transition cursor-pointer ${
                    selected
                      ? "border-[#163A84]"
                      : "border-gray-200"
                  }`}
                >

                  {/* HEADER */}

                  <div className="flex items-start justify-between p-5">

                 <div className="flex w-full items-start justify-between">

  <div>

    <h3 className="text-2xl font-semibold text-gray-900">
      {plan.RateShortName}
    </h3>
{remainingRooms > 0 ? (
  <p className="mt-2 text-base font-semibold text-red-500">
   {remainingRooms} available
  </p>
) : (
  <p className="mt-2 text-base font-semibold uppercase text-gray-500">
    Sold Out
  </p>
)}

    {plan.RateShortName
      .toLowerCase()
      .includes("breakfast") && (
      <div className="mt-2 inline-flex items-center rounded-full border border-yellow-400 bg-yellow-50 px-3 py-1 text-xs font-semibold text-orange-600">
        ☕ Breakfast Included
      </div>
    )}

    <p className="mt-3 flex items-start gap-2 text-sm leading-6 text-green-700">

      <ShieldCheck
        size={16}
        className="mt-1 flex-shrink-0"
      />

      {plan.CancellationPolicy}

    </p>

  </div>

  <div className="text-right">

  <h2 className="text-5xl font-bold text-[#1F2D5A]">
  ₹{totalPerNight.toLocaleString()}
</h2>

    <p className="mt-1 text-xl text-gray-500">
      / Night
    </p>
    <p className="mt-1 text-sm text-gray-500">
  {room.MaxOccupancy.DefaultAdult} Adults Included
</p>

{childCount > 0 && (
  <p className="text-sm text-gray-500">
    + {childCount} Child
  </p>
)}

    <p className="text-sm text-gray-400">
      (Exclusive of Taxes)
    </p>

  </div>

</div>

                

                  </div>

                  {/* PART 2 STARTS HERE */}

                                    <div className="border-t bg-gray-50 p-5">

                    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

                      <div className="flex flex-wrap items-center gap-4">

                        {/* Adults */}

                        <div>

                          <p className="mb-2 text-sm font-medium text-gray-700">
                            Adults
                          </p>

                          <div className="flex items-center overflow-hidden rounded-lg border bg-white">

                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setAdultCount((prev) =>
                                  Math.max(1, prev - 1)
                                );
                              }}
                              disabled={remainingRooms <= 0 || adultCount === 1}
                              className="px-4 py-2 text-lg font-bold hover:bg-gray-100 disabled:opacity-40"
                            >
                              -
                            </button>

                            <span className="min-w-[55px] text-center font-semibold">
                              {adultCount}
                            </span>

                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setAdultCount((prev) =>
                                  Math.min(
                                    room.MaxOccupancy.Adults,
                                    prev + 1
                                  )
                                );
                              }}
                           disabled={
  remainingRooms <= 0 ||
  adultCount === room.MaxOccupancy.Adults
}
                              className="px-4 py-2 text-lg font-bold hover:bg-gray-100 disabled:opacity-40"
                            >
                              +
                            </button>

                          </div>

                        </div>

                        {/* Children */}

                        <div>

                          <p className="mb-2 text-sm font-medium text-gray-700">
                            Children
                          </p>

                          <div className="flex items-center overflow-hidden rounded-lg border bg-white">

                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setChildCount((prev) =>
                                  Math.max(0, prev - 1)
                                );
                              }}
                             disabled={
  remainingRooms <= 0 ||
  childCount === 0
}
                              className="px-4 py-2 text-lg font-bold hover:bg-gray-100 disabled:opacity-40"
                            >
                              -
                            </button>

                            <span className="min-w-[55px] text-center font-semibold">
                              {childCount}
                            </span>

                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setChildCount((prev) =>
                                  Math.min(
                                    room.MaxOccupancy.Children,
                                    prev + 1
                                  )
                                );
                              }}
                            disabled={
  remainingRooms <= 0 ||
  childCount === room.MaxOccupancy.Children
}
                              className="px-4 py-2 text-lg font-bold hover:bg-gray-100 disabled:opacity-40"
                            >
                              +
                            </button>

                          </div>

                        </div>

                      </div>

                      {/* Price */}

                   

                      {/* Button */}

                      <button
                        onClick={(e) => {
                          e.stopPropagation();

                          onBookRoom(
                            room,
                            plan,
                            price,
                            adultCount,
                            childCount
                          );
                        }}
                        disabled={remainingRooms <= 0}

className={`rounded-lg px-8 py-3 font-semibold text-white transition ${
  remainingRooms <= 0
    ? "cursor-not-allowed bg-gray-400"
    : "bg-[#163A84] hover:bg-[#0e2d66]"
}`}
                      >
                  {remainingRooms <= 0
  ? "Sold Out"
  : "Book Room"}
                      </button>

                    </div>

                  </div>

                </div>
              );
            })}
          </div>

        </div>

      </div>

    </div>
  );
};

export default RoomCard;