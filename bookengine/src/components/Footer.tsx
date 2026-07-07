import { Link } from "react-router-dom";

interface FooterProps {
  hotelName: string;
}

const Footer = ({ hotelName }: FooterProps) => {
  return (
    <footer className="bg-[#173D8E] h-14 mt-10">
      <div className="w-full h-full px-5 md:px-10 xl:px-16 flex items-center justify-between">
        <p className="text-white font-semibold">
          © {new Date().getFullYear()} {hotelName}
        </p>

        <div className="flex items-center gap-6">
          <Link
            to="/privacy-policy"
            className="text-white font-semibold hover:text-blue-200"
          >
            Privacy Policy
          </Link>

          <Link
            to="/terms-conditions"
            className="text-white font-semibold hover:text-blue-200"
          >
            Terms & Conditions
          </Link>
               <Link
             to="/refund-policy"
            className="text-white font-semibold hover:text-blue-200"
          >
               Refund Policy
          </Link>
               <Link
            to="/contact-us"
            className="text-white font-semibold hover:text-blue-200"
          >
            Contact Us
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;