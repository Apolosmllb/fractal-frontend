import dayjs from "dayjs";
import { getFinalPrice } from "./getFinalPrice";

export const createOrderPayload = (order, orderProducts, orderNum) => {
  const currentDate = dayjs();
  return {
    order: {
      ...order,
      createdAT: currentDate.format("YYYY-MM-DD"),
      final_price: getFinalPrice(orderProducts),
      order_num: orderNum,
    },
    orderDetails: [
      ...orderProducts.map((item) => ({
        product_id: item.product_id,
        qty: item.qty,
        total_price: Number(item.total_price),
      })),
    ],
  };
};
