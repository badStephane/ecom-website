import { assets } from "../assets/assets";

const OurPolicy = () => {
  return (
    <div className="flex flex-col sm:flex-row justify-around gap-12 sm:gap-2 text-center py-20 text-xs sm:text-sm md:text-base text-gray-700">

      <div>
        <img
          src={assets.exchange_icon}
          alt="icon"
          className="w-12 m-auto mb-5"
        />
        <p className="font-semibold">Politique d&apos;échange facile</p>
        <p className="text-gray-400">Nous offrons une politique d&apos;échange facile</p>
      </div>

      <div>
        <img
          src={assets.quality_icon}
          alt="icon"
          className="w-12 m-auto mb-5"
        />
        <p className="font-semibold">Politique de retour sur 7 jours</p>
        <p className="text-gray-400">Nous offrons une politique de retour sur 7 jours</p>
      </div>


      <div>
        <img
          src={assets.support_img}
          alt="icon"
          className="w-12 m-auto mb-5"
        />
        <p className="font-semibold">Meilleure assistance client</p>
        <p className="text-gray-400">Nous offrons une assistance client 24/7</p>
      </div>

    </div>
  );
};

export default OurPolicy;
