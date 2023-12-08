export const getFinalPrice = (productsArr) => {
  let totalPrice = 0;

  productsArr.forEach((product) => {
    totalPrice += Number(product?.detail_unit_price) * Number(product?.qty);
  });

  return totalPrice;
};
