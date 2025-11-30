const functions = require("firebase-functions");
const admin = require("firebase-admin");
const nodemailer = require("nodemailer");
const axios = require("axios");
const Razorpay = require("razorpay");
const cors = require("cors")({ origin: true });
require("dotenv").config();

if (!admin.apps.length) {
  admin.initializeApp();
}

// --- HELPER TO GET KEYS (Supports both .env and Firebase Config) ---
const getEnv = (key, configGroup, configKey) => {
  // 1. Try process.env (Local .env file)
  if (process.env[key]) return process.env[key];
  // 2. Try functions.config() (Production Firebase Config)
  if (functions.config()[configGroup] && functions.config()[configGroup][configKey]) {
    return functions.config()[configGroup][configKey];
  }
  return null; // Return null if missing
};

// --- CONFIGURATION ---
const GMAIL_USER = process.env.GMAIL_USER;
const GMAIL_PASS = process.env.GMAIL_PASS;
const MSG91_AUTH_KEY = process.env.MSG91_AUTH_KEY;
const MSG91_FLOW_ID = process.env.MSG91_FLOW_ID;
const RAZOR_KEY = getEnv("RAZORPAY_KEY_ID", "razorpay", "key_id");
const RAZOR_SECRET = getEnv("RAZORPAY_KEY_SECRET", "razorpay", "key_secret");
const ADMIN_PHONE = process.env.ADMIN_PHONE;

// Initialize Razorpay
const razorpay = new Razorpay({
  key_id: RAZOR_KEY,
  key_secret: RAZOR_SECRET,
});

// Email Transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: GMAIL_USER,
    pass: GMAIL_PASS,
  },
});

/**
 * 1. Cloud Function: sendQuoteNotifications
 * Triggers Email + MSG91 SMS for new leads
 */
exports.sendQuoteNotifications = functions.https.onCall(async (data, context) => {
  const { name, phone, whatsappNumber, from, to, service, carModel, bikeModel, notes } = data;

  // Email Logic
  const emailPromise = transporter.sendMail({
    from: `"VRL Website" <${GMAIL_USER}>`,
    to: GMAIL_USER,
    subject: `New Lead: ${name} (${service})`,
    html: `
      <h3>New Quote Request</h3>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Phone:</strong> ${phone}</p>
      <p><strong>WhatsApp:</strong> ${whatsappNumber}</p>
      <hr/>
      <p><strong>Route:</strong> ${from} ➝ ${to}</p>
      <p><strong>Service:</strong> ${service}</p>
      ${carModel ? `<p><strong>Car:</strong> ${carModel}</p>` : ""}
      ${bikeModel ? `<p><strong>Bike:</strong> ${bikeModel}</p>` : ""}
      <p><strong>Notes:</strong> ${notes}</p>
    `,
  });

  // SMS Logic (Msg91)
  const msg91Payload = {
    template_id: MSG91_FLOW_ID,
    sender: process.env.MSG91_SENDER_ID || "VRLLOG",
    short_url: "0",
    mobiles: ADMIN_PHONE,
    name: name,
    service: service,
    route: `${from} to ${to}`
  };

  const smsPromise = axios.post(
    "https://control.msg91.com/api/v5/flow/",
    msg91Payload,
    {
      headers: {
        "authkey": MSG91_AUTH_KEY,
        "Content-Type": "application/json",
      },
    }
  );

  try {
    await Promise.all([emailPromise, smsPromise]);
    return { success: true, message: "Notifications sent" };
  } catch (error) {
    console.error("Notification Error:", error);
    return { success: false, error: "Failed to send notifications" };
  }
});

/**
 * Cloud Function: createRazorpayOrder
 */
exports.createRazorpayOrder = functions.https.onCall(async (data) => {

  console.log("👉 DATA RECEIVED:", data);
  console.log("👉 KEY ID EXISTS:", !!RAZOR_KEY);
  console.log("👉 SECRET EXISTS:", !!RAZOR_SECRET);

  if (!RAZOR_KEY || !RAZOR_SECRET) {
    throw new functions.https.HttpsError(
      "internal",
      "Razorpay credentials missing"
    );
  }

  const rawAmount = Number(data.amount);
  console.log("👉 RAW AMOUNT:", rawAmount);

  if (!rawAmount || rawAmount <= 0) {
    throw new functions.https.HttpsError(
      "invalid-argument",
      "Invalid amount sent"
    );
  }

  try {

    const order = await razorpay.orders.create({
      amount: Math.round(rawAmount * 100),
      currency: "INR",
      receipt: "order_" + Date.now(),
    });

    console.log("✅ ORDER CREATED:", order.id);

    return {
      id: order.id,
      amount: order.amount,
      currency: order.currency,
      key_id: RAZOR_KEY,
    };

  } catch (e) {
    console.error("❌ RAZORPAY FAIL:", e);
    throw new functions.https.HttpsError("internal", e.message);
  }

});

