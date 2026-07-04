interface HotelDescriptionProps {
  description: string;
}

const HotelDescription = ({
  description,
}: HotelDescriptionProps) => {
  return (
    <section className="pb-8">
      <div className="w-full px-5 md:px-10 xl:px-16">
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <p className="text-[15px] leading-8 text-gray-600">
            {description}
          </p>
        </div>
      </div>
    </section>
  );
};

export default HotelDescription;