import { Box, Button, IconButton, TextField } from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useProducts } from "../../hooks/useProducts";
import { useOrderDetails } from "../../hooks/userOrderDetails";
import RemoveRedEyeOutlinedIcon from "@mui/icons-material/RemoveRedEyeOutlined";
import dayjs from "dayjs";
import ProductsModal from "./modals/productsModal";
import AddProductModal from "./modals/addProductModal";
import { getFinalPrice } from "../../utils/getFinalPrice";

export default function AddEditOrder() {
  const { id } = useParams();
  const navigate = useNavigate();
  //fetching data
  const { data: productData, isLoading: loadingProducts } = useProducts();
  const { data: order, isLoading, editOrder, addOrder } = useOrderDetails(id);

  //form data
  const [orderProducts, setOrderProducts] = useState([]);
  const [quantity, setQuantity] = useState(0);
  const [finalPrice, setFinalPrice] = useState("");
  const [orderNum, setOrderNum] = useState("");

  //modal
  const [openModal, setOpenModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState("");
  const [openModalProduct, setOpenModalProduct] = useState(false);

  useEffect(() => {
    if (order) {
      const price = getFinalPrice(order.order_details);
      setOrderProducts(order.order_details?.map((item) => item));
      setOrderNum(order.order_num);
      setFinalPrice(price);
    }
  }, [order]);

  useEffect(() => {
    if ((orderProducts && selectedProduct, quantity)) {
      const price = getFinalPrice(orderProducts);
      setFinalPrice(price);
    }
  }, [order, selectedProduct, quantity]);

  const handleOpenModal = () => {
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedProduct("");
    setQuantity("");
  };

  const handleConfirmAndSave = () => {
    if (selectedProduct && quantity) {
      const productPrice =
        Number(selectedProduct.unit_price) * Number(quantity);

      setFinalPrice((prevPrice) => prevPrice + productPrice);

      const newProduct = {
        detail_unit_price: selectedProduct.unit_price,
        product_id: selectedProduct.id,
        product_name: selectedProduct.name,
        product_unit_price: selectedProduct.unit_price,
        qty: Number(quantity),
        total_price: productPrice,
      };

      setOrderProducts([...orderProducts, newProduct]);
      handleCloseModal();
    }
  };

  const handleSaveOrder = async () => {
    if (id) {
      await editOrder(order, orderProducts, orderNum, id);
    } else {
      await addOrder(order, orderProducts, orderNum);
    }
    navigate("/my-orders");
  };

  const handleOpenModalProducts = () => {
    setOpenModalProduct(true);
  };

  const handleCloseModalProducts = () => {
    setOpenModalProduct(false);
  };

  const handleDeleteProduct = (id) => {
    const newProducts = orderProducts.filter(
      (product) => product.product_id !== id
    );
    const newFinalPrice = getFinalPrice(newProducts);

    setOrderProducts(newProducts);
    setFinalPrice(newFinalPrice);
  };

  return (
    <>
      {id ? <h2>Edit order</h2> : <h2>Add order</h2>}
      <form>
        <TextField
          label="Order Number"
          value={orderNum}
          onChange={(e) => setOrderNum(e.target.value)}
          fullWidth
          margin="normal"
          variant="outlined"
        />
        <TextField
          label="Date"
          value={
            dayjs(order?.createdAt).format("YYYY-MM-DD") ||
            dayjs().format("YYYY-MM-DD")
          }
          fullWidth
          margin="normal"
          variant="outlined"
          disabled
        />

        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mt: 2,
          }}
        >
          <TextField
            fullWidth
            disabled
            value={[...orderProducts]?.map((item) => item.product_name).join(", ")}
          ></TextField>
          <IconButton onClick={() => handleOpenModalProducts()}>
            <RemoveRedEyeOutlinedIcon></RemoveRedEyeOutlinedIcon>
          </IconButton>
          <Button
            variant="contained"
            color="primary"
            onClick={handleOpenModal}
            sx={{
              marginLeft: "1rem",
            }}
          >
            Add Product
          </Button>
        </Box>

        <TextField
          type="number"
          fullWidth
          margin="normal"
          variant="outlined"
          value={finalPrice}
          disabled
        />
        <Button variant="contained" color="primary" onClick={handleSaveOrder}>
          Save Order
        </Button>
      </form>
      <AddProductModal
        openModal={openModal}
        handleCloseModal={handleCloseModal}
        loadingProducts={loadingProducts}
        selectedProduct={selectedProduct}
        setSelectedProduct={setSelectedProduct}
        productData={productData}
        quantity={quantity}
        setQuantity={setQuantity}
        handleConfirmAndSave={handleConfirmAndSave}
      />
      <ProductsModal
        openModalProduct={openModalProduct}
        handleCloseModalProducts={handleCloseModalProducts}
        orderProducts={orderProducts}
        handleDeleteProduct={handleDeleteProduct}
      />
    </>
  );
}
