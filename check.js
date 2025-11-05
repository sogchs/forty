import fetch from "node-fetch";
import nodemailer from "nodemailer";

const URL = "https://belgium.tomorrowland.com/en/welcome/";
const SEARCH_TERM = "2025";

// Email config
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

async function checkSite() {
  const response = await fetch(URL);
  const text = await response.text();

  if (text.includes(SEARCH_TERM)) {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER,
      subject: "🚨 Encontrado '2026' en la web",
      text: `El texto "${SEARCH_TERM}" fue encontrado en ${URL}`,
    });
    console.log("Correo enviado 🚀");
  } else {
    console.log("No encontrado todavía...");
  }
}

checkSite();
