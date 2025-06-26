import type { JSX } from "react";
import type { ProductPackage } from "../models/ProductPackage";
import { CheckCircle, CreditCard } from "lucide-react";
import { formatPrice } from "../utils/formatPrice";

interface Props {
  pkg: ProductPackage;
  isSelected?: boolean;
  onBuyClick: (pkg: ProductPackage) => void;
}

export default function ProductPackageCell(props: Props): JSX.Element {
  const { pkg, onBuyClick, isSelected } = props;

  const formattedPrice = formatPrice(pkg.priceCents, pkg.currency);

  return (
    <div
      className={`${isSelected ? "bg-blue-600 text-white" : "bg-gray-50"} rounded-lg p-6`}
    >
      {pkg.isPopular ? (
        <div className="text-center mb-2">
          <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-bold">
            POPULAR
          </span>
        </div>
      ) : (
        ""
      )}
      <h3
        className={`${isSelected ? "text-white" : "text-gray-900"} text-lg font-semibold mb-4`}
      >
        {pkg.name}
      </h3>
      <div
        className={`${isSelected ? "text-white" : "text-gray-900"} text-3xl font-bold mb-4`}
      >
        {formattedPrice}
      </div>
      <ul className="space-y-2 mb-6">
        {pkg.description.map((it, i) => (
          <li key={`${i}-${it}`} className="flex items-center space-x-2">
            <CheckCircle className="h-4 w-4 text-green-500" />
            <span className="text-sm">{it}</span>
          </li>
        ))}
      </ul>
      <button
        onClick={() => onBuyClick(pkg)}
        className={`${isSelected ? "bg-white text-blue-600 hover:bg-gray-100" : "bg-blue-600 text-white hover:bg-blue-700"} w-full py-2 rounded-lg font-semibold transition-colors flex items-center justify-center space-x-2`}
      >
        <CreditCard className="h-4 w-4" />
        <span>Buy {pkg.name}</span>
      </button>
    </div>
  );
}
