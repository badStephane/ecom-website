import { assets } from "../assets/assets";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-200 mt-auto">
      <div className="px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw]">
        <div className="flex flex-col sm:grid grid-cols-[3fr_1fr_1fr] gap-14 py-10 text-sm">
          <div>
            <img src={assets.logo} alt="logo" className="mb-5 w-32" />
            <p className="w-full md:w-2/3 text-gray-600">
            Livewear, une marque artisanale qui allie élégance, confort et durabilité grâce à des vêtements faits main en matières naturelles.
            </p>
          </div>

          <div>
            <p className="text-xl font-medium mb-5">MENU</p>
            <ul className="flex flex-col gap-1 text-gray-600">
              <li><Link to="/">Home</Link></li>
              <li><Link to="/about">A Propos</Link></li>
              <li><Link to="/collection">Collection</Link></li>
            </ul>
          </div>

          <div>
            <p className="text-xl font-medium mb-5">CONTACT</p>
            <ul className="flex flex-col gap-1 text-gray-600">
              <li>+221 773548342</li>
              <li>stephane.badiane.dev@gmail.com</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-200">
          <p className="py-5 text-sm text-center">Copyright {new Date().getFullYear()} - All Right Reserved Made with <span className="text-red-500">❤</span> by <a href="https://stephane-badiane.vercel.app/">Stephane Badiane</a></p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
