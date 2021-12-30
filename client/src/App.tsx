import React from "react";
import { Route, Routes } from "react-router-dom";
import FirstPage from "./pages/FirstPage";

function App() {
    return (
        <Routes>
            <Route path="/" element={<FirstPage />} />
        </Routes>
    );
}

export default App;
