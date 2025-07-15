"use client";

import React, { useState } from 'react';
import { ChatInterface } from './ChatInterface';
import { LuBot } from "react-icons/lu";

export const ChatWidget: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            {/* Chat Toggle Button - Bottom Left */}
            <div className="fixed bottom-6 right-6 z-50">
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className={`relative w-12 h-12 rounded-full shadow-xl transition-all duration-300 group hover:scale-110 ${isOpen
                        ? 'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700'
                        : 'bg-gradient-to-r from-[#14244c] to-[#1e3a5f] hover:from-[#1e3a5f] hover:to-[#14244c]'
                        }`}
                    title={isOpen ? "Close Chat" : "Ask AI Assistant"}
                >
                    <div className="flex items-center justify-center">
                        {isOpen ? (
                            <svg className="w-6 h-6 text-white transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        ) : (
                            <LuBot className="w-6 h-6 text-white" />
                        )}
                    </div>
                </button>
            </div>

            {/* Chat Window - Positioned from bottom left */}
            {isOpen && (
                <div className="fixed bottom-24 right-6 w-96 h-[500px] bg-white rounded-lg shadow-2xl border border-gray-200 z-40 overflow-hidden max-w-[calc(100vw-3rem)] md:w-96">
                    <div className="h-full">
                        <ChatInterface />
                    </div>
                </div>
            )}

            {/* Backdrop for mobile */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-30 md:hidden"
                    onClick={() => setIsOpen(false)}
                />
            )}
        </>
    );
};
