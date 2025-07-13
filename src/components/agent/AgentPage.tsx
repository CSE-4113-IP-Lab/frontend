"use client";

import React from 'react';
import { ChatInterface } from './ChatInterface';
import Card from '@/components/Card';

export const AgentPage: React.FC = () => {
    return (
        <div className="min-h-screen bg-gray-50 py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Page Header */}
                <div className="mb-6">
                    <h1 className="text-3xl font-bold text-[#14244c] mb-2">
                        University Information Assistant
                    </h1>
                    <p className="text-gray-600">
                        Get instant answers about programs, faculty, fees, and more from the Department of CSE, University of Dhaka
                    </p>
                </div>

                {/* Chat Interface Card */}
                <Card className="h-[calc(100vh-200px)] min-h-[600px] p-0 overflow-hidden">
                    <ChatInterface />
                </Card>

                {/* Quick Help Section */}
                <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
                        <h3 className="font-semibold text-[#14244c] mb-2">📚 Academic Info</h3>
                        <p className="text-sm text-gray-600">
                            Ask about programs, courses, schedules, and admission requirements
                        </p>
                    </div>
                    <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
                        <h3 className="font-semibold text-[#14244c] mb-2">👨‍🏫 Faculty & Staff</h3>
                        <p className="text-sm text-gray-600">
                            Find faculty profiles, contact information, and research areas
                        </p>
                    </div>
                    <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
                        <h3 className="font-semibold text-[#14244c] mb-2">💰 Fees & Facilities</h3>
                        <p className="text-sm text-gray-600">
                            Get information about tuition fees, payment schedules, and campus facilities
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};
