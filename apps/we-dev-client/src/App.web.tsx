import useUserStore from "./stores/userSlice";
import useChatModeStore from "./stores/chatModeSlice";
import {GlobalLimitModal} from "./components/UserModal";
import Header from "./components/Header";
import AiChat from "./components/AiChat";
import Login from "./components/Login";
import EditorPreviewTabs from "./components/EditorPreviewTabs.web";
import "./utils/i18";
import classNames from "classnames";
import {ChatMode} from "./types/chat";
import {ToastContainer} from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {UpdateTip} from "./components/UpdateTip"
import useInit from "./hooks/useInit";
import {Loading} from "./components/loading";
import TopViewContainer from "./components/TopView";

function App() {
    const {mode, initOpen} = useChatModeStore();

    const {isLoginModalOpen, closeLoginModal, openLoginModal} = useUserStore();

    const {isDarkMode} = useInit();

    return (
        <TopViewContainer>
            <GlobalLimitModal onLogin={openLoginModal}/>
            <Login isOpen={isLoginModalOpen} onClose={closeLoginModal}/>
            <div
                className={classNames(
                    "h-screen w-screen flex flex-col overflow-hidden",
                    {
                        dark: isDarkMode,
                    }
                )}
            >
                <Header/>
                <div
                    className="flex flex-row w-full h-full max-h-[calc(100%-48px)] bg-white dark:bg-[#111]"
                >
                    <AiChat/>
                    {mode === ChatMode.Builder && !initOpen && <EditorPreviewTabs/>}
                </div>
            </div>
            <UpdateTip/>
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
            <Loading/>
        </TopViewContainer>
    );
}

export default App;