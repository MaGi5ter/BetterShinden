import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Main from "./pages/main";
import "./assets/style.css";
import SeriePage from "./pages/seriePage";

function App() {
  console.clear();

  return (
    <div>
      <BrowserRouter>
        <Routes>
          {/* <Route index element={<Main />}></Route> */}
          {/* <Route path="/main" element={<Main />}></Route> */}
          <Route path="/series/:id" element={<SeriePage />}></Route>
          <Route path="/titles/:id" element={<SeriePage />}></Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
