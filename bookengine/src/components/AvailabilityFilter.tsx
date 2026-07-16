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
    <section className="pb-5">
      <div className="w-full px-5 md:px-10 xl:px-16">
        <div className="overflow-hidden rounded-xl border bg-white shadow-md">

          {/* Header */}
          <div className="flex items-center gap-2 bg-[#173D8E] px-4 py-2 text-white">
            <Search size={16} />
            <span className="text-base font-semibold">
              Check Availability
            </span>
          </div>

          {/* Body */}
          <div className="grid grid-cols-2 md:grid-cols-12">

            {/* Check In */}
            <div
              className="relative flex cursor-pointer items-center gap-2 border-b border-r border-gray-200 px-3 py-3 md:col-span-4 md:px-5 md:py-4"
              onClick={() => checkInRef.current?.showPicker()}
            >
              <CalendarDays
                size={16}
                className="flex-shrink-0 text-[#173D8E]"
              />

              <div>
                <p className="text-[9px] font-semibold uppercase tracking-wide text-gray-400">
                  Check-In
                </p>

                <p className="mt-0.5 text-xs font-semibold text-gray-800 md:text-base">
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

            {/* Desktop Nights */}
            <div className="hidden md:flex md:col-span-1 flex-col items-center justify-center border-b border-r border-gray-200 py-3">
              <h2 className="text-2xl font-bold text-[#173D8E]">
                {nights}
              </h2>

              <span className="text-[10px] uppercase tracking-wide text-gray-400">
                Night
              </span>
            </div>

            {/* Check Out */}
            <div
              className="relative flex cursor-pointer items-center gap-2 border-b border-gray-200 px-3 py-3 md:col-span-4 md:border-r md:px-5 md:py-4"
              onClick={() => checkOutRef.current?.showPicker()}
            >
              <CalendarDays
                size={16}
                className="flex-shrink-0 text-[#173D8E]"
              />

              <div>
                <p className="text-[9px] font-semibold uppercase tracking-wide text-gray-400">
                  Check-Out
                </p>

                <p className="mt-0.5 text-xs font-semibold text-gray-800 md:text-base">
                  {formatDisplayDate(checkOut)}
                </p>
              </div>

              <input
                ref={checkOutRef}
                type="date"
                min={checkIn || today}
                value={checkOut}
                onChange={(e) => onCheckOutChange(e.target.value)}
                className="absolute left-0 top-0 h-0 w-0 opacity-0"
              />
            </div>

            {/* Search */}
            <div className="col-span-2 p-2 md:col-span-3 md:flex md:items-center md:justify-center md:p-3">
              <button
                onClick={onSearch}
                className="flex h-10 w-full items-center justify-center gap-2 rounded-md bg-[#FF6B00] px-5 text-sm font-semibold text-white transition hover:bg-[#e76000] md:h-11 md:max-w-[170px]"
              >
                <Search size={16} />
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