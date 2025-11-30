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

// --- CONFIGURATION ---
const GMAIL_USER = process.env.GMAIL_USER;
const GMAIL_PASS = process.env.GMAIL_PASS;
const MSG91_AUTH_KEY = process.env.MSG91_AUTH_KEY;
const MSG91_FLOW_ID = process.env.MSG91_FLOW_ID;
const ADMIN_PHONE = process.env.ADMIN_PHONE;

// Initialize Razorpay
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
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
 * 2. Cloud Function: createRazorpayOrder
 * Generates a secure order ID for payments
 */
exports.createRazorpayOrder = functions.https.onCall(async (data, context) => {
  const amount = parseInt(data.amount) * 100; // Convert Rupee to Paise
  
  const options = {
    amount: amount,
    currency: "INR",
    receipt: `receipt_${Date.now()}`,
    payment_capture: 1 // Auto capture
  };

  try {
    const order = await razorpay.orders.create(options);
    return {
      id: order.id,
      currency: order.currency,
      amount: order.amount
    };
  } catch (error) {
    console.error("Razorpay Error:", error);
    throw new functions.https.HttpsError('internal', 'Unable to create order');
  }
});