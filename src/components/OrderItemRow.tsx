import type { JSX } from "react";
import { formatPrice } from "../utils/formatPrice";
import type { OrderItem } from "../models/OrderItem";

interface Props {
  item: OrderItem;
}

export default function OrderItemRow(props: Props): JSX.Element {
  const { name, description, priceCents, currency, quantity } = props.item;

  const formattedPrice = formatPrice(priceCents, currency);

  return (
    <div className="flex justify-between">
      <div className="flex flex-col items-top">
        <p className="text-sm">{name}</p>
        <p className="text-xs text-secondary-text">{description}</p>
      </div>

      <div className="flex flex-col">
        <p className="text-xs text-end font-mono">{formattedPrice}</p>
        <p className="text-xs text-secondary-text text-end font-mono">
          {`x${quantity}`}
        </p>
      </div>
    </div>
  );
}
