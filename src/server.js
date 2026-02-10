import express from "express";
import dotenv from "dotenv";
import paymentRoutes from "./routes/payment.js";

dotenv.config();

const app = express();

app.use(express.json());

app.use("/payment", paymentRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
