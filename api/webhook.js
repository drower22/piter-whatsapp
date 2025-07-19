// api/webhook.js - Handler compatível com Vercel API Routes
import axios from "axios";

export default async function handler(req, res) {
  if (req.method === "GET") {
    const mode = req.query["hub.mode"];
    const token = req.query["hub.verify_token"];
    const challenge = req.query["hub.challenge"];
    if (mode === "subscribe" && token === process.env.WEBHOOK_VERIFY_TOKEN) {
      res.status(200).send(challenge);
    } else {
      res.status(403).send("Forbidden");
    }
  } else if (req.method === "POST") {
    // Encaminhar para o n8n
    try {
      if (process.env.N8N_WEBHOOK_URL) {
        await axios.post(process.env.N8N_WEBHOOK_URL, req.body, {
          headers: { "Content-Type": "application/json" }
        });
      }
      res.status(200).send("EVENT RECEIVED");
    } catch (err) {
      console.error("Erro ao encaminhar para n8n:", err.message);
      res.status(500).send("Erro ao encaminhar para n8n");
    }
  } else {
    res.status(405).send("Method Not Allowed");
  }
}

