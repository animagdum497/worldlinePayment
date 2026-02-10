import crypto from "crypto";

/**
 * Generates unique merchant transaction ID
 */
export function generateTxnId(prefix = "WL") {
  const now = new Date();

  const timestamp =
    now.getFullYear().toString() +
    String(now.getMonth() + 1).padStart(2, "0") +
    String(now.getDate()).padStart(2, "0") +
    String(now.getHours()).padStart(2, "0") +
    String(now.getMinutes()).padStart(2, "0") +
    String(now.getSeconds()).padStart(2, "0");

  const random = crypto.randomBytes(4).toString("hex");

  return `${prefix}${timestamp}${random}`;
}

/**
 * Generates Worldline HASH token
 * SALT never leaves backend
 */
export function generateWorldlineToken({
  merchantId,
  txnId,
  totalAmount,
  consumerMobileNo = "",
  consumerEmailId = "",
  salt,
  algorithm = "sha256",
}) {
  if (!salt) {
    throw new Error("Worldline SALT missing");
  }

  const hashString = [
    merchantId,
    txnId,
    totalAmount,
    "", // accountNo
    "", // consumerId
    consumerMobileNo,
    consumerEmailId,
    "", // debitStartDate
    "", // debitEndDate
    "", // maxAmount
    "", // amountType
    "", // frequency
    "", // cardNumber
    "", // expMonth
    "", // expYear
    "", // cvvCode
    salt,
  ].join("|");

  return crypto.createHash(algorithm).update(hashString, "utf8").digest("hex");
}
