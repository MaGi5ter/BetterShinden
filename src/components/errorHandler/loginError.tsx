import React from "react";
import "./error.css";

type closeFunction = (a: void) => void;
interface Prop {
  trigger: boolean;
}

function LoginError(props: Prop) {
  return props.trigger ? (
    <div id="error_box">
      <div id="popup">
        <h2>Błąd podczas ładowania odtwarzaczy</h2>
        <p>
          Spróbuj odświeżyć stronę, oraz upewnij się że jesteś zalogowany na
          shindenie, niektóre serie wymagają bycia zalogowanym aby je wyświetlić
        </p>
      </div>
    </div>
  ) : (
    <></>
  );
}

export default LoginError;
