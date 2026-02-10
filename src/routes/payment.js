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

    const amt = Number(amount);

    if (isNaN(amt) || amt < 1 || amt > 10) {
      return res.status(400).json({
        error: "Test amount must be between ₹1 and ₹10",
      });
    }

    const txnId = generateTxnId();

    const token = generateWorldlineToken({
      merchantId: process.env.WORLDLINE_MERCHANT_ID,
      txnId,
      totalAmount: amount,
      consumerMobileNo: patientMobile,
      consumerEmailId: patientEmail,
      salt: process.env.WORLDLINE_SALT,
      algorithm: process.env.HASH_ALGORITHM,
    });

    res.json({
      txnId,
      token,
      amount,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Payment initiation failed" });
  }
});

export default router;
