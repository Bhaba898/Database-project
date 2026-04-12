require("dotenv").config();
const Groq = require("groq-sdk");
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

async function test() {
  try {
    const response = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [{ role: "user", content: "Say 'Hello' and nothing else." }],
      temperature: 0.2
    });
    console.log("Success:", response.choices[0].message.content);
  } catch (err) {
    console.error("Error calling Groq:", err.message);
  }
}
test();
