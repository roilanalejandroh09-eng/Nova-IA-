const express = require("express");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

const apiKey = process.env.API_KEY;
const agentId = process.env.AGENT_ID;

if (!apiKey || !agentId) {
  console.error("❌ Missing API_KEY or AGENT_ID in .env file!");
  process.exit(1);
}
console.log("✅ API credentials loaded");

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

// rota padrão para abrir o index.html
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// rota principal do chatbot
app.post("/api/chat", async (req, res) => {
  const { message } = req.body;
  console.log("Mensagem recebida do frontend:", message);

  const payload = {
    query: message,
    streaming: false
  };

  try {
    const response = await fetch(`https://api.chatvolt.ai/agents/${agentId}/query`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error("❌ API Error:", response.status, errText);
      return res.status(response.status).json({ error: errText });
    }

    const data = await response.json();
    console.log("Resposta bruta da IA:", data);

    res.json({ reply: data.answer || "Resposta não encontrada" });
  } catch (err) {
    console.error("❌ Fetch error:", err);
    res.status(500).json({ error: "Falha na conexão com IA" });
  }
});

// health check
app.get("/health", (req, res) => res.json({ status: "OK" }));

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`🚀 Servidor Chatbot rodando em http://localhost:${port}`);
});
