import type { JSX } from "react";
import type { ProductPackage } from "../models/ProductPackage";
import { CheckCircle } from "lucide-react";
import { formatPrice } from "../utils/formatPrice";

interface Props {
  pkg: ProductPackage;
  onBuyClick: (pkg: ProductPackage) => void;
  isSelected?: boolean;
}

export default function ProductPackageCard(props: Props): JSX.Element {
  const { pkg, onBuyClick, isSelected } = props;

  const formattedPrice = formatPrice(pkg.priceCents, pkg.currency);

  return (
    <div
      className={`${isSelected ? "bg-blue-600 text-white" : "bg-white"} rounded-xl shadow-lg p-8 relative flex flex-col justify-between`}
    >
      {pkg.isPopular ? (
        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-yellow-400 text-blue-900 px-4 py-1 rounded-full text-sm font-bold">
          MOST POPULAR
        </div>
      ) : (
        ""
      )}

      <div className="flex flex-col">
        <h3
          className={`text-xl font-semibold mb-4 ${isSelected ? "text-white" : "text-gray-900"}`}
        >
          {pkg.name} Package
        </h3>
        <div
          className={`text-3xl font-bold mb-4 ${isSelected ? "text-white" : "text-gray-900"}`}
        >
          {formattedPrice}
        </div>
        <ul className="space-y-3 mb-8">
          {pkg.description.map((it, i) => (
            <li key={`${i}-${it}`} className="flex items-center space-x-2">
              <CheckCircle
                className={`h-5 w-5 ${isSelected ? "text-blue-200" : "text-green-500"}`}
              />
              <span>{it}</span>
            </li>
          ))}
        </ul>
      </div>

      <button
        className={`${isSelected ? "bg-white text-blue-600 hover:bg-gray-100" : "border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white"} w-full border-2  py-3 rounded-lg font-semibold transition-colors`}
        onClick={() => onBuyClick(pkg)}
      >
        Choose {pkg.name}
      </button>
    </div>
  );
}
