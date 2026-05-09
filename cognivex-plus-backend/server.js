
import express from "express";
import cors from "cors";
import Groq from "groq-sdk";

const app = express();

/* ================= MIDDLEWARE ================= */
app.use(cors());
app.use(express.json());

/* ================= GROQ SETUP ================= */
const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY
});

/* ================= HEALTH CHECK ================= */
app.get("/", (req, res) => {
    res.send("Cognivex+ backend running 🚀");
});

/* ================= AI ROUTE ================= */
app.post("/api/chat", async (req, res) => {

    try {
        const message = req.body.message;

        if (!message) {
            return res.status(400).json({ error: "No message provided" });
        }

        const response = await groq.chat.completions.create({
            model: "llama3-70b-8192",
            messages: [
                {
                    role: "system",
                    content: "You are Cognivex+, a helpful AI assistant."
                },
                {
                    role: "user",
                    content: message
                }
            ]
        });

        res.json({
            reply: response.choices[0].message.content
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: "AI request failed"
        });
    }
});

/* ================= START SERVER ================= */
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log("Server running on port " + PORT);
});