// Simple in-memory log store for serverless
let logs = [];

export function addLog(entry) {
  logs.push({
    entry,
    timestamp: new Date().toISOString()
  });
  // Keep only the last 1000 logs
  if (logs.length > 1000) logs.shift();
}

export function getLogs() {
  // Return newest first
  return logs.slice().reverse();
}
