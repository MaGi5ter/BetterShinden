import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

check_cloudflare();

async function check_cloudflare() {
  if (document.body.className == "no-js") {
    await sleep(100);
    console.log("CLOUDFLARE TEST");
    check_cloudflare();
  } else {
    console.log(document.body.className == "no-js");

    document.body.innerHTML = "";

    // document.body.style = style

    const rootElement = document.createElement("div");
    rootElement.id = "root";
    document.body.appendChild(rootElement);
    const root = ReactDOM.createRoot(rootElement);

    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
  }
}
