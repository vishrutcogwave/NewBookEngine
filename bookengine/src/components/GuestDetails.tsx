import { User, Mail, Phone } from "lucide-react";

interface Props {
  fullName: string;
  email: string;
  mobile: string;

  errors: {
    fullName: string;
    email: string;
    mobile: string;
  };

  onChange: (field: string, value: string) => void;
}

const GuestDetails = ({
  fullName,
  email,
  mobile,
  errors,
  onChange,
}: Props) => {
  return (
    <div className="rounded-xl border bg-white shadow-sm">
      <div className="border-b px-6 py-4">
        <h2 className="text-xl font-bold text-[#173f8a]">
          Guest Details
        </h2>

        <p className="mt-1 text-sm text-gray-500">
          Please enter your details to continue.
        </p>
      </div>

      <div className="space-y-5 p-6">

        {/* Full Name */}

        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Full Name <span className="text-red-500">*</span>
          </label>

          <div className="relative">
            <User
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              type="text"
              value={fullName}
              onChange={(e) => onChange("fullName", e.target.value)}
              placeholder="Enter your full name"
              className={`w-full rounded-lg border py-3 pl-10 pr-4 outline-none transition ${
                errors.fullName
                  ? "border-red-500 focus:border-red-500"
                  : "border-gray-300 focus:border-[#173f8a]"
              }`}
            />
          </div>

          {errors.fullName && (
            <p className="mt-1 text-sm text-red-600">
              {errors.fullName}
            </p>
          )}
        </div>

        {/* Email */}

        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Email Address <span className="text-red-500">*</span>
          </label>

          <div className="relative">
            <Mail
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              type="email"
              value={email}
              onChange={(e) => onChange("email", e.target.value)}
              placeholder="Enter your email"
              className={`w-full rounded-lg border py-3 pl-10 pr-4 outline-none transition ${
                errors.email
                  ? "border-red-500 focus:border-red-500"
                  : "border-gray-300 focus:border-[#173f8a]"
              }`}
            />
          </div>

          {errors.email && (
            <p className="mt-1 text-sm text-red-600">
              {errors.email}
            </p>
          )}
        </div>

        {/* Mobile */}

        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Mobile Number <span className="text-red-500">*</span>
          </label>

          <div className="relative">
            <Phone
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              type="tel"
              maxLength={10}
              value={mobile}
              onChange={(e) =>
                onChange(
                  "mobile",
                  e.target.value.replace(/\D/g, "")
                )
              }
              placeholder="Enter mobile number"
              className={`w-full rounded-lg border py-3 pl-10 pr-4 outline-none transition ${
                errors.mobile
                  ? "border-red-500 focus:border-red-500"
                  : "border-gray-300 focus:border-[#173f8a]"
              }`}
            />
          </div>

          {errors.mobile && (
            <p className="mt-1 text-sm text-red-600">
              {errors.mobile}
            </p>
          )}
        </div>

      </div>
    </div>
  );
};

export default GuestDetails;