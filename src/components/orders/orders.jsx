import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { useOrders } from "../../hooks/useOrders";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import AddCircleOutlineRoundedIcon from "@mui/icons-material/AddCircleOutlineRounded";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  Box,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from "@mui/material";
import dayjs from "dayjs";

export default function Orders() {
  const { isLoading, data, error } = useOrders();
  const [orders, setOrders] = useState([]);
  const [open, setOpen] = useState(false);
  const [orderIdToRemove, setOrderIdToRemove] = useState(null);

  useEffect(() => {
    if (data) setOrders(data);
  }, [data]);

  const navigate = useNavigate();

  const handleButtonClick = (order) => {
    if (!order?.order_id) {
      navigate("/add-order");
    } else {
      localStorage.setItem(`order-${order.order_id}`, JSON.stringify(order));
      navigate(`/add-order/${order.order_id}`);
    }
  };

  const handleOpen = (id) => {
    setOpen(true);
    setOrderIdToRemove(id);
  };

  const handleClose = () => {
    setOpen(false);
    setOrderIdToRemove(null);
  };

  const handleRemove = async () => {
    try {
      await fetch(`http://localhost:5800/api/v1/orders/${orderIdToRemove}`, {
        method: "DELETE",
      });
      setOrders((prevOrders) =>
        prevOrders.filter((order) => order.order_id !== orderIdToRemove)
      );
    } catch (error) {
      console.log(error);
    }
    handleClose();
  };

  const createHandleRemove = (orderId) => () => {
    handleOpen(orderId);
  };

  return (
    <>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
        }}
      >
        <h3>My Orders</h3>
        <IconButton onClick={() => handleButtonClick()}>
          <AddCircleOutlineRoundedIcon></AddCircleOutlineRoundedIcon>
        </IconButton>
      </Box>
      {isLoading || orders === null ? (
        <p>Loading...</p>
      ) : (
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell align="right">Order #</TableCell>
                <TableCell align="right">date</TableCell>
                <TableCell align="right"># Products</TableCell>
                <TableCell align="right">Status</TableCell>
                <TableCell align="right">Final price</TableCell>
                <TableCell align="right">Options</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {orders?.map((row) => (
                <TableRow
                  key={row.order_id}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell component="th" scope="row">
                    {row.order_id}
                  </TableCell>
                  <TableCell component="th" scope="row">
                    {row.order_num}
                  </TableCell>
                  <TableCell component="th" scope="row">
                    {dayjs(row.createdAT).format("YYYY-MM-DD")}
                  </TableCell>
                  <TableCell align="right">{row.numProds}</TableCell>
                  <TableCell align="right">{row.status}</TableCell>
                  <TableCell align="right">{row.final_price}</TableCell>
                  <TableCell align="right">
                    <IconButton onClick={() => handleButtonClick(row)}>
                      <EditIcon fontSize="inherit"></EditIcon>
                    </IconButton>
                    <IconButton onClick={createHandleRemove(row.order_id)}>
                      <DeleteIcon fontSize="inherit"></DeleteIcon>
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{"Confirm Delete"}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this order?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>No</Button>
          <Button onClick={handleRemove} autoFocus>
            Yes
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
