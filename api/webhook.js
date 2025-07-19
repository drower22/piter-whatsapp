// api/webhook.js - Handler compatível com Vercel API Routes
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
    // Log simples para debug
    console.log("[EVENTO] POST /webhook recebido:", JSON.stringify(req.body));
    // Aqui você pode encaminhar para o n8n se quiser
    res.status(200).send("EVENT RECEIVED");
  } else {
    res.status(405).send("Method Not Allowed");
  }
}
