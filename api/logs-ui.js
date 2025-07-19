// Endpoint for logs UI (HTML)
import express from "express";
import { getLogs } from "./logs.js";

const router = express.Router();

router.get("/logs", (req, res) => {
  const logs = getLogs();
  const logText = logs.map(log => `[${log.timestamp}] ${log.entry}`).join("\n");
  res.send(`
    <html>
    <head>
      <title>Logs - WhatsApp API</title>
      <style>
        body { font-family: monospace; background: #181818; color: #fafafa; padding: 2rem; }
        .logs-box { width: 100%; height: 60vh; background: #232323; border-radius: 8px; padding: 1rem; overflow-y: auto; white-space: pre; }
        .copy-btn { margin: 1rem 0; padding: 0.5rem 1.5rem; border-radius: 4px; border: none; background: #25d366; color: #181818; font-weight: bold; cursor: pointer; }
      </style>
    </head>
    <body>
      <h2>Logs do WhatsApp API</h2>
      <button class="copy-btn" onclick="copyLogs()">Copiar Logs</button>
      <div class="logs-box" id="logs">${logText || 'Nenhum log.'}</div>
      <script>
        function copyLogs() {
          const logs = document.getElementById('logs').innerText;
          navigator.clipboard.writeText(logs).then(() => {
            alert('Logs copiados!');
          });
        }
      </script>
    </body>
    </html>
  `);
});

export default router;
