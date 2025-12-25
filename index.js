const express = require("express");

const app = express();
app.use(express.json());

// Health check
app.get("/", (req, res) => res.send("OK"));

// Webhook verification (Meta)
app.get("/webhook", (req, res) => {
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  // Debug (doesn't print the token itself)
  console.log("VERIFY REQ:", {
    mode,
    hasToken: !!token,
    hasEnvVerifyToken: !!process.env.VERIFY_TOKEN,
  });

  if (mode === "subscribe" && token === process.env.VERIFY_TOKEN) {
    console.log("Webhook verified ✅");
    return res.status(200).send(challenge);
  }

  console.log("Webhook verify failed ❌");
  return res.sendStatus(403);
});

// Webhook receiver (incoming messages/events)
app.post("/webhook", (req, res) => {
  console.log("Webhook event received:");
  console.log(JSON.stringify(req.body, null, 2));

  // Must respond 200 quickly
  return res.sendStatus(200);
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server running on port ${port}`));
