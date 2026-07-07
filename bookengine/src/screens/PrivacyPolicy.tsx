import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getHotelPolicy } from "../api/hotel.service";

interface PolicyResponse {
  Header: string;
  Particulars: string;
}

export default function PrivacyPolicy() {
  const [policy, setPolicy] = useState<PolicyResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPolicy();
  }, []);

  const loadPolicy = async () => {
    try {
      const res = await getHotelPolicy(
        "10001",
        "FALC_1001",
        "HMS_1001"
      );

      setPolicy(res);
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

  if (!policy) {
    return (
      <div className="flex h-screen items-center justify-center">
        Failed to load policy.
      </div>
    );
  }

  const lines = policy.Particulars
    .replace(/\r/g, "")
    .split("\n")
    .filter((x) => x.trim() !== "");

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="mx-auto max-w-5xl p-6">
        <Link
          to="/"
          className="text-blue-600 hover:underline"
        >
          ← Back
        </Link>

        <div className="mt-4 rounded-xl bg-white p-8 shadow">
          <h1 className="mb-6 text-3xl font-bold text-[#163A84]">
            {policy.Header}
          </h1>

          <div className="space-y-3">
            {lines.map((line, index) => (
              <div
                key={index}
                className={`${
                  /^\d+\./.test(line.trim())
                    ? "mt-6 text-xl font-semibold text-[#163A84]"
                    : "text-gray-700"
                }`}
              >
                {line}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}