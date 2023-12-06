import {
  Box,
  Button,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Modal,
  Paper,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useProducts } from "../../hooks/useProducts";
import { useOrderDetails } from "../../hooks/userOrderDetails";
import RemoveRedEyeOutlinedIcon from "@mui/icons-material/RemoveRedEyeOutlined";
import dayjs from "dayjs";

export default function AddEditOrder() {
  const { id } = useParams();
  const navigate = useNavigate();
  //fetching data
  const { data: productData, isLoading: loadingProducts } = useProducts();
  const { data: orderDetailsData, isLoading } = useOrderDetails(id);

  //form
  const storedOrder = localStorage.getItem(`order-${id}`);
  const initialFormState = storedOrder ? JSON.parse(storedOrder) : {};
  const [form, setForm] = useState(initialFormState);

  const [productsForm, setProductsForm] = useState([]);

  const [quantity, setQuantity] = useState(0);
  const [finalPrice, setFinalPrice] = useState("");
  const [orderNum, setOrderNum] = useState(initialFormState.order_num ?? "");

  //modal
  const [openModal, setOpenModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState("");
  const [openModalProduct, setOpenModalProduct] = useState(false);

  useEffect(() => {
    if (orderDetailsData) {
      const price = getFinalPrice(orderDetailsData.products);
      setProductsForm(orderDetailsData.products?.map((item) => item));
      setFinalPrice(price);
    }
  }, [orderDetailsData]);

  useEffect(() => {
    if ((productsForm && selectedProduct, quantity)) {
      const price = getFinalPrice(productsForm);
      setFinalPrice(price);
    }
  }, [orderDetailsData, selectedProduct, quantity]);

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
        name: selectedProduct.name,
        unit_price: selectedProduct.unit_price,
        product_id: selectedProduct.id,
        qty: quantity,
        product_total: productPrice.toFixed(2),
        order_detail_total: productPrice,
      };

      setProductsForm([...productsForm, newProduct]);
      handleCloseModal();
    }
  };

  const handleSaveOrder = async () => {
    if (id) {
      await editOrder();
    } else {
      await addOrder();
    }
    navigate("/my-orders");
  };

  const addOrder = async () => {
    try {
      const productsMap = [...productsForm].map((item) => ({
        product_id: item.product_id,
        total_price: Number(item.order_detail_total),
      }));

      let finalOrderPrice = 0;
      productsMap.forEach(
        (item) => (finalOrderPrice += Number(item.total_price))
      );
      const currentDate = dayjs();
      const payload = {
        order: {
          ...form,
          createdAT: currentDate.format("YYYY-MM-DD"),
          final_price: finalOrderPrice,
          order_num: orderNum,
        },
        orderDetails: [
          ...productsForm.map((item) => ({
            product_id: item.product_id,
            total_price: Number(item.order_detail_total),
          })),
        ],
      };

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

  const handleOpenModalProducts = () => {
    setOpenModalProduct(true);
  };

  const handleCloseModalProducts = () => {
    setOpenModalProduct(false);
  };

  const editOrder = async () => {
    try {
      const productsMap = [...productsForm].map((item) => ({
        product_id: item.product_id,
        total_price: Number(item.order_detail_total),
      }));

      let finalOrderPrice = 0;
      productsMap.forEach(
        (item) => (finalOrderPrice += Number(item.total_price))
      );
      const currentDate = dayjs();
      const payload = {
        order: {
          ...form,
          createdAT: currentDate.format("YYYY-MM-DD"),
          final_price: finalOrderPrice,
          order_num: orderNum,
        },
        orderDetails: [
          ...productsForm.map((item) => ({
            product_id: item.product_id,
            total_price: Number(item.order_detail_total),
          })),
        ],
      };

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

  const handleDeleteProduct = (id) => {
    const newProducts = productsForm.filter(
      (product) => product.product_id !== id
    );
    const newFinalPrice = getFinalPrice(newProducts);

    setProductsForm(newProducts);
    setFinalPrice(newFinalPrice);
  };

  const getFinalPrice = (productArr) => {
    let totalPrice = 0;

    productArr.forEach((product) => {
      totalPrice += Number(product?.order_detail_total);
    });

    return totalPrice;
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
            dayjs(form?.createdAt).format("YYYY-MM-DD") ||
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
            value={[...productsForm]?.map((item) => item.name).join(", ")}
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

      <Modal open={openModal} onClose={handleCloseModal}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
          }}
        >
          <h2>Add New Product</h2>
          <FormControl
            fullWidth
            margin="normal"
            variant="outlined"
            sx={{ mt: 2 }}
          >
            <InputLabel>Select Product</InputLabel>
            {loadingProducts ? (
              <p>Loading...</p>
            ) : (
              <Select
                value={selectedProduct || ""}
                onChange={(e) => setSelectedProduct(e.target.value)}
                renderValue={(selected) => selected?.name || ""}
              >
                {productData?.map((product) => (
                  <MenuItem key={product.id} value={product}>
                    {product.name}
                  </MenuItem>
                ))}
              </Select>
            )}
          </FormControl>
          <TextField
            label="Quantity"
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            fullWidth
            margin="normal"
            variant="outlined"
            sx={{ mt: 2 }}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={handleConfirmAndSave}
            sx={{ mt: 2 }}
          >
            Confirm and Save
          </Button>
        </Box>
      </Modal>

      <Modal open={openModalProduct} onClose={handleCloseModalProducts}>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Product Name</TableCell>
                <TableCell align="right">Unit Price</TableCell>
                <TableCell align="right">Qty</TableCell>
                <TableCell align="right">Total Price</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {productsForm.map((product) => (
                <TableRow key={crypto.randomUUID()}>
                  <TableCell component="th" scope="row">
                    {product.name}
                  </TableCell>
                  <TableCell align="right">{product.unit_price}</TableCell>
                  <TableCell align="right">{product.qty}</TableCell>
                  <TableCell align="right">
                    {product.order_detail_total}
                  </TableCell>
                  <TableCell align="right">
                    <Button
                      onClick={() => handleDeleteProduct(product.product_id)}
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Modal>
    </>
  );
}
