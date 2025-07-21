import type { JSX } from "react";
import { CheckCircle } from "lucide-react";
import { formatPrice } from "../utils/formatPrice";
import { ProductPackage } from "@/models/ProductPackage";
import { computeTotalAmount } from "@/utils/computeTotalAmount";

interface Props {
  pkg: ProductPackage;
  additionalPhotoNumber: number;
  onAdditionalPhotoNumberUpdate: (newVal: number) => void;
}

export default function PhotoNumberPicker(props: Props): JSX.Element {
  const { pkg, additionalPhotoNumber, onAdditionalPhotoNumberUpdate } = props;

  const additionalPhotoNumberOptions = [0, 3, 8, 18];

  const totalAmount = computeTotalAmount(pkg, additionalPhotoNumber);
  const formattedPrice = formatPrice(totalAmount, pkg.currency);

  const photoNumber = pkg.printedPhotoNumber + additionalPhotoNumber;
  const descriptions = [
    ...pkg.description,
    `${photoNumber} printed photos(pick up)`,
  ];

  return (
    <div className="flex flex-col bg-gray-50 rounded-lg p-6">
      <h3 className="text-gray-900 text-lg font-semibold text-center mb-4">
        Standard
      </h3>
      <div className="flex justify-center items-center gap-4 mb-4">
        <p className="text-gray-900 text-3xl font-bold text-center">
          {formattedPrice}
        </p>
      </div>
      <ul className="space-y-2 mb-6">
        {descriptions.map((it, i) => (
          <li key={`${i}-${it}`} className="flex items-center space-x-2">
            <CheckCircle className="h-4 w-4 text-green-500" />
            <span className="text-sm">{it}</span>
          </li>
        ))}
      </ul>
      <ul className="flex items-center gap-4">
        {additionalPhotoNumberOptions.map((opt) => (
          <button
            key={opt}
            className={`${opt === additionalPhotoNumber ? "bg-blue-600 text-white" : "border-1 border-solid border-gray-200 bg-white bg-gray-50"} rounded-sm min-w-12 px-4 py-2 transition-all duration-300`}
            onClick={() => {
              onAdditionalPhotoNumberUpdate(opt);
            }}
          >
            {`${opt + pkg.printedPhotoNumber}`}
          </button>
        ))}
      </ul>
    </div>
  );
}
