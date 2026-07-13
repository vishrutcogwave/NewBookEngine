import { ShieldCheck, Clock } from "lucide-react";

interface Props {
  checkIn: string;
  checkOut: string;
  cancellation: string;
  points: string[];
}

const formatTime = (time: string) => {
  if (!time) return "-";

  const [hour, minute] = time.split(":").map(Number);

  const date = new Date();
  date.setHours(hour);
  date.setMinutes(minute);

  return date.toLocaleTimeString("en-IN", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
};

const HotelPolicies = ({
  checkIn,
  checkOut,
  cancellation,
  points,
}: Props) => {
  return (
    <div className="rounded-xl border bg-white shadow-sm">

      <div className="flex items-center gap-2 border-b px-6 py-4">
        <ShieldCheck size={20} className="text-[#173f8a]" />

        <h2 className="text-lg font-bold text-[#173f8a]">
          Hotel Policies
        </h2>
      </div>

      <div className="space-y-6 p-6">

        <div className="grid grid-cols-2 gap-4">

          <div className="rounded-lg bg-blue-50 p-4">
            <div className="mb-2 flex items-center gap-2">
              <Clock size={16} className="text-[#173f8a]" />

              <span className="text-xs font-semibold uppercase text-gray-500">
                Check-In
              </span>
            </div>

            <p className="text-lg font-bold text-[#173f8a]">
              {formatTime(checkIn)}
            </p>
          </div>

          <div className="rounded-lg bg-blue-50 p-4">
            <div className="mb-2 flex items-center gap-2">
              <Clock size={16} className="text-[#173f8a]" />

              <span className="text-xs font-semibold uppercase text-gray-500">
                Check-Out
              </span>
            </div>

            <p className="text-lg font-bold text-[#173f8a]">
              {formatTime(checkOut)}
            </p>
          </div>

        </div>

        <div>
          <h3 className="font-semibold text-gray-800">
            Cancellation Policy
          </h3>

          <p className="mt-2 text-gray-600">
            {cancellation}
          </p>
        </div>

        <div>
          <h3 className="font-semibold text-gray-800">
            House Rules
          </h3>

          <ul className="mt-3 list-disc space-y-2 pl-5 text-gray-600">
            {points.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </div>

      </div>

    </div>
  );
};

export default HotelPolicies;