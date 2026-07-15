import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  MapPin,
  Phone,
  Mail,
} from "lucide-react";
import { getHotelContact } from "../api/hotel.service";

interface ContactResponse {
  Address: string;
  MobileNo: string;
  Email: string;
}

export default function ContactUs() {
  const [contact, setContact] = useState<ContactResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadContact();
  }, []);

 const loadContact = async () => {
  try {
    const propertyid = localStorage.getItem("propertyid") || "";
    const HotelID = localStorage.getItem("HotelID") || "";
    const Branchcode = localStorage.getItem("Branchcode") || "";

    const res = await getHotelContact(
      propertyid,
      HotelID,
      Branchcode
    );

    setContact(res);
  } catch (err) {
    console.error(err);
  } finally {
    setLoading(false);
  }
};
  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        Loading...
      </div>
    );
  }

  if (!contact) {
    return (
      <div className="flex h-screen items-center justify-center">
        Failed to load contact details.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="mx-auto max-w-4xl p-6">
        <Link
          to="/"
          className="text-blue-600 hover:underline"
        >
          ← Back
        </Link>

        <div className="mt-4 rounded-xl bg-white p-8 shadow">
          <h1 className="mb-8 text-3xl font-bold text-[#163A84]">
            Contact Us
          </h1>

          <div className="space-y-6">

            <div className="flex items-start gap-4">
              <MapPin
                size={24}
                className="mt-1 text-[#163A84]"
              />
              <div>
                <p className="font-semibold text-gray-800">
                  Address
                </p>
                <p className="text-gray-600">
                  {contact.Address}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <Phone
                size={24}
                className="text-[#163A84]"
              />
              <div>
                <p className="font-semibold text-gray-800">
                  Mobile
                </p>
                <a
                  href={`tel:${contact.MobileNo}`}
                  className="text-blue-600 hover:underline"
                >
                  {contact.MobileNo}
                </a>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <Mail
                size={24}
                className="text-[#163A84]"
              />
              <div>
                <p className="font-semibold text-gray-800">
                  Email
                </p>
                <a
                  href={`mailto:${contact.Email}`}
                  className="text-blue-600 hover:underline"
                >
                  {contact.Email}
                </a>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}