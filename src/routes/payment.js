import express from "express";
import {
  generateTxnId,
  generateWorldlineToken,
} from "../services/worldline.js";

const router = express.Router();

/**
 * Initiate Worldline payment
 */
router.post("/initiate", (req, res) => {
  try {
    const { amount, patientMobile, patientEmail } = req.body;

    const formattedAmount = Number(amount).toFixed(2);

    if (Number(formattedAmount) < 1 || Number(formattedAmount) > 10) {
      return res.status(400).json({
        error: "Test amount must be between ₹1 and ₹10",
      });
    }

    const txnId = generateTxnId();

    const token = generateWorldlineToken({
      merchantId: process.env.WORLDLINE_MERCHANT_ID,
      txnId,
      totalAmount: formattedAmount,
      consumerMobileNo: patientMobile || "",
      consumerEmailId: patientEmail || "",
      salt: process.env.WORLDLINE_SALT,
      algorithm: "sha512", // FORCE SHA512
    });

    res.json({
      txnId,
      token,
      amount: formattedAmount,
    });
  } catch (err) {
    console.error("Worldline initiate error:", err);
    res.status(500).json({ error: "Payment initiation failed" });
  }
});


export default router;
