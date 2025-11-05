import fetch from "node-fetch";
import nodemailer from "nodemailer";

const URLS = [
  "https://belgium.tomorrowland.com/en/welcome/",
  "https://www.tomorrowland.com/",
];
const SEARCH_TERM = "2026";

async function checkUrl(url) {
  try {
    const response = await fetch(url);
    const html = await response.text();
    return html.includes(SEARCH_TERM);
  } catch (err) {
    console.error(`⚠️ Error al revisar ${url}:`, err.message);
    return false;
  }
}

async function sendEmail(foundUrls) {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const body = `🔍 Se encontró el texto "${SEARCH_TERM}" en las siguientes URLs:\n\n${foundUrls.join("\n")}`;

  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: process.env.EMAIL_TO || process.env.EMAIL_USER,
    subject: "🚨 Tomorrowland 2026 detectado",
    text: body,
  });

  console.log("📧 Correo enviado con éxito.");
}

async function main() {
  const foundUrls = [];

  for (const url of URLS) {
    const found = await checkUrl(url);
    if (found) foundUrls.push(url);
  }

  if (foundUrls.length > 0) {
    await sendEmail(foundUrls);
  } else {
    console.log("❌ No se encontró el texto en ninguna URL.");
  }
}

main();
