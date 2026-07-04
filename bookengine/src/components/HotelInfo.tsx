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
      return <Wifi size={18} />;

    case "air conditioning":
      return <Snowflake size={18} />;

    case "car parking":
      return <Car size={18} />;

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
  <section className="bg-white shadow-sm border-b">
    <div className="w-full px-5 md:px-10 xl:px-16 py-7">

      <div className="flex flex-col xl:flex-row justify-between gap-8">

        {/* LEFT */}

        <div className="flex-1">

          <div className="flex items-center gap-1">

            {[...Array(4)].map((_, i) => (
              <Star
                key={i}
                size={15}
                className="fill-yellow-400 text-yellow-400"
              />
            ))}

            <span className="ml-2 text-sm text-gray-500">
              4-Star Hotel
            </span>

          </div>

          <h1 className="mt-3 text-3xl md:text-5xl font-bold text-[#0F172A]">
            {name}
          </h1>

          <div className="mt-6 space-y-4">

            <div className="flex items-start gap-3">

              <MapPin
                size={18}
                className="text-[#173D8E] mt-1 flex-shrink-0"
              />

              <p className="text-gray-500">
                {address}
              </p>

            </div>

            <div className="flex flex-col md:flex-row gap-6">

              <div className="flex items-center gap-2">

                <Phone
                  size={18}
                  className="text-[#173D8E]"
                />

                <span className="text-gray-600">
                  {mobile}
                </span>

              </div>

              <div className="flex items-center gap-2">

                <Mail
                  size={18}
                  className="text-[#173D8E]"
                />

                <span className="text-gray-600 break-all">
                  {email}
                </span>

              </div>

            </div>

          </div>

        </div>

        {/* RIGHT */}

        <div className="xl:w-80">

          <h3 className="font-semibold text-gray-800 mb-4">
            Amenities
          </h3>

          <div className="flex flex-wrap gap-3">

            {amenities.map((item) => (
              <div
                key={item}
                className="inline-flex items-center gap-2 rounded-full border border-[#D9E8FF] bg-[#F5F9FF] px-5 py-2 text-[#173D8E] text-sm"
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