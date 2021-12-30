import React from "react";
import { Route, Routes as Switch } from "react-router-dom";
import RendingPage from "./pages/index";
// import Join from "./pages/auth/Join";

function Routes() {
    return (
        <Switch>
            <Route path="/" element={<RendingPage />} />
            {/* <Route path="/join" element={<Join />} /> */}
        </Switch>
    );
}

export default Routes;
