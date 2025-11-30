const functions = require("firebase-functions");
const admin = require("firebase-admin");
const nodemailer = require("nodemailer");
const axios = require("axios");
const Razorpay = require("razorpay");
require("dotenv").config();

if (!admin.apps.length) {
  admin.initializeApp();
}

// --- HELPER TO GET KEYS ---
const getEnv = (key, configGroup, configKey) => {
  if (process.env[key]) return process.env[key];
  if (functions.config()[configGroup] && functions.config()[configGroup][configKey]) {
    return functions.config()[configGroup][configKey];
  }
  return null;
};

// --- CONFIGURATION ---
const GMAIL_USER = getEnv("GMAIL_USER", "email", "user");
const GMAIL_PASS = getEnv("GMAIL_PASS", "email", "pass");
const MSG91_AUTH_KEY = getEnv("MSG91_AUTH_KEY", "msg91", "auth_key");
const MSG91_FLOW_ID = getEnv("MSG91_FLOW_ID", "msg91", "flow_id");
const RAZOR_KEY = getEnv("RAZORPAY_KEY_ID", "razorpay", "key_id");
const RAZOR_SECRET = getEnv("RAZORPAY_KEY_SECRET", "razorpay", "key_secret");
const ADMIN_PHONE = "919876543210"; 

// Initialize Razorpay
const razorpay = new Razorpay({
  key_id: RAZOR_KEY,
  key_secret: RAZOR_SECRET,
});

// Email Transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: { user: GMAIL_USER, pass: GMAIL_PASS },
});

/**
 * 1. Cloud Function: createRazorpayOrder
 */
exports.createRazorpayOrder = functions.https.onCall(async (data, context) => {
  console.log("👉 Payment Request Data:", data); // Check logs for this

  // 1. Validate Keys
  if (!RAZOR_KEY || !RAZOR_SECRET) {
    console.error("ERROR: Razorpay Keys Missing");
    throw new functions.https.HttpsError('internal', 'Server Config Error: Missing Payment Keys');
  }

  // 2. Validate Data Object
  if (!data || !data.amount) {
    console.error("ERROR: Amount is missing in request");
    throw new functions.https.HttpsError('invalid-argument', 'Amount is required');
  }

  // 3. Process Amount (Handle decimals safely)
  // Razorpay expects amount in 'paise' (Integer). 
  // Use Math.round to avoid floating point errors (e.g. 100.50 * 100 = 10050)
  const amountInPaise = Math.round(Number(data.amount) * 100);

  console.log("👉 Processed Amount (Paise):", amountInPaise);

  if (isNaN(amountInPaise) || amountInPaise < 100) {
    throw new functions.https.HttpsError('invalid-argument', 'Amount must be at least INR 1.00');
  }
  
  const options = {
    amount: amountInPaise,
    currency: "INR",
    receipt: `receipt_${Date.now()}`,
    payment_capture: 1 
  };

  try {
    const order = await razorpay.orders.create(options);
    console.log("✅ Order Created:", order.id);
    
    return {
      id: order.id,
      currency: order.currency,
      amount: order.amount,
      key_id: RAZOR_KEY
    };
  } catch (error) {
    console.error("❌ Razorpay API Error:", error);
    throw new functions.https.HttpsError('internal', 'Razorpay API Failed: ' + error.message);
  }
});

/**
 * 2. Cloud Function: sendQuoteNotifications
 * (Your existing notification logic remains here)
 */
exports.sendQuoteNotifications = functions.https.onCall(async (data, context) => {
  const { name, phone, whatsappNumber, from, to, service, carModel, bikeModel, notes } = data;

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
    { headers: { "authkey": MSG91_AUTH_KEY, "Content-Type": "application/json" } }
  );

  try {
    await Promise.all([emailPromise, smsPromise]);
    return { success: true, message: "Notifications sent" };
  } catch (error) {
    console.error("Notification Error:", error);
    return { success: false, error: "Failed to send notifications" };
  }
});