import React, { useState, useEffect } from 'react';
import useUserStore from "./stores/userSlice";
import useChatModeStore from "./stores/chatModeSlice";
import { GlobalLimitModal } from "./components/UserModal";
import Header from "./components/Header/Header.web";
import AiChat from "./components/AiChat";
import Login from "./components/Login";
import EditorPreviewTabs from "./components/EditorPreviewTabs.web";
import "./utils/i18";
import classNames from "classnames";
import { ChatMode } from "./types/chat";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { UpdateTip } from "./components/UpdateTip";
import useInit from "./hooks/useInit";
import { Loading } from "./components/loading";
import TopViewContainer from "./components/TopView";

function App() {
    const { mode, initOpen } = useChatModeStore();
    const { isLoginModalOpen, closeLoginModal, openLoginModal, isAuthenticated, user } = useUserStore();
    const { isDarkMode } = useInit();
    const [isWebMode, setIsWebMode] = useState(true);

    // Check if running in web mode
    useEffect(() => {
        const isElectron = window?.electron;
        setIsWebMode(!isElectron);
    }, []);

    // Web-specific features
    const renderWebFeatures = () => {
        if (!isWebMode) return null;

        return (
            <div className="bg-blue-50 dark:bg-blue-900/20 border-b border-blue-200 dark:border-blue-800 px-4 py-3">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                            <span className="text-white text-sm font-bold">🌐</span>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-blue-900 dark:text-blue-100">
                                Web Version - Limited Features
                            </p>
                            <p className="text-xs text-blue-700 dark:text-blue-300">
                                For full experience, download the desktop application
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={() => window.open('https://we0.ai/download', '_blank')}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                    >
                        Download Desktop
                    </button>
                </div>
            </div>
        );
    };

    return (
        <TopViewContainer>
            <GlobalLimitModal onLogin={openLoginModal} />
            <Login isOpen={isLoginModalOpen} onClose={closeLoginModal} />
            
            {/* Web Mode Banner */}
            {renderWebFeatures()}
            
            <div
                className={classNames(
                    "h-screen w-screen flex flex-col overflow-hidden",
                    {
                        dark: isDarkMode,
                    }
                )}
            >
                <Header />
                <div
                    className="flex flex-row w-full h-full max-h-[calc(100%-48px)] bg-white dark:bg-[#111]"
                >
                    <AiChat />
                    {mode === ChatMode.Builder && !initOpen && isAuthenticated && (
                        <EditorPreviewTabs />
                    )}
                </div>
            </div>
            <UpdateTip />
            <ToastContainer
                position="top-center"
                autoClose={2000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="colored"
                style={{
                    zIndex: 100000,
                }}
            />
            <Loading />
        </TopViewContainer>
    );
}

export default App;