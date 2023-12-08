import React from "react";
import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Modal,
  Select,
  TextField,
} from "@mui/material";

const AddProductModal = ({
  openModal,
  handleCloseModal,
  loadingProducts,
  selectedProduct,
  setSelectedProduct,
  productData,
  quantity,
  setQuantity,
  handleConfirmAndSave,
}) => {
  return (
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
  );
};

export default AddProductModal;
