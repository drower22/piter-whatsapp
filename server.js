/*
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import express from "express";
import axios from "axios";
import { addLog } from "./api/logs.js";
import logsUi from "./api/logs-ui.js";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Crie o app antes de usar app.use
const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// Log inicial de status do servidor
addLog('[INFO] Servidor e logs ativos. Integração iniciada com sucesso.');
console.log('[INFO] Servidor e logs ativos. Integração iniciada com sucesso.');

// Import environment variables
const { WEBHOOK_VERIFY_TOKEN, GRAPH_API_TOKEN, PORT, N8N_WEBHOOK_URL } = process.env;

app.post("/webhook", async (req, res) => {
  const payload = JSON.stringify(req.body);
  addLog(`[EVENTO] POST /webhook recebido: ${payload}`);
  console.log(`[EVENTO] POST /webhook recebido: ${payload}`);
  if (process.env.N8N_WEBHOOK_URL) {
    try {
      const n8nResponse = await axios.post(process.env.N8N_WEBHOOK_URL, req.body, {
        headers: { "Content-Type": "application/json" }
      });
      addLog(`[N8N] Encaminhado para n8n. Status: ${n8nResponse.status}`);
      console.log(`[N8N] Encaminhado para n8n. Status: ${n8nResponse.status}`);
    } catch (err) {
      addLog(`[N8N] Erro ao encaminhar para n8n: ${err.message}`);
      console.log(`[N8N] Erro ao encaminhar para n8n: ${err.message}`);
    }
  } else {
    addLog("[N8N] N8N_WEBHOOK_URL não configurado. Não encaminhou.");
    console.log("[N8N] N8N_WEBHOOK_URL não configurado. Não encaminhou.");
  }
  res.sendStatus(200);
});

// Accepts GET requests at the /webhook endpoint. You need this URL to setup webhook initially.
app.get("/webhook", (req, res) => {
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];
  const logMsg = `[VALIDAÇÃO] GET /webhook?mode=${mode}&token=${token}&challenge=${challenge}`;
  addLog(logMsg);
  console.log(logMsg);
  if (mode === "subscribe" && token === WEBHOOK_VERIFY_TOKEN) {
    addLog("[VALIDAÇÃO] Sucesso: token correto, respondendo challenge");
    console.log("[VALIDAÇÃO] Sucesso: token correto, respondendo challenge");
    res.status(200).send(challenge);
  } else {
    addLog("[VALIDAÇÃO] Falha: token incorreto ou parâmetros inválidos");
    console.log("[VALIDAÇÃO] Falha: token incorreto ou parâmetros inválidos");
    res.sendStatus(403);
  }
});

app.use(logsUi);

app.get("/", (req, res) => {
  res.send(`<pre>API WhatsApp pronta.\nVeja /logs para visualizar os logs.</pre>`);
});

const port = PORT || 4000;
app.listen(port, () => {
  console.log(`Server is listening on port: ${port}`);
});