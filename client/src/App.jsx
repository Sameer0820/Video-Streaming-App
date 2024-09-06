import Navbar from "./components/Navbar/Navbar";
import { Outlet } from "react-router-dom";

function App() {
    return (
        <div className="flex flex-wrap bg-gray-400">
            <div className="w-full block">
                <Navbar />
                <main>
                    <Outlet />
                </main>
            </div>
        </div>
    );
}

export default App;
