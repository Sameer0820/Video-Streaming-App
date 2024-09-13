import Navbar from "./components/Navbar/Navbar";
import { Outlet } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import { Bounce, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
    return (
        <div className="h-screen w-screen bg-black text-white flex flex-col bg-opacity-95">
            <Navbar />
            <div className="w-full h-full flex overflow-auto">
                <div>
                    <Sidebar />
                </div>
                <main className="overflow-y-auto h-full w-full">
                    <Outlet />
                </main>
            </div>
            <ToastContainer
                position="top-right"
                autoClose={2000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="dark"
                transition={Bounce}
            />
        </div>
    );
}

export default App;
