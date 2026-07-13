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
    children: number,
    roomId?: string
  ) => void;

onRemoveRoom: (roomId: string) => void;
}

const RoomCard = ({
  room,
  bookedRooms,
  onBookRoom,
  onRemoveRoom
}: Props) => {
  const [currentImage, setCurrentImage] = useState(0);

  const [selectedRatePlan, setSelectedRatePlan] = useState(
    room.RatePlans.find((x) => x.IsDefaultSelect) ??
      room.RatePlans[0]
  );

interface SelectedRoomData {
  id: string;
  adults: number;
  children: number;
}

const [selectedRooms, setSelectedRooms] = useState<
  Record<string, SelectedRoomData[]>
>({});

const adultCount = room.MaxOccupancy.DefaultAdult;
const childCount = 0;
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
              const planRooms = selectedRooms[plan.RatePlanId] || [];
const remainingRooms =
  Math.max(0, room.Availability.RoomsLeft - bookedRooms);
const paxPrices = plan.PriceDetails?.[0]?.Prices?.[0] || {};

// Always show Default Adult price on the card
const defaultPrice =
  paxPrices[room.MaxOccupancy.DefaultAdult.toString()];

const totalPerNight = defaultPrice?.AdultPrice ?? 0;
// ADD THIS
const adultPrice =
  paxPrices[adultCount.toString()] ??
  defaultPrice;

const childPrice =
  childCount > 0
    ? paxPrices[childCount.toString()] ?? defaultPrice
    : { ChildPrice: 0 };

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
  {adultCount} Adult{adultCount > 1 ? "s" : ""} Included
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

                  

                      </div>

                      {/* Price */}

                   

                      {/* Button */}

            <button
  onClick={(e) => {
    e.stopPropagation();

    if (remainingRooms <= 0 || planRooms.length > 0) return;

   const roomData = {
  id: crypto.randomUUID(),
      adults: room.MaxOccupancy.DefaultAdult,
      children: 0,
    };

   setSelectedRooms((prev) => ({
  ...prev,
  [plan.RatePlanId]: [
    ...(prev[plan.RatePlanId] || []),
    roomData,
  ],
}));

onBookRoom(
  room,
  plan,
  {
    RatePlanId: plan.RatePlanId,
    RoomTypeId: room.RoomTypeId,
    RatePax: roomData.adults,
    PricePerNight: adultPrice?.AdultPrice ?? 0,
    OfferPricePerNight: adultPrice?.AdultPrice ?? 0,
    ChildRatePerNight: childPrice?.ChildPrice ?? 0,
    OfferChildRateperNight: childPrice?.ChildPrice ?? 0,
  },
  roomData.adults,
  roomData.children,
  roomData.id
);
  }}
  disabled={remainingRooms <= 0 || planRooms.length > 0}
  className={`rounded-lg px-8 py-3 font-semibold transition ${
    remainingRooms <= 0
      ? "cursor-not-allowed bg-gray-400 text-white"
      : planRooms.length > 0
      ? "cursor-not-allowed bg-gray-200 text-gray-500"
      : "bg-[#163A84] hover:bg-[#0e2d66] text-white"
  }`}
>
  {remainingRooms <= 0
    ? "Sold Out"
    : planRooms.length > 0
    ? "Added"
    : "Book Room"}
</button>
                    </div>
{planRooms.map((item) => (
  <div
    key={item.id}
    className="mt-4 border-t pt-4"
  >
    <div className="flex items-center justify-between">

      <span className="font-semibold text-gray-700">
        Room
      </span>

      <div className="flex items-center gap-3">

        {/* Adults */}
        <div className="flex items-center rounded-full border border-gray-300 bg-white px-3 py-2">

          <button
          onClick={() => {
  const newAdults = Math.max(
    room.MaxOccupancy.DefaultAdult,
    item.adults - 1
  );

  setSelectedRooms(prev => ({
    ...prev,
    [plan.RatePlanId]: (prev[plan.RatePlanId] || []).map(r =>
      r.id === item.id
        ? { ...r, adults: newAdults }
        : r
    ),
  }));

  const updatedAdultPrice =
    paxPrices[newAdults.toString()]?.AdultPrice ?? 0;

  const updatedChildPrice =
    paxPrices[item.children.toString()]?.ChildPrice ?? 0;

  onBookRoom(
    room,
    plan,
    {
      RatePlanId: plan.RatePlanId,
      RoomTypeId: room.RoomTypeId,
      RatePax: newAdults,
      PricePerNight: updatedAdultPrice,
      OfferPricePerNight: updatedAdultPrice,
      ChildRatePerNight: updatedChildPrice,
      OfferChildRateperNight: updatedChildPrice,
    },
    newAdults,
    item.children,
    item.id
  );
}}
            className="px-2 text-gray-500"
          >
            -
          </button>

          <span className="px-3 font-medium">
            {item.adults} Adults
          </span>

          <button
  onClick={() => {
  const newAdults = Math.min(
    room.MaxOccupancy.Adults,
    item.adults + 1
  );

  setSelectedRooms(prev => ({
    ...prev,
    [plan.RatePlanId]: (prev[plan.RatePlanId] || []).map(r =>
      r.id === item.id
        ? {
            ...r,
            adults: newAdults,
          }
        : r
    ),
  }));

  const updatedAdultPrice =
    paxPrices[newAdults.toString()]?.AdultPrice ?? 0;

  const updatedChildPrice =
    paxPrices[item.children.toString()]?.ChildPrice ?? 0;

  onBookRoom(
    room,
    plan,
    {
      RatePlanId: plan.RatePlanId,
      RoomTypeId: room.RoomTypeId,
      RatePax: newAdults,
      PricePerNight: updatedAdultPrice,
      OfferPricePerNight: updatedAdultPrice,
      ChildRatePerNight: updatedChildPrice,
      OfferChildRateperNight: updatedChildPrice,
    },
    newAdults,
    item.children,
    item.id
  );
}}
            className="px-2 text-[#163A84]"
          >
            +
          </button>

        </div>

        {/* Children */}
        <div className="flex items-center rounded-full border border-gray-300 bg-white px-3 py-2">

          <button
  onClick={() => {
  const newChildren = Math.max(
    0,
    item.children - 1
  );

  setSelectedRooms(prev => ({
    ...prev,
    [plan.RatePlanId]: (prev[plan.RatePlanId] || []).map(r =>
      r.id === item.id
        ? { ...r, children: newChildren }
        : r
    ),
  }));

  const updatedAdultPrice =
    paxPrices[item.adults.toString()]?.AdultPrice ?? 0;

  const updatedChildPrice =
    paxPrices[newChildren.toString()]?.ChildPrice ?? 0;

  onBookRoom(
    room,
    plan,
    {
      RatePlanId: plan.RatePlanId,
      RoomTypeId: room.RoomTypeId,
      RatePax: item.adults,
      PricePerNight: updatedAdultPrice,
      OfferPricePerNight: updatedAdultPrice,
      ChildRatePerNight: updatedChildPrice,
      OfferChildRateperNight: updatedChildPrice,
    },
    item.adults,
    newChildren,
    item.id
  );
}}
            className="px-2 text-gray-500"
          >
            -
          </button>

          <span className="px-3 font-medium">
            {item.children} Child
          </span>

          <button
      onClick={() => {
  const newChildren = Math.min(
    room.MaxOccupancy.Children,
    item.children + 1
  );

  setSelectedRooms(prev => ({
    ...prev,
    [plan.RatePlanId]: (prev[plan.RatePlanId] || []).map(r =>
      r.id === item.id
        ? { ...r, children: newChildren }
        : r
    ),
  }));

  const updatedAdultPrice =
    paxPrices[item.adults.toString()]?.AdultPrice ?? 0;

  const updatedChildPrice =
    paxPrices[newChildren.toString()]?.ChildPrice ?? 0;

  onBookRoom(
    room,
    plan,
    {
      RatePlanId: plan.RatePlanId,
      RoomTypeId: room.RoomTypeId,
      RatePax: item.adults,
      PricePerNight: updatedAdultPrice,
      OfferPricePerNight: updatedAdultPrice,
      ChildRatePerNight: updatedChildPrice,
      OfferChildRateperNight: updatedChildPrice,
    },
    item.adults,
    newChildren,
    item.id
  );
}}
            className="px-2 text-[#163A84]"
          >
            +
          </button>

        </div>

        {/* Delete */}
        <button
 onClick={() => {
  // Remove from RoomCard UI
  setSelectedRooms(prev => ({
    ...prev,
    [plan.RatePlanId]: (prev[plan.RatePlanId] || []).filter(
      x => x.id !== item.id
    ),
  }));

  // Remove from Booking Summary
onRemoveRoom(item.id);
}}
          className="flex h-10 w-10 items-center justify-center rounded-full border border-red-300 text-red-500"
        >
          🗑
        </button>

        {/* Add More */}
        <button
  onClick={() => {
  const newRoom = {
    id: crypto.randomUUID(),
    adults: room.MaxOccupancy.DefaultAdult,
    children: 0,
  };

  // Update RoomCard UI
  setSelectedRooms(prev => ({
    ...prev,
    [plan.RatePlanId]: [
      ...(prev[plan.RatePlanId] || []),
      newRoom,
    ],
  }));

  // Add to Booking Summary
  onBookRoom(
    room,
    plan,
    {
      RatePlanId: plan.RatePlanId,
      RoomTypeId: room.RoomTypeId,
      RatePax: newRoom.adults,
      PricePerNight: adultPrice?.AdultPrice ?? 0,
      OfferPricePerNight: adultPrice?.AdultPrice ?? 0,
      ChildRatePerNight: childPrice?.ChildPrice ?? 0,
      OfferChildRateperNight: childPrice?.ChildPrice ?? 0,
    },
    newRoom.adults,
    newRoom.children,
    newRoom.id
  );
}}
          className="flex h-10 w-10 items-center justify-center rounded bg-[#163A84] text-white"
        >
          +
        </button>

      </div>

    </div>

    <div className="mt-2 text-right font-semibold text-gray-900">
    ₹{(
  (paxPrices[item.adults.toString()]?.AdultPrice ?? 0) +
  (paxPrices[item.children.toString()]?.ChildPrice ?? 0) *
    item.children
).toLocaleString()}
      <span className="font-normal text-gray-500">
        {" "}+ Taxes (per night)
      </span>
    </div>

  </div>
))}
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