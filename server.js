/*
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import express from "express";
import axios from "axios";

const app = express();
app.use(express.json());

// Import environment variables
const { WEBHOOK_VERIFY_TOKEN, GRAPH_API_TOKEN, PORT, N8N_WEBHOOK_URL } = process.env;

app.post("/webhook", async (req, res) => {
  // Log the incoming webhook message
  console.log("Incoming webhook message:", JSON.stringify(req.body, null, 2));

  // Check if the n8n webhook URL is configured in your .env file
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
    console.log("N8N_WEBHOOK_URL not set in .env file. Skipping forwarding.");
  }

  // Respond to Meta to acknowledge receipt of the webhook
  res.sendStatus(200);
});

// Accepts GET requests at the /webhook endpoint. You need this URL to setup webhook initially.
app.get("/webhook", (req, res) => {
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  // check the mode and token sent are correct
  if (mode === "subscribe" && token === WEBHOOK_VERIFY_TOKEN) {
    // respond with 200 OK and challenge token from the request
    res.status(200).send(challenge);
    console.log("Webhook verified successfully!");
  } else {
    // respond with '403 Forbidden' if verify tokens do not match
    res.sendStatus(403);
  }
});

app.get("/", (req, res) => {
  res.send(`<pre>Nothing to see here.
Checkout README.md to start.</pre>`);
});

// Removido para Vercel: a Vercel gerencia o servidor automaticamente.