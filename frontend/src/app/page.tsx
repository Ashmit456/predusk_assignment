"use client";

import { useState, useRef } from "react";
import { Upload, FileText, Send, Clock, BookOpen, AlertCircle, CheckCircle2 } from "lucide-react";

// --- Types ---
interface Citation {
  text: string;
  source: string;
  page?: number;
}

interface Message {
  role: "user" | "assistant";
  content: string;
  citations?: Citation[];
  metrics?: {
    time: number;
    tokens?: number; // Rough estimate
  };
}

export default function Home() {
  // --- State ---
  const [activeTab, setActiveTab] = useState<"ingest" | "chat">("ingest");
  
  // Ingest State
  const [ingestType, setIngestType] = useState<"file" | "text">("file");
  const [file, setFile] = useState<File | null>(null);
  const [rawText, setRawText] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<{ success: boolean; msg: string } | null>(null);

  // Chat State
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isChatting, setIsChatting] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // --- Handlers ---

  const handleIngest = async () => {
    setIsUploading(true);
    setUploadStatus(null);
    const formData = new FormData();

    if (ingestType === "file" && file) {
      formData.append("file", file);
    } else if (ingestType === "text" && rawText) {
      formData.append("text", rawText);
    } else {
      setUploadStatus({ success: false, msg: "Please provide a file or text." });
      setIsUploading(false);
      return;
    }

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/ingest`, {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      
      if (!res.ok) throw new Error(data.detail || "Upload failed");
      
      setUploadStatus({ success: true, msg: data.message });
      // Optional: Auto-switch to chat after success
      setTimeout(() => setActiveTab("chat"), 1500);
      
    } catch (error: any) {
      setUploadStatus({ success: false, msg: error.message });
    } finally {
      setIsUploading(false);
    }
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg: Message = { role: "user", content: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsChatting(true);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: userMsg.content }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.detail);

      // Rough token estimate: 1 token ~= 4 chars
      const estTokens = (userMsg.content.length + data.answer.length) / 4;

      const botMsg: Message = {
        role: "assistant",
        content: data.answer,
        citations: data.citations,
        metrics: {
          time: data.processing_time,
          tokens: Math.round(estTokens)
        }
      };

      setMessages((prev) => [...prev, botMsg]);
      
    } catch (error) {
      setMessages((prev) => [
        ...prev, 
        { role: "assistant", content: "Sorry, something went wrong connecting to the AI." }
      ]);
    } finally {
      setIsChatting(false);
      // Scroll to bottom
      setTimeout(() => chatEndRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 flex flex-col items-center p-4 md:p-8 font-sans text-gray-800">
      
      {/* Header */}
      <div className="max-w-4xl w-full mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">RAG Knowledge Assistant</h1>
          <p className="text-sm text-gray-500">Gemini Flash • Qdrant • Cohere Rerank</p>
        </div>
        <a 
          href="https://drive.google.com/file/d/1rYmoialVAcgpB5IccRfvAhKzZiVY3ePQ/view?usp=sharing" // Put your actual resume in the public folder
          target="_blank" 
          className="text-sm text-blue-600 hover:underline"
        >
          My Resume ↗
        </a>
      </div>

      {/* Main Container */}
      <div className="max-w-4xl w-full bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100 flex flex-col md:flex-row min-h-[600px]">
        
        {/* Sidebar / Tabs */}
        <div className="w-full md:w-64 bg-gray-50 border-r border-gray-100 p-4 flex flex-col gap-2">
          <button
            onClick={() => setActiveTab("ingest")}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
              activeTab === "ingest" 
                ? "bg-blue-100 text-blue-700" 
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            <Upload size={18} />
            Add Knowledge
          </button>
          
          <button
            onClick={() => setActiveTab("chat")}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
              activeTab === "chat" 
                ? "bg-blue-100 text-blue-700" 
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            <FileText size={18} />
            Chat with Docs
          </button>

          <div className="mt-auto pt-6 border-t border-gray-200">
            <div className="text-xs text-gray-400">
              <p className="font-semibold mb-1">Architecture:</p>
              <ul className="list-disc pl-4 space-y-1">
                <li>Next.js (App Router)</li>
                <li>FastAPI + LangChain</li>
                <li>Hybrid Search</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 p-6 relative">
          
          {/* --- INGEST VIEW --- */}
          {activeTab === "ingest" && (
            <div className="max-w-lg mx-auto mt-10">
              <h2 className="text-xl font-semibold mb-6">Upload Knowledge</h2>
              
              <div className="flex gap-4 mb-6">
                <button 
                  onClick={() => setIngestType("file")}
                  className={`pb-2 text-sm font-medium border-b-2 ${ingestType === "file" ? "border-blue-500 text-blue-600" : "border-transparent text-gray-500"}`}
                >
                  Upload PDF
                </button>
                <button 
                  onClick={() => setIngestType("text")}
                  className={`pb-2 text-sm font-medium border-b-2 ${ingestType === "text" ? "border-blue-500 text-blue-600" : "border-transparent text-gray-500"}`}
                >
                  Paste Text
                </button>
              </div>

              <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-xl p-8 flex flex-col items-center justify-center min-h-[200px]">
                {ingestType === "file" ? (
                  <>
                    <Upload className="text-gray-400 mb-4" size={40} />
                    <input 
                      type="file" 
                      accept=".pdf"
                      onChange={(e) => setFile(e.target.files?.[0] || null)}
                      className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    />
                    <p className="text-xs text-gray-400 mt-2">Max size 10MB (PDF only)</p>
                  </>
                ) : (
                  <textarea
                    placeholder="Paste your raw text or documentation here..."
                    className="w-full h-40 bg-transparent border-none focus:ring-0 resize-none text-sm p-2"
                    value={rawText}
                    onChange={(e) => setRawText(e.target.value)}
                  />
                )}
              </div>

              <button
                onClick={handleIngest}
                disabled={isUploading}
                className="w-full mt-6 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-70"
              >
                {isUploading ? "Processing..." : "Ingest & Index"}
              </button>

              {uploadStatus && (
                <div className={`mt-4 p-3 rounded-lg text-sm flex items-center gap-2 ${uploadStatus.success ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}>
                  {uploadStatus.success ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
                  {uploadStatus.msg}
                </div>
              )}
            </div>
          )}

          {/* --- CHAT VIEW --- */}
          {activeTab === "chat" && (
            <div className="flex flex-col h-full">
              
              {/* Messages Area */}
              <div className="flex-1 overflow-y-auto space-y-6 pr-2 mb-4">
                {messages.length === 0 && (
                  <div className="text-center text-gray-400 mt-20">
                    <BookOpen className="mx-auto mb-2 opacity-50" size={40} />
                    <p>Ready to answer questions based on your docs.</p>
                  </div>
                )}
                
                {messages.map((msg, idx) => (
                  <div key={idx} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                    <div className={`max-w-[85%] rounded-2xl p-4 ${
                      msg.role === "user" 
                        ? "bg-blue-600 text-white rounded-br-none" 
                        : "bg-gray-100 text-gray-800 rounded-bl-none"
                    }`}>
                      <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                      
                      {/* Citations & Metrics */}
                      {msg.role === "assistant" && (
                        <div className="mt-4 pt-3 border-t border-gray-200/50">
                          {/* Metrics Header */}
                          <div className="flex items-center gap-4 text-xs text-gray-500 mb-2">
                            {msg.metrics && (
                              <>
                                <span className="flex items-center gap-1">
                                  <Clock size={12} /> {msg.metrics.time}s
                                </span>
                                <span>
                                  ~{msg.metrics.tokens} tokens
                                </span>
                                <span className="text-green-600 font-medium">
                                  Est. Cost: $0.00
                                </span>
                              </>
                            )}
                          </div>

                          {/* Sources List */}
                          {msg.citations && msg.citations.length > 0 && (
                            <div className="space-y-2">
                              <p className="text-xs font-semibold text-gray-600">Sources:</p>
                              {msg.citations.map((cit, i) => (
                                <div key={i} className="bg-white/50 p-2 rounded border-l-2 border-blue-400 text-xs text-gray-600">
                                  "{cit.text}"
                                  <div className="mt-1 text-blue-600 font-medium">
                                    — {cit.source} {cit.page ? `(Page ${cit.page})` : ""}
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                {isChatting && (
                  <div className="flex justify-start">
                    <div className="bg-gray-100 rounded-2xl rounded-bl-none p-4 flex items-center gap-2">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-.3s]" />
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-.5s]" />
                    </div>
                  </div>
                )}
                <div ref={chatEndRef} />
              </div>

              {/* Input Area */}
              <div className="relative">
                <input 
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSend()}
                  placeholder="Ask a question about your documents..."
                  disabled={isChatting}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 pl-4 pr-12 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                />
                <button 
                  onClick={handleSend}
                  disabled={!input.trim() || isChatting}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:hover:bg-blue-600 transition-colors"
                >
                  <Send size={16} />
                </button>
              </div>

            </div>
          )}
        </div>
      </div>
    </main>
  );
}
