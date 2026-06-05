import { useState } from "react";
import { Send, Cpu, CircuitBoard, Sparkles } from "lucide-react";

interface Message {
  id: number;
  text: string;
  type: "user" | "assistant";
  timestamp: Date;
}

export default function App() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "¡Hola! Soy tu asistente de compatibilidad de hardware. Pregúntame sobre cualquier combinación de procesador y placa madre.",
      type: "assistant",
      timestamp: new Date(),
    },
  ]);

  const [inputValue, setInputValue] = useState("");
  const [isThinking, setIsThinking] = useState(false);

  const exampleQuestions = [
    "Precio AMD Ryzen 7 7800X3D?",
    "Precio NVIDIA RTX 3060 Ti?",
    "Socket AMD Ryzen 5 5600?",
    "Socket AMD Ryzen 7 7800X3D?",
    "Socket Intel Core i7-13700K?",
    "Socket Intel Core i9-14900K?",
    "Información del Intel i7-13700K",
    "Información de la Gigabyte B650 Aorus Elite"
  ];

  // 🔥 Llamada REAL al backend
  async function sendMessage(message: string) {
    const response = await fetch("http://localhost:3000/ask", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ question: message }),
    });

    const data = await response.json();

    console.log("FRONTEND RECIBE:", data);

    // 🔥 CORREGIDO: antes buscabas data.data (que no existe)
    return data.message || "No pude generar una respuesta.";
  }

  const handleSend = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now(),
      text: inputValue,
      type: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    const question = inputValue;
    setInputValue("");
    setIsThinking(true);

    try {
      const aiText = await sendMessage(question);

      const aiResponse: Message = {
        id: Date.now() + 1,
        text: aiText,
        type: "assistant",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, aiResponse]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          text: "Hubo un error al procesar tu consulta.",
          type: "assistant",
          timestamp: new Date(),
        },
      ]);
    }

    setIsThinking(false);
  };

  const handleSendFromSuggestion = async (question: string) => {
    const userMessage: Message = {
      id: Date.now(),
      text: question,
      type: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsThinking(true);

    try {
      const aiText = await sendMessage(question);

      const aiResponse: Message = {
        id: Date.now() + 1,
        text: aiText,
        type: "assistant",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, aiResponse]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          text: "Hubo un error al procesar tu consulta.",
          type: "assistant",
          timestamp: new Date(),
        },
      ]);
    }

    setIsThinking(false);
  };

  return (
    <div>
      <div className="grid-bg"></div>
      <div className="orb accent"></div>
      <div className="orb primary"></div>

      <div className="app-container">
        <div className="header-title">
          <CircuitBoard size={42} color="var(--primary)" />
          CompTeck
          <Sparkles size={26} color="var(--accent)" />
        </div>
        <p className="header-sub">Consulta compatibilidad de componentes al instante</p>

        <div className="messages">
          {messages.length === 1 && (
            <div>
              <p style={{ color: "var(--muted-foreground)", marginBottom: "10px" }}>
                Preguntas de ejemplo:
              </p>
              {exampleQuestions.map((q, i) => (
                <div
                  key={i}
                  className="message assistant"
                  style={{ cursor: "pointer" }}
                  onClick={() => handleSendFromSuggestion(q)}
                >
                  <Cpu size={18} color="var(--accent)" style={{ marginRight: "6px" }} />
                  {q}
                </div>
              ))}
            </div>
          )}

          {messages.map((msg) => (
            <div key={msg.id} className={`message ${msg.type}`}>
              {msg.text}
            </div>
          ))}

          {isThinking && (
            <div className="message assistant">Analizando compatibilidad...</div>
          )}
        </div>

        <div className="input-box">
          <input
            type="text"
            placeholder="Pregunta sobre compatibilidad de hardware..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
          />
          <button className="send-btn" onClick={handleSend}>
            Enviar <Send size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
