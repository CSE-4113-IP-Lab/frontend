"use client";

import React, { useEffect, useState } from 'react';
import { marked } from 'marked';
import { LuBot } from "react-icons/lu";
import type { ChatMessage as ChatMessageType } from '@/types/agent';

interface ChatMessageProps {
    message: ChatMessageType;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
    const isUser = message.role === 'user';
    const [htmlContent, setHtmlContent] = useState<string>("");

    useEffect(() => {
        marked.setOptions({
            gfm: true,
            breaks: true,
            pedantic: false,
        });

        const markedResult = marked.parse(message.content);
        let htmlContent = typeof markedResult === "string" ? markedResult : String(markedResult);

        // Wrap tables with custom table container class for themed styling
        htmlContent = htmlContent.replace(
            /<table>/g,
            '<div class="agent-table-container"><table class="agent-table">'
        );
        htmlContent = htmlContent.replace(
            /<\/table>/g,
            '</table></div>'
        );

        setHtmlContent(htmlContent);
    }, [message.content]);

    return (
        <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-6`}>
            <div
                className={`max-w-[85%] px-5 py-4 rounded-2xl shadow-sm transition-all duration-200 hover:shadow-md ${isUser
                    ? 'bg-gradient-to-r from-[#14244c] to-[#1e3a5f] text-white rounded-br-md'
                    : 'bg-white/90 backdrop-blur-sm border border-gray-200/60 text-gray-800 rounded-bl-md'
                    }`}
            >
                {/* User icon for agent messages */}
                {!isUser && (
                    <div className="flex items-center mb-2">
                        <div className="w-6 h-6 rounded-full bg-gradient-to-r from-[#ecb31d] to-[#f5c842] flex items-center justify-center mr-2 shadow-sm">
                            <LuBot className="w-4 h-4 text-[#14244c]" />
                        </div>
                        <span className="text-xs font-semibold text-[#14244c]">CSEDU Bot</span>
                    </div>
                )}

                {/* Markdown content with enhanced styling */}
                <div className={`prose prose-xs max-w-none text-xs ${isUser
                    ? 'prose-invert prose-a:text-blue-200'
                    : 'prose-gray prose-a:text-[#14244c] prose-a:hover:text-[#ecb31d]'
                    } prose-headings:mb-2 prose-headings:mt-3 prose-headings:text-[#14244c] prose-headings:font-bold prose-p:mb-2 prose-ul:mb-2 prose-ol:mb-2 prose-li:mb-1 prose-code:bg-gray-100 prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-code:text-xs prose-pre:bg-gray-800 prose-pre:text-gray-100 prose-pre:rounded-lg prose-blockquote:border-l-[#ecb31d] prose-blockquote:bg-yellow-50/50 prose-blockquote:pl-3 prose-blockquote:py-1`}>
                    <div
                        dangerouslySetInnerHTML={{ __html: htmlContent }}
                    />
                </div>

                {/* Response time indicator - only show for agent messages */}
                {message.time_needed && !isUser && (
                    <div className="text-xs mt-3 pt-2 border-t border-gray-100 text-gray-500 flex items-center justify-center">
                        <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                        <span>{message.time_needed}s</span>
                    </div>
                )}
            </div>
        </div>
    );
};
