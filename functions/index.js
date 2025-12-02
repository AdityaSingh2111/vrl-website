const { onCall, HttpsError } = require("firebase-functions/v2/https");
const { setGlobalOptions } = require("firebase-functions/v2");
const admin = require("firebase-admin");
const Razorpay = require("razorpay");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const axios = require("axios");

// CRITICAL: Load the .env file
require("dotenv").config();

// 1. Initialize App
if (!admin.apps.length) {
  admin.initializeApp();
}

// 2. Set Global Options 
// cors: true forces Firebase to handle the headers automatically
setGlobalOptions({ region: "asia-south1", maxInstances: 10 });

// --- HELPER: Lazy Load Razorpay ---
const getRazorpay = () => {
  const key_id = process.env.RAZORPAY_KEY_ID;
  const key_secret = process.env.RAZORPAY_KEY_SECRET;

  if (!key_id || !key_secret) {
    console.error("❌ FATAL: Razorpay keys are missing in Cloud Environment.");
    throw new HttpsError("failed-precondition", "Server misconfiguration: Razorpay keys missing.");
  }

  return new Razorpay({
    key_id: key_id,
    key_secret: key_secret,
  });
};

/**
 * 1. Create Payment Order
 * Explicitly enable CORS
 */
exports.createRazorpayOrder = onCall({ cors: true }, async (request) => {
  const data = request.data; 
  const amount = parseInt(data.amount);
  
  if (!amount || amount < 1) {
    throw new HttpsError("invalid-argument", "Invalid amount");
  }

  try {
    const razorpay = getRazorpay();
    const options = {
      amount: amount * 100, // paise
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);
    
    return {
      id: order.id,
      amount: order.amount,
      currency: order.currency,
      key_id: process.env.RAZORPAY_KEY_ID, 
    };
  } catch (err) {
    console.error("Razorpay Order Error:", err);
    throw new HttpsError("internal", "Order creation failed: " + err.message);
  }
});

/**
 * 2. Verify Payment (Secure)
 */
exports.verifyRazorpayPayment = onCall({ cors: true }, async (request) => {
  const data = request.data;
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = data;

  // Basic Validation
  if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
    throw new HttpsError("invalid-argument", "Missing verification parameters");
  }

  const secret = process.env.RAZORPAY_KEY_SECRET;
  if (!secret) throw new HttpsError("failed-precondition", "Server Key Missing");

  const generated_signature = crypto
    .createHmac("sha256", secret)
    .update(razorpay_order_id + "|" + razorpay_payment_id)
    .digest("hex");

  if (generated_signature === razorpay_signature) {
    await admin.firestore().collection("payments").add({
      orderId: razorpay_order_id,
      paymentId: razorpay_payment_id,
      amount: data.amount,
      status: "success",
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });
    return { status: "success" };
  } else {
    console.error("Signature Verification Failed for:", razorpay_order_id);
    throw new HttpsError("permission-denied", "Invalid signature");
  }
});

/**
 * 3. Send Notifications
 */
exports.sendQuoteNotifications = onCall({ cors: true }, async (request) => {
  const data = request.data || {};
  const { name, phone, whatsappNumber, from, to, service, carModel, bikeModel, notes } = data;
  const { GMAIL_USER, GMAIL_PASS, MSG91_AUTH_KEY, MSG91_FLOW_ID, MSG91_SENDER_ID } = process.env;

  // Email Logic
  const emailPromise = GMAIL_USER ? transporter.sendMail({
    from: `"VRL Website" <${GMAIL_USER}>`,
    to: GMAIL_USER,
    subject: `New Lead: ${name} (${service})`,
    html: `<h3>New Quote</h3><p>${name} - ${phone}</p><p>${from} to ${to}</p>`
  }) : Promise.resolve();

  // SMS Logic
  let smsPromise = Promise.resolve();
  if (MSG91_AUTH_KEY && MSG91_FLOW_ID) {
    smsPromise = axios.post("https://control.msg91.com/api/v5/flow/", {
      template_id: MSG91_FLOW_ID,
      sender: MSG91_SENDER_ID || "VRLLOG",
      short_url: "0",
      mobiles: "919876543210", 
      name: name, service: service, route: `${from} to ${to}`
    }, { headers: { "authkey": MSG91_AUTH_KEY, "Content-Type": "application/json" } });
  }

  try {
    await Promise.all([emailPromise, smsPromise]);
    return { success: true };
  } catch (error) {
    console.error("Notification Error:", error);
    return { success: false };
  }
});