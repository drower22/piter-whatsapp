import express from "express";
import axios from "axios";

const app = express();
app.use(express.json());

const { WEBHOOK_VERIFY_TOKEN, GRAPH_API_TOKEN, N8N_WEBHOOK_URL } = process.env;

app.post("/webhook", async (req, res) => {
  // Log ONLY basic info about incoming webhook
  console.log("Incoming webhook message received");

  if (N8N_WEBHOOK_URL) {
    axios({
      method: "post",
      url: N8N_WEBHOOK_URL,
      data: req.body,
      headers: { "Content-Type": "application/json" },
    })
      .then(function (response) {
        console.log("Payload forwarded to n8n successfully.");
      })
      .catch(function (error) {
        // Log the error but don't stop the process
        console.error("Error forwarding to n8n:", error.message);
      });
  } else {
    console.log("N8N_WEBHOOK_URL not set. Skipping forwarding.");
  }

  // Respond to Meta to acknowledge receipt of the webhook
  res.sendStatus(200);
});

app.get("/webhook", (req, res) => {
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if (mode === "subscribe" && token === WEBHOOK_VERIFY_TOKEN) {
    res.status(200).send(challenge);
    console.log("Webhook verified successfully!");
  } else {
    res.sendStatus(403);
  }
});

app.get("/", (req, res) => {
  res.send(`<pre>Nothing to see here.\nCheckout README.md to start.</pre>`);
});

// Export the handler for Vercel
export default app;
