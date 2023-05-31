import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Index from "./pages/index";
import Main from "./pages/main";
import "./assets/style.css";
import Serie from "./pages/serie";
import Title from "./pages/titles";

function App() {
  console.clear();
  console.log(
    "Dziekuje za zaufanie i korzystanie z tego dodatku, mam nadzieje ze pozwoli wam on korzystac w normalny i wygodniejszy sposób z tej strony"
  );

  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route index element={<Index />}></Route>
          <Route path="/main" element={<Main />}></Route>
          <Route path="/series/:id" element={<Serie />}></Route>
          <Route path="/titles/:id" element={<Title />}></Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
