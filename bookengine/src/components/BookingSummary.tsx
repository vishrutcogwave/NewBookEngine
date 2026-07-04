import { CalendarDays, Users, Trash2 } from "lucide-react";

export interface SelectedRoom {
  id: string;
  roomName: string;
  rateName: string;
  price: number;
  quantity: number;
}

interface BookingSummaryProps {
  rooms: SelectedRoom[];
  checkIn: string;
  checkOut: string;
  guests: string;
  nights: number;
  onRemove?: (id: string) => void;
}

const BookingSummary = ({
  rooms,
  checkIn,
  checkOut,
  guests,
  nights,
  onRemove,
}: BookingSummaryProps) => {
  const roomSubtotal = rooms.reduce(
    (sum, room) => sum + room.price * room.quantity,
    0
  );

  const taxes = Math.round(roomSubtotal * 0.12);

  const total = roomSubtotal + taxes;

  const totalRooms = rooms.reduce(
    (sum, room) => sum + room.quantity,
    0
  );

  return (
    <div className="sticky top-5 overflow-hidden rounded-xl border bg-white shadow-lg">

      {/* Header */}

      <div className="flex items-center justify-between bg-[#173D8E] px-5 py-4 text-white">

        <h2 className="text-xl font-bold">
          Your Selection
        </h2>

        <span className="rounded-full bg-[#FF6B00] px-3 py-1 text-sm font-semibold">
          {totalRooms} Rooms
        </span>

      </div>

      {/* Stay */}

      <div className="grid grid-cols-2 border-b bg-[#F8FAFC]">

        <div className="flex gap-3 p-4">

          <CalendarDays
            size={20}
            className="text-[#173D8E]"
          />

          <div>

            <p className="text-xs font-semibold uppercase text-gray-400">
              Stay
            </p>

            <p className="font-semibold">
              {checkIn} → {checkOut}
            </p>

            <p className="text-sm text-gray-500">
              {nights} Night
            </p>

          </div>

        </div>

        <div className="flex gap-3 p-4">

          <Users
            size={20}
            className="text-[#173D8E]"
          />

          <div>

            <p className="text-xs font-semibold uppercase text-gray-400">
              Guests
            </p>

            <p className="font-semibold">
              {guests}
            </p>

          </div>

        </div>

      </div>

      {/* Rooms */}

      <div>

        {rooms.length === 0 ? (
          <div className="p-6 text-center text-gray-500">
            No rooms selected
          </div>
        ) : (
          rooms.map((room) => (
            <div
              key={room.id}
              className="border-b p-5"
            >
              <div className="flex justify-between">

                <div>

                  <h3 className="font-bold">
                    {room.roomName}
                  </h3>

                  <p className="text-sm text-gray-500">
                    {room.rateName}
                  </p>

                  <p className="mt-1 text-sm text-gray-500">
                    {room.quantity} × ₹
                    {room.price.toLocaleString()}
                  </p>

                </div>

                <div className="text-right">

                  <div className="text-2xl font-bold">
                    ₹
                    {(room.price * room.quantity).toLocaleString()}
                  </div>

                  <button
                    onClick={() => onRemove?.(room.id)}
                    className="mt-2 text-red-500"
                  >
                    <Trash2 size={18} />
                  </button>

                </div>

              </div>
            </div>
          ))
        )}

      </div>

      {/* Totals */}

      <div className="space-y-3 border-t bg-[#F8FAFC] p-5">

        <div className="flex justify-between">
          <span>Room Subtotal</span>

          <span>
            ₹{roomSubtotal.toLocaleString()}
          </span>
        </div>

        <div className="flex justify-between">

          <span>Taxes (12%)</span>

          <span>
            ₹{taxes.toLocaleString()}
          </span>

        </div>

        <div className="flex justify-between border-t pt-3 text-xl font-bold">

          <span>Total</span>

          <span className="text-[#173D8E]">
            ₹{total.toLocaleString()}
          </span>

        </div>

        <button className="mt-4 w-full rounded-lg bg-[#FF6B00] py-4 text-lg font-bold text-white transition hover:bg-[#E65C00]">
          Book Now · ₹{total.toLocaleString()}
        </button>

        <p className="text-center text-sm text-gray-500">
          No payment now • Pay at hotel
        </p>

      </div>

    </div>
  );
};

export default BookingSummary;