"use client";

import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage } from './ChatMessage';
import { agentService } from '@/services/agentService';
import { LuBot } from "react-icons/lu";
import type { ChatMessage as ChatMessageType } from '@/types/agent';

export const ChatInterface: React.FC = () => {
    const [messages, setMessages] = useState<ChatMessageType[]>([]);
    const [inputMessage, setInputMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    useEffect(() => {
        // Add welcome message
        const welcomeMessage: ChatMessageType = {
            id: 'welcome',
            content: `#### Welcome to the CSEDU Bot! 🎓

I'm here to help you find information about the **Department of Computer Science and Engineering (CSE)** at the **University of Dhaka**.

**What I can help you with:**

📚 **Academic Programs** - BSc, MSc, PhD programs and course details
👨‍🏫 **Faculty Information** - Faculty profiles and contact details  
📊 **Statistics** - Student enrollment, faculty count, and more
📢 **Notices & Events** - Recent announcements and activities
🏛️ **Facilities** - Room information and equipment details
💰 **Fee Information** - Tuition fees and payment schedules

**Just ask me anything about the university!** For example:
- "Show me all available programs"
- "Who are the faculty members?"
- "What are the tuition fees for BSc program?"`,
            role: 'agent',
            timestamp: new Date(),
        };
        setMessages([welcomeMessage]);
    }, []);

    const handleSendMessage = async () => {
        if (!inputMessage.trim() || isLoading) return;

        const userMessage: ChatMessageType = {
            id: Date.now().toString(),
            content: inputMessage,
            role: 'user',
            timestamp: new Date(),
        };

        setMessages(prev => [...prev, userMessage]);
        setInputMessage('');
        setIsLoading(true);

        try {
            const response = await agentService.queryAgent(inputMessage);

            const agentMessage: ChatMessageType = {
                id: (Date.now() + 1).toString(),
                content: response.content,
                role: 'agent',
                timestamp: new Date(),
                time_needed: response.time_needed,
            };

            setMessages(prev => [...prev, agentMessage]);
        } catch (error) {
            console.error('Error querying agent:', error);

            const errorMessage: ChatMessageType = {
                id: (Date.now() + 1).toString(),
                content: '❌ **Sorry, I encountered an error while processing your request.** Please try again later or rephrase your question.',
                role: 'agent',
                timestamp: new Date(),
            };

            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
            inputRef.current?.focus();
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    const clearChat = () => {
        setMessages([]);
        // Re-add welcome message
        const welcomeMessage: ChatMessageType = {
            id: 'welcome-new',
            content: `#### Chat cleared! 🔄

How can I help you with university information today?`,
            role: 'agent',
            timestamp: new Date(),
        };
        setMessages([welcomeMessage]);
    };

    return (
        <div className="flex flex-col h-full bg-gradient-to-br from-gray-50 to-gray-100">
            {/* Header */}
            <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200/60 px-6 py-4 shadow-sm">
                <div className="flex items-center justify-between">
                    <div className="flex items-center">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-[#14244c] via-[#1e3a5f] to-[#14244c] flex items-center justify-center mr-3 shadow-lg">
                            <LuBot className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-[#14244c] tracking-tight">CSEDU Bot</h2>
                            <p className="text-xs text-gray-600 font-medium">CSE Department • University of Dhaka</p>
                        </div>
                    </div>
                    <button
                        onClick={clearChat}
                        className="flex items-center gap-2 px-3 py-2 text-sm bg-white hover:bg-gray-50 text-gray-600 hover:text-[#14244c] border border-gray-300 rounded-lg transition-colors duration-200"
                        title="Clear chat and start over"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                    </button>
                </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto px-6 py-4">
                <div className="max-w-4xl mx-auto">
                    {messages.map((message) => (
                        <ChatMessage key={message.id} message={message} />
                    ))}
                    {isLoading && (
                        <div className="flex justify-start mb-4">
                            <div className="bg-white/90 backdrop-blur-sm border border-gray-200 rounded-lg px-4 py-3 shadow-sm">
                                <div className="flex items-center space-x-2">
                                    <div className="flex space-x-1">
                                        <div className="w-1.5 h-1.5 bg-[#ecb31d] rounded-full animate-bounce"></div>
                                        <div className="w-1.5 h-1.5 bg-[#ecb31d] rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                                        <div className="w-1.5 h-1.5 bg-[#ecb31d] rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                                    </div>
                                    <span className="text-xs text-gray-600 font-medium">AI is thinking...</span>
                                </div>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>
            </div>

            {/* Input Area */}
            <div className="bg-white/90 backdrop-blur-sm border-t border-gray-200/60 px-6 py-5">
                <div className="max-w-4xl mx-auto">
                    <div className="flex space-x-3">
                        <div className="flex-1 relative">
                            <input
                                ref={inputRef}
                                type="text"
                                value={inputMessage}
                                onChange={(e) => setInputMessage(e.target.value)}
                                onKeyPress={handleKeyPress}
                                placeholder="Ask me about programs, faculty, fees..."
                                className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#14244c] focus:border-transparent shadow-sm transition-all duration-200 bg-white/80 text-sm placeholder:text-sm"
                                disabled={isLoading}
                            />
                            {inputMessage && (
                                <button
                                    onClick={() => setInputMessage('')}
                                    className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                                >
                                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            )}
                        </div>
                        <button
                            onClick={handleSendMessage}
                            disabled={!inputMessage.trim() || isLoading}
                            className="px-4 py-2 bg-gradient-to-r from-[#14244c] to-[#1e3a5f] hover:from-[#1e3a5f] hover:to-[#14244c] text-white font-medium rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center min-w-[60px]"
                        >
                            {isLoading ? (
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            ) : (
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                                </svg>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
