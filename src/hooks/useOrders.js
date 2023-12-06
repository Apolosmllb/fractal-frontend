import { useState, useEffect } from "react";

export const useOrders = () => {
  const [result, setResult] = useState({
    data: null,
    error: null,
    isLoading: false,
  });

  const fetchData = async (url, options) => {
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

  useEffect(() => {
    fetchData("http://localhost:5800/api/v1/orders");
  }, []);

  return result;
};
