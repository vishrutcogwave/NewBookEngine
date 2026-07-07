import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getHotelTerms } from "../api/hotel.service";

interface TermsResponse {
  Header: string;
  Particulars: string;
}

export default function TermsConditions() {
  const [terms, setTerms] = useState<TermsResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTerms();
  }, []);

  const loadTerms = async () => {
    try {
      const res = await getHotelTerms(
        "10001",
        "FALC_1001",
        "HMS_1001"
      );

      setTerms(res);
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

  if (!terms) {
    return (
      <div className="flex h-screen items-center justify-center">
        Failed to load terms & conditions.
      </div>
    );
  }

  const lines = terms.Particulars
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
            {terms.Header}
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