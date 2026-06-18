const express = require("express");
const axios = require("axios");
const https = require("https");
const fs = require("fs");
require("dotenv").config();

const app = express();
app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    status: "Santander Proxy Online"
  });
});

app.get("/token", async (req, res) => {
  try {
    const pfx = fs.readFileSync(
  process.env.SANTANDER_CERT_PATH || "./open.pfx"
);

    const agent = new https.Agent({
      pfx,
      passphrase: process.env.SANTANDER_CERT_PASSPHRASE
    });

    const response = await axios.post(
      "https://trust-pix.santander.com.br/oauth/token?grant_type=client_credentials",
      {},
      {
        httpsAgent: agent,
        auth: {
          username: process.env.SANTANDER_CLIENT_ID,
          password: process.env.SANTANDER_CLIENT_SECRET
        }
      }
    );

    res.json(response.data);
  } catch (err) {
    console.error(err.response?.data || err.message);

    res.status(500).json({
  erro: err.response?.data || err.message
});
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor iniciado na porta ${PORT}`);
});