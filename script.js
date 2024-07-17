import React from 'react';
import { createRoot } from 'react-dom/client';
import { AuthProvider } from './src/Utils/Contexts/AuthContext';
import Chatbot from './src/section/Chatbot';

const renderChatbot = (containerId) => {
    const container = document.getElementById(containerId);
    if (container) {
        const root = createRoot(container);
        root.render(
            <AuthProvider>
                <Chatbot />
            </AuthProvider>
        );
    }
};

window.renderChatbot = renderChatbot;
