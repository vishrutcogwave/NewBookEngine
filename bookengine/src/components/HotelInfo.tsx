import {
  Star,
  MapPin,
  Phone,
  Mail,
  Wifi,
  Car,
  Snowflake,
} from "lucide-react";

interface HotelInfoProps {
  name: string;
  address: string;
  mobile: string;
  email: string;
  amenities: string[];
}

const getAmenityIcon = (amenity: string) => {
  switch (amenity.toLowerCase()) {
    case "wifi":
      return <Wifi size={14} />;

    case "air conditioning":
      return <Snowflake size={14} />;

    case "car parking":
      return <Car size={14} />;

    default:
      return null;
  }
};

const HotelInfo = ({
  name,
  address,
  mobile,
  email,
  amenities,
}: HotelInfoProps) => {
  return (
    <section className="border-b bg-white shadow-sm">
      <div className="w-full px-5 py-5 md:px-10 xl:px-16">
        <div className="flex flex-col justify-between gap-6 xl:flex-row">
          {/* LEFT */}
          <div className="flex-1">
            <div className="flex items-center gap-1">
              {[...Array(4)].map((_, i) => (
                <Star
                  key={i}
                  size={13}
                  className="fill-yellow-400 text-yellow-400"
                />
              ))}

              <span className="ml-2 text-xs text-gray-500">
                4-Star Hotel
              </span>
            </div>

            <h1 className="mt-2 text-2xl font-bold text-[#0F172A] md:text-4xl">
              {name}
            </h1>

            <div className="mt-4 space-y-3">
              <div className="flex items-start gap-3">
                <MapPin
                  size={16}
                  className="mt-0.5 flex-shrink-0 text-[#173D8E]"
                />

                <p className="text-sm leading-6 text-gray-500">
                  {address}
                </p>
              </div>

              <div className="flex flex-col gap-4 md:flex-row md:gap-6">
                <div className="flex items-center gap-2">
                  <Phone size={16} className="text-[#173D8E]" />

                  <span className="text-sm text-gray-600">
                    {mobile}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <Mail size={16} className="text-[#173D8E]" />

                  <span className="break-all text-sm text-gray-600">
                    {email}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT */}
          <div className="xl:w-72">
            <h3 className="mb-3 text-base font-semibold text-gray-800">
              Amenities
            </h3>

            <div className="flex flex-wrap gap-2">
              {amenities.map((item) => (
                <div
                  key={item}
                  className="inline-flex items-center gap-1.5 rounded-full border border-[#D9E8FF] bg-[#F5F9FF] px-3 py-1.5 text-xs font-medium text-[#173D8E]"
                >
                  {getAmenityIcon(item)}
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HotelInfo;