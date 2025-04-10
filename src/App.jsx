import { useState, useRef, useEffect } from 'react';
import { Moon, Sun, Send } from "lucide-react";
import { motion } from "framer-motion";

const endpoint = "https://mprab-m97gke5n-swedencentral.openai.azure.com/openai/deployments/gpt-35-turbo-instruct/completions?api-version=2023-05-15";
const apiKey = "GEO7tlVcuRVoGpFjxkqvA0x66kpQXNAtYBWEBbFL3YjdBKrH7su5JQQJ99BDACfhMk5XJ3w3AAAAACOG5ZCM";

export default function NovaChat() {
  const [messages, setMessages] = useState([{ sender: "Nova", text: "Hey! I'm Nova AI, your intelligent companion. Ask me anything!" }]);
  const [input, setInput] = useState("");
  const [darkMode, setDarkMode] = useState(true);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = { sender: "You", text: input };
    setMessages((prev) => [...prev, userMessage, { sender: "Nova", text: "Thinking..." }]);
    setInput("");

    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "api-key": apiKey,
        },
        body: JSON.stringify({
          prompt: `You are Nova, a smart and friendly AI assistant. Answer in a concise, informative, and polite tone.\nUser: ${input}\nNova:`,
          max_tokens: 1000,
          temperature: 0.7,
          top_p: 0.9,
          frequency_penalty: 0,
          presence_penalty: 0.6,
          stop: ["User:", "Nova:"]
        })
      });

      const data = await res.json();
      const responseText = data.choices?.[0]?.text?.trim() || "Sorry, I couldn't understand that.";

      setMessages((prev) => [...prev.slice(0, -1), { sender: "Nova", text: responseText }]);
    } catch (err) {
      setMessages((prev) => [...prev.slice(0, -1), { sender: "Nova", text: "Error fetching response." }]);
    }
  };

  return (
    <div className={`container ${darkMode ? 'dark-mode' : 'light-mode'}`}>
      <div className="card chat-container">
        <div className="card-content messages-container">
          <div className="header">
            <h2>Nova AI</h2>
            <button className="button button-ghost" onClick={() => setDarkMode(!darkMode)}>
              {darkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
          </div>
          {messages.map((msg, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className={`message ${msg.sender === "You" ? 'message-user' : 'message-bot'}`}
            >
              <strong>{msg.sender === "You" ? "You" : "Nova"}:</strong> {msg.text}
            </motion.div>
          ))}
          <div ref={messagesEndRef} />
        </div>
        <form onSubmit={handleSubmit} className="input-container">
          <input
            type="text"
            className="input"
            placeholder="Ask Nova anything..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <button type="submit" className="button button-primary">
            <Send size={16} /> Send
          </button>
        </form>
      </div>
    </div>
  );
}
