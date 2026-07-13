import type { SelectedRoom } from "./BookingSummary";
import RoomCard from "./RoomCard";

export interface RoomType {
  RoomTypeId: string;
  HotelId: string;
  RoomTypeName: string;
  RoomTypeDescription: string;
  RoomImages: string[];
  Amenities: string[];

  MaxOccupancy: {
    DefaultAdult: number;
    Adults: number;
    Children: number;
    Infants: number;
  };

  Availability: {
    Available: boolean;
    RoomsLeft: number;
  };

  RatePlans: RatePlan[];
}

export interface PriceDetail {
  RatePlanId: string;
  RoomTypeId: string;
  RatePax: number;
  PricePerNight: number;
  OfferPricePerNight: number;
  ChildRatePerNight: number;
  OfferChildRateperNight: number;
}

export interface PaxPrice {
  AdultPrice: number;
  ChildPrice: number;
}

export interface RatePlanPrice {
  ProcessDate: string;
  Prices: Record<string, PaxPrice>[];
}

export interface RatePlan {
  RatePlanId: string;
  RateName: string;
  RateShortName: string;
  CancellationPolicy: string;
  PricePerNight: number;
  AvailableRoom: number;
  RequiredRoom: number;
  Currency: string;
  IsDefaultSelect: boolean;

  PriceDetails: RatePlanPrice[];
}

interface RoomListProps {
  rooms: RoomType[];
selectedRooms: SelectedRoom[];
onBookRoom: (
  room: RoomType,
  ratePlan: RatePlan,
  price: PriceDetail,
  adults: number,
  children: number
) => void;
onRemoveRoom: (roomId: string) => void;
}

const RoomList = ({
  rooms,
  selectedRooms,
  onBookRoom,
  onRemoveRoom
}: RoomListProps) => {
  if (!rooms || rooms.length === 0) {
    return (
      <div className="rounded-xl border bg-white p-10 text-center">
        <h3 className="text-lg font-semibold">
          No Rooms Available
        </h3>

        <p className="mt-2 text-gray-500">
          Please change your dates and try again.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">
        {rooms.length} Room Types Available
      </h2>

    {rooms.map((room) => {
  const bookedRooms = selectedRooms
    .filter((x) => x.RoomTypeId === room.RoomTypeId)
    .reduce((sum, x) => sum + x.Quantity, 0);

  return (
  <RoomCard
  key={room.RoomTypeId}
  room={room}
  bookedRooms={bookedRooms}
  onBookRoom={onBookRoom}
  onRemoveRoom={onRemoveRoom}
/>
  );
})}
    </div>
  );
};

export default RoomList;