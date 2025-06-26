import type { JSX } from "react";
import {
  getOrderStatusLabel,
  getOrderStatusColor,
  type OrderStatus,
} from "../models/OrderStatus";

interface Props {
  status: OrderStatus;
}

export default function OrderStatusTag(props: Props): JSX.Element {
  const { status } = props;

  const color = getOrderStatusColor(status);
  const label = getOrderStatusLabel(status);

  return (
    <div
      className="px-2 py-1 rounded-full"
      style={{ backgroundColor: `${color}22` }}
    >
      <p className="text-xs font-medium" style={{ color }}>
        {label}
      </p>
    </div>
  );
}
