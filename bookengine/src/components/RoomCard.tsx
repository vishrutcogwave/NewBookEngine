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
const [showPreview, setShowPreview] = useState(false);
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
<div className="grid grid-cols-1 xl:grid-cols-[420px_1fr] gap-4 md:gap-6 xl:gap-8 items-start rounded-2xl border bg-white p-3 sm:p-5 lg:p-6">

  {/* LEFT IMAGE */}
<div className="lg:sticky lg:top-6 w-full">
  <div className="relative h-56 sm:h-72 md:h-80 lg:h-[320px] xl:h-[360px] overflow-hidden rounded-2xl">

      <img
        src={room.RoomImages[currentImage]}
        alt={room.RoomTypeName}
        onClick={() => setShowPreview(true)}
        className="absolute inset-0 h-full w-full object-cover transition hover:scale-105"
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
  className={`absolute  rounded-md left-3 top-3 sm:left-4 sm:top-4 px-2 sm:px-3 py-1 text-[11px] sm:text-xs font-semibold text-white ${
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

       

      </div>
       <div className="min-w-0">

          <div className="flex items-start justify-between">

            <div>

          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 leading-tight">
                {room.RoomTypeName}
              </h2>

              <div className="mt-2 flex flex-wrap items-center gap-2 text-xs sm:text-sm text-gray-500">

                <Users size={16} />

                Max {room.MaxOccupancy.Adults} Adults

                {room.MaxOccupancy.Children > 0 &&
                  ` • ${room.MaxOccupancy.Children} Child`}

              </div>

            </div>

          </div>

          {/* Amenities */}

          <div className="mt-6 flex flex-wrap gap-2 sm:gap-3">

            {room.Amenities.map((item) => (
              <div
                key={item}
                className="flex items-center gap-2 rounded-full bg-gray-100 px-2 sm:px-3 py-2 text-xs sm:text-sm whitespace-nowrap"
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

          <p className="mt-5 text-sm sm:text-base leading-6 sm:leading-7 text-gray-600">
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

                  <div className="flex p-4 sm:p-5 lg:p-6">

                 <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between w-full gap-6">

  <div>

    <h3 className="text-lg sm:text-xl lg:text-2xl font-semibold text-gray-900 leading-tight">
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

  <div className="w-full text-left mt-4 lg:mt-0 lg:w-auto lg:text-right">

<h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#1F2D5A]">
  ₹{totalPerNight.toLocaleString()}
</h2>

    <p className="mt-1 whitespace-nowrap text-sm sm:text-base text-gray-500">
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

                                    <div className="border-t bg-gray-50 p-4 sm:p-5">

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
  className={`w-full sm:w-auto rounded-lg px-6 py-3 font-semibold transition ${
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
    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

      <span className="font-semibold text-gray-700">
        Room
      </span>

      <div className="flex items-center gap-2 sm:gap-3">

        {/* Adults */}
        <div className="flex items-center rounded-full border border-gray-300 bg-white px-2 sm:px-3 py-2">

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

          <span className="px-2 text-sm sm:text-base font-medium whitespace-nowrap">
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
        <div className="flex items-center rounded-full border border-gray-300 bg-white px-2 sm:px-3 py-2">

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

          <span className="px-2 text-sm sm:text-base font-medium whitespace-nowrap">
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
          className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-full border border-red-300 text-red-500"
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
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#163A84] text-xl font-bold text-white"
        >
          +
        </button>

      </div>

    </div>

    <div className="mt-3 text-left lg:text-right font-semibold text-gray-900">
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
{showPreview && (
  <div
    className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/95"
    onClick={() => setShowPreview(false)}
  >
    {/* Close */}
    <button
      onClick={(e) => {
        e.stopPropagation();
        setShowPreview(false);
      }}
      className="absolute right-6 top-6 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-white/20 text-3xl text-white backdrop-blur transition hover:bg-white/40"
    >
      ✕
    </button>

    {/* Previous */}
    {room.RoomImages.length > 1 && (
      <button
        onClick={(e) => {
          e.stopPropagation();
          previousImage();
        }}
        className="absolute left-6 top-1/2 z-50 flex h-14 w-14 -translate-y-1/2 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur transition hover:bg-white/40"
      >
        <ChevronLeft size={32} />
      </button>
    )}

    {/* Next */}
    {room.RoomImages.length > 1 && (
      <button
        onClick={(e) => {
          e.stopPropagation();
          nextImage();
        }}
        className="absolute right-6 top-1/2 z-50 flex h-14 w-14 -translate-y-1/2 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur transition hover:bg-white/40"
      >
        <ChevronRight size={32} />
      </button>
    )}

    {/* Main Image */}
    <img
      src={room.RoomImages[currentImage]}
      alt={room.RoomTypeName}
      onClick={(e) => e.stopPropagation()}
      className="max-h-[88vh] max-w-[92vw] rounded-xl object-contain shadow-2xl"
    />

    {/* Counter */}
    <div className="absolute bottom-32 left-1/2 -translate-x-1/2 rounded-full bg-black/60 px-5 py-2 text-sm text-white">
      {currentImage + 1} / {room.RoomImages.length}
    </div>

    {/* Thumbnails */}
    <div
      className="absolute bottom-6 left-1/2 flex -translate-x-1/2 gap-3 overflow-x-auto rounded-xl bg-black/50 p-3 backdrop-blur"
      onClick={(e) => e.stopPropagation()}
    >
      {room.RoomImages.map((img, index) => (
        <img
          key={index}
          src={img}
          alt=""
          onClick={() => setCurrentImage(index)}
          className={`h-20 w-28 cursor-pointer rounded-lg object-cover border-2 transition ${
            currentImage === index
              ? "border-white"
              : "border-transparent opacity-70 hover:opacity-100"
          }`}
        />
      ))}
    </div>
  </div>
)}
    </div>
  );
};




export default RoomCard;