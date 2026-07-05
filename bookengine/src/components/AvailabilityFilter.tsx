import { useRef } from "react";
import { CalendarDays, Search } from "lucide-react";

interface AvailabilityFilterProps {
  checkIn: string;
  checkOut: string;
  nights: number;
  onCheckInChange: (value: string) => void;
  onCheckOutChange: (value: string) => void;
  onSearch?: () => void;
}

const formatDisplayDate = (date: string) => {
  if (!date) return "";

  return new Date(date).toLocaleDateString("en-GB", {
    weekday: "short",
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const AvailabilityFilter = ({
  checkIn,
  checkOut,
  nights,
  onCheckInChange,
  onCheckOutChange,
  onSearch,
}: AvailabilityFilterProps) => {
  const checkInRef = useRef<HTMLInputElement>(null);
  const checkOutRef = useRef<HTMLInputElement>(null);
const today = new Date().toISOString().split("T")[0];
  return (
    <section className="pb-8">
      <div className="w-full px-5 md:px-10 xl:px-16">
        <div className="overflow-hidden rounded-xl border bg-white shadow-lg">
          {/* Header */}
          <div className="flex items-center gap-2 bg-[#173D8E] px-6 py-3 text-white">
            <Search size={18} />
            <span className="text-lg font-semibold">
              Check Availability
            </span>
          </div>

          {/* Body */}
          <div className="grid grid-cols-1 md:grid-cols-12">

            {/* Check In */}
            <div
              className="relative flex cursor-pointer items-center gap-4 border-b border-gray-200 px-6 py-5 md:col-span-4 md:border-b-0 md:border-r"
              onClick={() => checkInRef.current?.showPicker()}
            >
              <CalendarDays
                size={22}
                className="text-[#173D8E] flex-shrink-0"
              />

              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-gray-400">
                  Check-In
                </p>

                <p className="mt-1 text-xl font-semibold text-gray-800">
                  {formatDisplayDate(checkIn)}
                </p>
              </div>

              <input
                ref={checkInRef}
                type="date"
                  min={today}
                value={checkIn}
                onChange={(e) => onCheckInChange(e.target.value)}
                className="absolute left-0 top-0 h-0 w-0 opacity-0"
              />
            </div>

            {/* Nights */}
            <div className="flex flex-col items-center justify-center border-b border-gray-200 px-6 py-5 md:col-span-1 md:border-b-0 md:border-r">
              <h2 className="text-3xl font-bold text-[#173D8E]">
                {nights}
              </h2>

              <span className="text-xs font-semibold uppercase tracking-widest text-gray-400">
                Night
              </span>
            </div>

            {/* Check Out */}
            <div
              className="relative flex cursor-pointer items-center gap-4 border-b border-gray-200 px-6 py-5 md:col-span-4 md:border-b-0 md:border-r"
              onClick={() => checkOutRef.current?.showPicker()}
            >
              <CalendarDays
                size={22}
                className="text-[#173D8E] flex-shrink-0"
              />

              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-gray-400">
                  Check-Out
                </p>

                <p className="mt-1 text-xl font-semibold text-gray-800">
                  {formatDisplayDate(checkOut)}
                </p>
              </div>

              <input
                ref={checkOutRef}
                type="date"
                value={checkOut}
                  min={checkIn || today}
                onChange={(e) => onCheckOutChange(e.target.value)}
                className="absolute left-0 top-0 h-0 w-0 opacity-0"
              />
            </div>

            {/* Search */}
            <div className="flex items-center justify-center p-4 md:col-span-3">
              <button
                onClick={onSearch}
                className="flex w-full max-w-[180px] items-center justify-center gap-2 rounded-md bg-[#FF6B00] px-6 py-3 font-semibold text-white transition hover:bg-[#e76000]"
              >
                <Search size={18} />
                Search
              </button>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
};

export default AvailabilityFilter;