import type { ChangeEventHandler, JSX } from "react";
import type { ProductPackage } from "../models/ProductPackage";
import { CheckCircle } from "lucide-react";
import { formatPrice } from "../utils/formatPrice";
import { computeTotalAndPhotoNumber } from "@/utils/computeTotalAndPhotoNumber";

interface Props {
  pkg: ProductPackage;
  isSelected?: boolean;
  onBuyClick: (pkg: ProductPackage) => void;
  additionalPhotoNumber: number;
  onAdditionalPhotoNumberUpdate: (newVal: number) => void;
}

export default function ProductPackageCell(props: Props): JSX.Element {
  const {
    pkg,
    onBuyClick,
    isSelected,
    additionalPhotoNumber,
    onAdditionalPhotoNumberUpdate,
  } = props;

  const additionalPhotoNumberOptions = Array.from({ length: 19 }, (_, i) => i);

  const { totalAmount, photoNumber } = computeTotalAndPhotoNumber(
    pkg,
    additionalPhotoNumber,
  );
  const formattedPrice = formatPrice(totalAmount, pkg.currency);

  const descriptions = [
    ...pkg.description,
    pkg.printedPhotoNumber === 0
      ? undefined
      : `${photoNumber} printed photos(pick up)`,
  ].filter((it) => it !== undefined);

  const handleSelectChange: ChangeEventHandler<HTMLSelectElement> = (event) => {
    const num = Number(event.target.value);
    onAdditionalPhotoNumberUpdate(num);
  };

  return (
    <li
      className={`${isSelected ? "bg-blue-600 text-white" : "bg-gray-50"} rounded-lg p-6 list-none`}
      onClick={() => onBuyClick(pkg)}
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
        {descriptions.map((it, i) => (
          <li key={`${i}-${it}`} className="flex items-center space-x-2">
            <CheckCircle className="h-4 w-4 text-green-500" />
            <span className="text-sm">{it}</span>
          </li>
        ))}
      </ul>
      {pkg.printedPhotoNumber === 0 ? (
        <></>
      ) : (
        <div className="flex items-center gap-2">
          <p>Number of photos</p>
          <select
            value={additionalPhotoNumber}
            onChange={handleSelectChange}
            className={`${isSelected ? "border-1 border-solid border-white bg-blue-600 text-white" : "border-1 border-solid border-gray-200 bg-white bg-gray-50"} rounded-sm min-w-12 pl-4 pr-2 py-2 transition-all duration-300`}
          >
            {additionalPhotoNumberOptions.map((opt) => (
              <option
                key={opt}
                value={opt}
                className={`${opt === additionalPhotoNumber ? "bg-blue-600 text-white" : "border-1 border-solid border-gray-200 bg-white bg-gray-50"} rounded-sm min-w-12 px-4 py-2 transition-all duration-300`}
              >
                {`${opt + pkg.printedPhotoNumber}`}
              </option>
            ))}
          </select>
        </div>
      )}
    </li>
  );
}
