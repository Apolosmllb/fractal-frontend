import { useEffect, useState } from "react";
import { createOrderPayload } from "../utils/createOrderPayload";

export const useOrderDetails = (orderId) => {
  const [result, setResult] = useState({
    data: null,
    error: null,
    isLoading: false,
  });

  const fetchData = async (url, options) => {
    if (!orderId) return result;
    setResult((prevResult) => ({ ...prevResult, isLoading: true }));
    try {
      const res = await fetch(url, options);
      const data = await res.json();
      setResult((prevResult) => ({
        ...prevResult,
        data: data?.data,
        isLoading: false,
      }));
    } catch (err) {
      let errMessage = err.message ?? "Something went wrong";
      setResult((prevResult) => ({
        ...prevResult,
        error: errMessage,
        isLoading: false,
      }));
    }
  };

  const editOrder = async (order, orderProducts, orderNum, id) => {
    try {
      const payload = createOrderPayload(order, orderProducts, orderNum);

      await fetch(`http://localhost:5800/api/v1/orders/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
    } catch (error) {
      console.log(error);
    }
  };

  const addOrder = async (order, orderProducts, orderNum) => {
    try {
      const payload = createOrderPayload(order, orderProducts, orderNum);

      await fetch(`http://localhost:5800/api/v1/orders/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchData(`http://localhost:5800/api/v1/orders/details/${orderId}`);
  }, []);

  return { ...result, addOrder, editOrder };
};
