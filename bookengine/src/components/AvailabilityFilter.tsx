import { CalendarDays, Search } from "lucide-react";

interface AvailabilityFilterProps {
  checkIn: string;
  checkOut: string;
  nights: number;
  onSearch?: () => void;
}

const AvailabilityFilter = ({
  checkIn,
  checkOut,
  nights,
  onSearch,
}: AvailabilityFilterProps) => {
  return (
    <section className="pb-8">
      <div className="w-full px-5 md:px-10 xl:px-16">
        <div className="overflow-hidden rounded-xl bg-white shadow-lg border">

          {/* Header */}
          <div className="flex items-center gap-2 bg-[#173D8E] px-6 py-3 text-white">
            <Search size={18} />
            <span className="text-lg font-semibold">
              Check Availability
            </span>
          </div>

          {/* Filters */}
          <div className="grid grid-cols-1 md:grid-cols-12">

            {/* Check In */}
            <div className="flex items-center gap-4 border-b md:border-b-0 md:border-r px-6 py-5 md:col-span-3">
              <CalendarDays
                size={24}
                className="text-[#173D8E] flex-shrink-0"
              />

              <div>
                <p className="text-xs uppercase tracking-wider text-gray-400 font-semibold">
                  Check-In
                </p>

                <p className="mt-1 text-lg font-semibold text-gray-800">
                  {checkIn}
                </p>
              </div>
            </div>

            {/* Nights */}
            <div className="flex flex-col items-center justify-center border-b md:border-b-0 md:border-r px-6 py-5 md:col-span-1">
              <h2 className="text-3xl font-bold text-[#173D8E]">
                {nights}
              </h2>

              <span className="text-xs uppercase text-gray-400">
                Night
              </span>
            </div>

            {/* Check Out */}
            <div className="flex items-center gap-4 border-b md:border-b-0 md:border-r px-6 py-5 md:col-span-3">
              <CalendarDays
                size={24}
                className="text-[#173D8E] flex-shrink-0"
              />

              <div>
                <p className="text-xs uppercase tracking-wider text-gray-400 font-semibold">
                  Check-Out
                </p>

                <p className="mt-1 text-lg font-semibold text-gray-800">
                  {checkOut}
                </p>
              </div>
            </div>

       

            {/* Search */}
            <div className="flex items-center justify-center p-4 md:col-span-2">
              <button
                onClick={onSearch}
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#FF6B00] px-6 py-4 font-semibold text-white transition hover:bg-[#e76000]"
              >
                <Search size={20} />
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