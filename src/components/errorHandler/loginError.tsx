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
          Upewnij się że jesteś zalogowany na stronie ponieważ jesteś na
          shinden.pl/titles oznacza to że musisz być zalogowany aby oglądać
        </p>
      </div>
    </div>
  ) : (
    <></>
  );
}

export default LoginError;
