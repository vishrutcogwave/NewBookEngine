interface HeaderProps {
  hotelName: string;
  supportNumber: string;
}

const Header = ({ hotelName, supportNumber }: HeaderProps) => {
  return (
    <header className="bg-[#173D8E] h-14">
      <div className="w-full px-5 md:px-10 xl:px-16 h-full flex items-center justify-between">
        <h1 className="text-white font-bold text-xl md:text-2xl">
          {hotelName}
        </h1>

        <div className="flex items-center gap-2 text-white text-sm md:text-base">
          <span className="text-blue-100 font-medium">Support:</span>

          <a
            href={`tel:${supportNumber}`}
            className="font-semibold hover:text-blue-200"
          >
            {supportNumber}
          </a>
        </div>
      </div>
    </header>
  );
};

export default Header;