import React from "react";
import { useState } from "react";

function Login(props) {
  const [createAccount, setCreateAccount] = useState(false);

  return (
    <div className="login-container">
      {!createAccount ? (
        <div className="login-section">
          <form
            className="login-form"
            action="/login"
            method="post"
            onSubmit={() => {
              console.log("On Submit called");
              props.account();
              console.log("On Submit ends");
            }}
          >
            <div className="login-form-item">
              <p>Email</p>
              <input type="email" name="userEmail" placeholder="Email" />
            </div>
            <div className="login-form-item">
              <p>Password</p>
              <input
                type="password"
                name="password"
                id=""
                placeholder="Password"
              />
            </div>
            <div className="login-form-item">
              <button
                type="submit"
                // onClick={() => {
                // }}
                // onSubmit={(event) => {
                //   event.preventDefault();
                //   // fetch("/login").then((data)=>{})
                //   // props.account();
                // }}
                className="login-btn"
              >
                Login
              </button>
            </div>
            <div
              className="account-switch"
              onClick={() => {
                setCreateAccount(!createAccount);
              }}
            >
              Create New Account
            </div>
          </form>
          <div className="login-side-image">
            <img src="image/logo2.png" alt="" />
          </div>
        </div>
      ) : (
        <div className="signin-section">
          <form className="signin-form" action="/signIn" method="post">
            <div className="login-form-item">
              <p>Username</p>
              <input type="text" name="userName" placeholder="Username" />
            </div>
            <div className="login-form-item">
              <p>Email</p>
              <input type="email" name="userEmail" placeholder="Email" />
            </div>
            <div className="login-form-item">
              <p>Password</p>
              <input
                type="password"
                name="password"
                id=""
                placeholder="Password"
              />
            </div>
            {/* <div className="login-form-item">
              <p>Confirm Password</p>
              <input
                type="password"
                name="confirmPassword"
                id=""
                placeholder="Confirm Password"
              />
            </div> */}
            <div className="login-form-item">
              <button
                type="submit"
                className="login-btn"
                onClick={() => {
                  props.account();
                }}
              >
                Sign-In
              </button>
            </div>
            <div
              className="account-switch"
              onClick={() => {
                setCreateAccount(!createAccount);
              }}
            >
              Already had account login
            </div>
          </form>
          <div className="login-side-image">
            <img src="image/logo2.png" alt="" />
          </div>
        </div>
      )}
    </div>
  );
}

export default Login;
