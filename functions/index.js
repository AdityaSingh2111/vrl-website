const functions = require("firebase-functions");
const admin = require("firebase-admin");
const nodemailer = require("nodemailer");
const axios = require("axios");
const cors = require("cors")({ origin: true });
require("dotenv").config();

admin.initializeApp();

// Configuration
const GMAIL_USER = process.env.GMAIL_USER;
const GMAIL_PASS = process.env.GMAIL_PASS;
const MSG91_AUTH_KEY = process.env.MSG91_AUTH_KEY;
const MSG91_FLOW_ID = process.env.MSG91_FLOW_ID; // Your Msg91 Template ID
const ADMIN_PHONE = process.env.ADMIN_PHONE;

// Email Transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: GMAIL_USER,
    pass: GMAIL_PASS,
  },
});

/**
 * Cloud Function: sendQuoteNotifications
 * Triggers Email + MSG91 SMS
 */
exports.sendQuoteNotifications = functions.https.onCall(async (data, context) => {
  const { name, phone, whatsappNumber, from, to, service, carModel, bikeModel, notes } = data;

  // 1. Send Email to Company
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

  // 2. Send SMS via MSG91 (Using Flow API v5)
  // Payload structure depends on your Msg91 Flow variables
  const msg91Payload = {
    template_id: MSG91_FLOW_ID,
    sender: process.env.MSG91_SENDER_ID || "VRLLOG",
    short_url: "0",
    mobiles: ADMIN_PHONE,
    // Map your Flow variables here (e.g., ##name##, ##service##)
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
    console.error("Notification Error:", error.response?.data || error.message);
    // Return success: false but don't crash client if only notification fails
    return { success: false, error: "Failed to send notifications" };
  }
});