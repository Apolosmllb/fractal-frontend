import "./App.css";
import { Navigate, Route, Routes } from "react-router-dom";
import Orders from "./components/orders/orders";

import Products from "./components/products/products";
import AddEditOrder from "./components/orders/addEditOrder";

function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Navigate to="/my-orders" />} />
        <Route path="/my-orders" element={<Orders />} />
        <Route path="/add-order/:id?" element={<AddEditOrder />} />
        <Route path="/products" element={<Products />} />
      </Routes>
    </div>
  );
}

export default App;
