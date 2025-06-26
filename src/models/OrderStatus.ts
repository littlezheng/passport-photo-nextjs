export const validOrderStatus = [
  "ORDER_NOT_EXIST",
  "ORDER_PROCESSING",
  "ORDER_EFFECTIVELY",
  "ORDER_EXPIRED",
];

export type OrderStatus = (typeof validOrderStatus)[number];

export function orderStatusFromString(value: string): OrderStatus | undefined {
  if (validOrderStatus.includes(value as OrderStatus)) {
    return value as OrderStatus;
  }
  return undefined;
}

export function getOrderStatusLabel(status: OrderStatus): string {
  const map: Record<OrderStatus, string> = {
    ORDER_NOT_EXIST: "Unpaid",
    ORDER_PROCESSING: "Processing",
    ORDER_EFFECTIVELY: "Effectively",
    ORDER_EXPIRED: "Payment failed",
  };

  return map[status];
}

export const getOrderStatusColor = (status: OrderStatus): string => {
  const map: Record<OrderStatus, string> = {
    ORDER_NOT_EXIST: "#656973",
    ORDER_PROCESSING: "#ecaf28",
    ORDER_EFFECTIVELY: "#058b00",
    ORDER_EXPIRED: "bf5721",
  };

  return map[status];
};
