interface HotelDescriptionProps {
  description: string;
}

const HotelDescription = ({
  description,
}: HotelDescriptionProps) => {
  return (
    <section className="mt-6 pb-5">
      <div className="w-full px-5 md:px-10 xl:px-16">
        <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
          <h2 className="mb-3 text-lg font-semibold text-[#0F172A]">
            About the Hotel
          </h2>

          <p className="text-sm leading-7 text-gray-600">
            {description}
          </p>
        </div>
      </div>
    </section>
  );
};

export default HotelDescription;