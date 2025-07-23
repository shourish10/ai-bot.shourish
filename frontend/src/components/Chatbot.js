import React, { useState } from "react";
import "./Chatbot.css";

const Chatbot = () => {
  const [userInput, setUserInput] = useState("");
  const [chat, setChat] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!userInput.trim()) return;

    // Add user message to chat
    setChat([...chat, { sender: "user", message: userInput }]);

    try {
      const response = await fetch("http://localhost:5000/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: userInput }),
      });

      const data = await response.json();

      if (data.response) {
        setChat((prevChat) => [
          ...prevChat,
          { sender: "ai", message: data.response },
        ]);
      } else {
        setChat((prevChat) => [
          ...prevChat,
          { sender: "ai", message: "❌ Error: No response from server." },
        ]);
        console.error("Backend error:", data);
      }
    } catch (error) {
      console.error("Network error:", error);
      setChat((prevChat) => [
        ...prevChat,
        { sender: "ai", message: "⚠️ Network error. Try again later." },
      ]);
    }

    setUserInput(""); // Clear input
  };

  return (
    <div className="chatbot-container">
      <h1>🤖 AI Chatbot</h1>
      <div className="chat-window">
        {chat.map((msg, index) => (
          <div
            key={index}
            className={`chat-message ${msg.sender === "user" ? "user" : "ai"}`}
          >
            <strong>{msg.sender === "user" ? "You" : "AI"}:</strong> {msg.message}
          </div>
        ))}
      </div>
      <form onSubmit={handleSubmit} className="input-form">
        <input
          type="text"
          placeholder="Type your message..."
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
};

export default Chatbot;
