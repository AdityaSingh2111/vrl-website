import { useState } from 'react';
import { FaRobot, FaPaperPlane, FaTimes } from 'react-icons/fa';
import { GoogleGenerativeAI } from "@google/generative-ai";

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([{ text: "Hi! How can I help you move today?", isBot: true }]);
  const [input, setInput] = useState("");

  const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

  const handleSend = async () => {
    if (!input.trim()) return;
    const userMsg = input;
    setMessages(prev => [...prev, { text: userMsg, isBot: false }]);
    setInput("");

    try {
      // Prompt engineering for context
      const model = genAI.getGenerativeModel({ model: "gemini-pro"});
      const prompt = `You are a helpful support agent for VRL Logistic Packers and Movers. 
      Answer briefly about moving, packing, prices, or tracking. 
      User asks: ${userMsg}`;
      
      const result = await model.generateContent(prompt);
      const response = result.response.text();
      
      setMessages(prev => [...prev, { text: response, isBot: true }]);
    } catch (error) {
      setMessages(prev => [...prev, { text: "Sorry, I am offline right now.", isBot: true }]);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {!isOpen && (
        <button onClick={() => setIsOpen(true)} className="bg-primary text-white p-4 rounded-full shadow-2xl hover:bg-blue-900 transition-all transform hover:scale-110">
          <FaRobot size={24} />
        </button>
      )}

      {isOpen && (
        <div className="bg-white w-80 h-96 rounded-xl shadow-2xl flex flex-col border border-gray-200">
          <div className="bg-primary p-4 rounded-t-xl text-white flex justify-between items-center">
            <h3 className="font-bold">VRL Support AI</h3>
            <button onClick={() => setIsOpen(false)}><FaTimes /></button>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.isBot ? 'justify-start' : 'justify-end'}`}>
                <div className={`p-2 rounded-lg text-sm max-w-[80%] ${m.isBot ? 'bg-gray-100 text-dark' : 'bg-blue-100 text-blue-900'}`}>
                  {m.text}
                </div>
              </div>
            ))}
          </div>
          <div className="p-3 border-t flex gap-2">
            <input 
              className="flex-1 border rounded px-2 py-1 text-sm focus:outline-none focus:border-primary"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Ask me anything..."
            />
            <button onClick={handleSend} className="text-primary"><FaPaperPlane /></button>
          </div>
        </div>
      )}
    </div>
  );
}