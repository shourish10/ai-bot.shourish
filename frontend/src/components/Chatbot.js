

import React, { useState } from "react";
import "./Chatbot.css";

const API = "https://ai-chatbot-backend-63ak.onrender.com/"; // 🔁 Replace with your actual backend URL

function Chatbot() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { text: input, sender: "user" };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch(`${API}/ask`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: input }),
      });

      const data = await res.json();

      if (res.ok && data.response) {
        const botMessage = { text: data.response, sender: "bot" };
        setMessages((prev) => [...prev, botMessage]);
      } else {
        const errorMsg = { text: "⚠️ Error: No response from backend.", sender: "bot" };
        setMessages((prev) => [...prev, errorMsg]);
      }
    } catch (error) {
      const errorMsg = { text: "⚠️ Network error. Please try again later.", sender: "bot" };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      sendMessage();
    }
  };

  return (
    <div className="chatbot-container">
      <div className="chatbox">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`message ${msg.sender === "user" ? "user" : "bot"}`}
          >
            {msg.text}
          </div>
        ))}
        {loading && <div className="message bot">Typing...</div>}
      </div>
      <div className="input-box">
        <input
          type="text"
          placeholder="Ask me anything..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyPress}
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
}

export default Chatbot;
