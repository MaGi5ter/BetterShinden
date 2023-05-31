import React from "react";
import { useState } from "react";
import "./popup.css";

type closeFunction = (a: void) => void;

interface Prop {
  trigger: boolean;
  close: closeFunction;
}

function click(data: string) {
  console.log(data);
}

function Popup(props: Prop) {
  const [check, setCheck] = useState(true);

  return props.trigger ? (
    <div id="popup_box">
      <form action="/main/0/login" method="POST" id="popup">
        <div className="close">Zamknij</div>
        <h2>Zaloguj się</h2>
        <div className="form-element">
          <label>Login:</label>
          <input type="text" placeholder="login lub email" name="username" />
        </div>

        <div className="form-element">
          <label>Hasło:</label>
          <input type="password" placeholder="hasło" name="password" />
        </div>

        <div className="form-element">
          <input
            type="checkbox"
            checked={check}
            onChange={(e) => (check ? setCheck(false) : setCheck(true))}
            id="passowrd-remember"
            name="remember"
          />
          <label>Zapamiętaj mnie następnym razem</label>
        </div>

        <div className="form-element">
          <button name="login" type="submit">
            zaloguj
          </button>
        </div>
        <div className="form-element">
          <div
            className="close-btn"
            onClick={(e) => {
              props.close();
            }}
          >
            zamknij
          </div>
        </div>
      </form>
    </div>
  ) : (
    <></>
  );
}

export default Popup;

{
  /* <form id="login_form" class="form-login box popup_content" action="/main/0/login" method="POST" data-popup-initialized="true" aria-hidden="false" role="dialog" aria-labelledby="open_22907860" style="opacity: 1; visibility: visible; display: inline-block; outline: none; text-align: left; position: relative; vertical-align: middle;" tabindex="-1">
<h4 class="box-title"><i class="fa fa-fw fa-user"></i> Zaloguj się</h4>
<label>
Login:
<input type="text" placeholder="login lub email" name="username">
</label><br>
<label>
Hasło:
<input type="password" placeholder="hasło" name="password">
</label><br>
<a id="fb-login-link" class="button form-login-button" href="https://login.shinden.eu">przez <i class="fa fa-fw"><img src="https://cdnjs.cloudflare.com/ajax/libs/simple-icons/8.1.0/discord.svg"></i> <i class="fa fa-lg fa-fw fa-google-plus-square" aria-hidden="true"></i></a>
<button class="button" name="login" type="submit">zaloguj <i class="fa fa-lg fa-fw fa-arrow-circle-right"></i></button><br>
<label><input type="checkbox" checked="checked" id="passowrd-remember" name="remember"> Zapamiętaj mnie następnym razem</label>
<ul class="form-login-list">
<li><a href="/user/forget-password">Zapomniałeś hasło?</a></li>
<li><a href="/user/0/register">Zarejestruj się!</a></li>
</ul>
</form> */
}
