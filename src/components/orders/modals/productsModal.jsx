import React from "react";
import {
  Button,
  Modal,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";

const ProductsModal = ({
  openModalProduct,
  handleCloseModalProducts,
  orderProducts,
  handleDeleteProduct,
}) => {
  return (
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
            {orderProducts.map((product) => (
              <TableRow key={crypto.randomUUID()}>
                <TableCell component="th" scope="row">
                  {product.product_name}
                </TableCell>
                <TableCell align="right">{product.detail_unit_price}</TableCell>
                <TableCell align="right">{product.qty}</TableCell>
                <TableCell align="right">{product.total_price}</TableCell>
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
  );
};

export default ProductsModal;
