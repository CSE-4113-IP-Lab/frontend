"use client";

import "@/styles/style.css";
import { useState, useEffect } from "react";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import { FaUser } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import { BiLogIn } from "react-icons/bi";
import { TbLogin } from "react-icons/tb";
import RegImage from "@/public/register.svg";
import LoginImage from "@/public/log.svg";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import emailjs from "@emailjs/browser";
import Otp from "@/components/Otp";
import { useNavigate } from "react-router-dom";
import Button from "@/components/Button";

type DecodedGoogleDetails = {
  email: string;
  given_name: string;
};

export default function Home() {
  const [isSignUpMode, setIsSignUpMode] = useState(false);
  const [mounted, setMounted] = useState(false);
  const router = useNavigate();

  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [warning, setWarning] = useState("");
  const [id, setId] = useState("");
  const [username, setUsername] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showOtp, setShowOtp] = useState(false);
  const [userRole, setUserRole] = useState<"student" | "faculty" | "admin">(
    "student"
  );
  const [rememberMe, setRememberMe] = useState(false);

  useEffect(() => {
    const userEmail = localStorage.getItem("userEmail");
    if (userEmail) {
      setId(userEmail);
    }
  }, []);

  const resetValues = () => {
    setId("");
    setUsername("");
    setPassword("");
    setConfirmPassword("");
    setWarning("");
    setShowPass(false);
    setShowConfirmPassword(false);
  };

  useEffect(() => {
    setMounted(true);
    const otpObject = localStorage.getItem("otpObject");
    if (otpObject) {
      setShowOtp(true);
    }
  }, []);

  const containerClass = mounted
    ? `container_1 ${isSignUpMode ? "sign-up-mode" : ""}`
    : "container_1";

  const handleGoogleAuth = async (details: DecodedGoogleDetails) => {
    const postData = {
      email: details.email,
      username: details.given_name,
      role: userRole,
    };
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_SERVER_URL}/auth/oauth`,
        postData
      );
      if (response.status === 200) {
        localStorage.setItem("token", response.data.access_token);
        localStorage.setItem("id", response.data.used_id);
        localStorage.setItem("role", response.data.user_role);
        // setToastMessage("Google authentication successful");
        router("/");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setWarning("Passwords do not match");
      return;
    }

    const postData = {
      email: id,
      username,
      password,
      role: userRole,
    };

    try {
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      emailjs
        .send(
          import.meta.env.VITE_EMAILJS_SERVICE_ID!,
          import.meta.env.VITE_EMAILJS_TEMPLATE_ID!,
          {
            to_name: username,
            to_email: id,
            message: `OTP ${otp}`,
          },
          import.meta.env.VITE_EMAILJS_PUBLIC_KEY!
        )
        .then(
          async () => {
            const res = await axios.post(
              `${import.meta.env.VITE_SERVER_URL}/auth/saveOTP`,
              {
                userEmail: id,
                otp,
                type: "REGISTER",
              }
            );
            console.log("Response:", res);

            if (res.status === 201) {
              const otpObject = {
                signupDto: postData,
                timestamp: new Date().getTime(),
                type: "REGISTER",
              };
              localStorage.setItem("otpObject", JSON.stringify(otpObject));
              setShowOtp(true);
            }
          },
          (error) => {
            console.log("Error:", error);
            setWarning("This email doesn't exist");
          }
        );
    } catch (error) {
      console.log(error);
      setWarning("Duplicate email");
    }
  };

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!id.includes("@")) {
      setWarning("Invalid email");
      return;
    }

    const postData = { email: id, password };

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_SERVER_URL}/auth/login`,
        postData,
        {
          headers: {
            "Content-Type": "application/json",
            "ngrok-skip-browser-warning": "true",
          },
        }
      );

      if (response.status === 200) {
        console.log("Login successful", response.data);

        localStorage.setItem("token", response.data.access_token);
        localStorage.setItem("id", response.data.user_id.toString());
        localStorage.setItem("role", response.data.user_role);
        // setToastMessage("Signed in successfully");

        if (rememberMe) {
          localStorage.setItem("userEmail", id);
        }

        router("/");
      }
    } catch (error) {
      console.log(error);
      setWarning("Invalid credentials");
    }
  };

  const handleForgetPassword = async () => {
    if (!id) {
      setWarning("Please enter your email to get the OTP");
      return;
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    try {
      await emailjs.send(
        import.meta.env.VITE_EMAILJS_SERVICE_ID!,
        import.meta.env.VITE_EMAILJS_TEMPLATE_ID!,
        {
          to_name: "User",
          to_email: id,
          message: `OTP ${otp}`,
        },
        import.meta.env.VITE_EMAILJS_PUBLIC_KEY!
      );

      const res = await axios.post(
        `${import.meta.env.VITE_SERVER_URL}/auth/saveOTP`,
        {
          userEmail: id,
          otp,
          type: "FORGOT_PASSWORD",
        },
        {
          headers: {
            "Content-Type": "application/json",
            "ngrok-skip-browser-warning": "true",
          },
        }
      );

      if (res.status === 201) {
        const otpObject = {
          id,
          timestamp: new Date().getTime(),
          type: "FORGOT_PASSWORD",
        };
        localStorage.setItem("otpObject", JSON.stringify(otpObject));
        setShowOtp(true);
      }
    } catch (error) {
      console.log(error);
      setWarning("This email doesn't exist");
    }
  };

  return (
    <>
      {showOtp && <Otp setShowOtp={setShowOtp} />}
      <div className={containerClass}>
        <div className="forms-container">
          <div className="signin-signup">
            <form onSubmit={handleLogin} className="sign-in-form">
              <div
                style={{
                  display: "flex",
                  flexDirection: "row-reverse",
                  alignItems: "center",
                }}
              >
                <p className="title">Sign in</p>
                <TbLogin
                  style={{
                    fontSize: "40px",
                    marginBottom: "10px",
                    marginRight: "5px",
                  }}
                />
              </div>

              <div className="my-4 w-[380px]">
                <h3 className="font-bold text-sm uppercase text-primary-dark mb-3">
                  QUICK DEMO LOGIN
                </h3>
                <div className="grid grid-cols-2 gap-2 mb-4">
                  {(["student", "faculty"] as const).map((type) => (
                    <Button
                      key={type}
                      variant="outline"
                      size="sm"
                      cornerStyle="tr"
                      className="capitalize text-xs"
                      onClick={() => setUserRole(type)}
                    >
                      Demo {type}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="input-field">
                <input
                  type="email"
                  placeholder="Enter Email"
                  value={id}
                  required
                  onChange={(e) => {
                    setId(e.target.value);
                    setWarning("");
                  }}
                />
                <MdEmail
                  className="cursor-pointer text-gray-700"
                  style={{ fontSize: "22px" }}
                />
              </div>
              <div className="input-field">
                <input
                  type={!showPass ? "password" : "text"}
                  placeholder="Enter Password"
                  value={password}
                  required
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setWarning("");
                  }}
                />
                {!showPass && (
                  <AiFillEye
                    className="cursor-pointer text-gray-700"
                    style={{ fontSize: "24px", cursor: "pointer" }}
                    onClick={() => setShowPass(true)}
                  />
                )}
                {showPass && (
                  <AiFillEyeInvisible
                    className="cursor-pointer text-gray-700"
                    style={{ fontSize: "24px", cursor: "pointer" }}
                    onClick={() => setShowPass(false)}
                  />
                )}
              </div>
              <p className="w-full text-center my-1" style={{ color: "red" }}>
                {warning}
              </p>
              <div className="flex justify-between items-center w-[380px] my-1">
                <label className="flex items-center gap-2 text-sm text-gray-700">
                  <input
                    type="checkbox"
                    className="accent-blue-600"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                  />
                  Remember me
                </label>

                <span
                  className="text-sm hover:underline"
                  style={{
                    color: "#ECB31D",
                    cursor: "pointer",
                  }}
                  onClick={handleForgetPassword}
                >
                  Forget password? Click here
                </span>
              </div>
              <input
                type="submit"
                value="Sign in"
                className="px-6 py-[6px] cursor-pointer w-[380px] hover:bg-[#c39010] rounded-[5px] bg-[#ECB31D] font-bold mt-2"
              />
              {mounted && (
                <div className="mt-4 w-full flex justify-center items-center">
                  <GoogleOAuthProvider
                    clientId={import.meta.env.VITE_OAUTH_CLIENT_ID ?? ""}
                  >
                    <GoogleLogin
                      onSuccess={(credentialResponse) => {
                        const details = jwtDecode(
                          credentialResponse.credential ?? ""
                        ) as DecodedGoogleDetails;
                        console.log(details);
                        handleGoogleAuth(details);
                      }}
                      onError={() => {
                        console.log("Login Failed");
                      }}
                    />
                  </GoogleOAuthProvider>
                </div>
              )}
            </form>
            <form onSubmit={handleSignUp} className="sign-up-form">
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <p className="title">Sign up</p>
                <BiLogIn style={{ fontSize: "40px", marginBottom: "10px" }} />
              </div>
              <div className="my-4 w-[380px]">
                <h3 className="font-bold text-sm uppercase text-primary-dark mb-3">
                  QUICK DEMO SIGNUP
                </h3>
                <div className="grid grid-cols-2 gap-2 mb-4">
                  {(["student", "faculty"] as const).map((type) => (
                    <Button
                      key={type}
                      variant="outline"
                      size="sm"
                      cornerStyle="tr"
                      className="capitalize text-xs"
                      onClick={() => setUserRole(type)}
                    >
                      Demo {type}
                    </Button>
                  ))}
                </div>
              </div>
              <div className="input-field">
                <input
                  type="email"
                  placeholder="Enter Email"
                  value={id}
                  required
                  onChange={(e) => {
                    setId(e.target.value);
                    setWarning("");
                  }}
                />
                <MdEmail
                  className="cursor-pointer text-gray-700"
                  style={{ fontSize: "22px" }}
                />
              </div>
              <div className="input-field">
                <input
                  type="text"
                  placeholder="Enter Username"
                  value={username}
                  required
                  onChange={(e) => {
                    setUsername(e.target.value);
                    setWarning("");
                  }}
                />
                <FaUser
                  className="cursor-pointer text-gray-700"
                  style={{ fontSize: "20px" }}
                />
              </div>
              <div className="input-field">
                <input
                  type={!showPass ? "password" : "text"}
                  placeholder="Enter Password"
                  value={password}
                  required
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setWarning("");
                  }}
                />
                {!showPass && (
                  <AiFillEye
                    className="cursor-pointer text-gray-700"
                    style={{ fontSize: "24px", cursor: "pointer" }}
                    onClick={() => setShowPass(true)}
                  />
                )}
                {showPass && (
                  <AiFillEyeInvisible
                    className="cursor-pointer text-gray-700"
                    style={{ fontSize: "24px", cursor: "pointer" }}
                    onClick={() => setShowPass(false)}
                  />
                )}
              </div>
              <div className="input-field">
                <input
                  type={!showConfirmPassword ? "password" : "text"}
                  placeholder="Confirm Password"
                  value={confirmPassword}
                  required
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    setWarning("");
                  }}
                />
                {!showConfirmPassword && (
                  <AiFillEye
                    className="cursor-pointer text-gray-700"
                    style={{ fontSize: "24px", cursor: "pointer" }}
                    onClick={() => setShowConfirmPassword(true)}
                  />
                )}
                {showConfirmPassword && (
                  <AiFillEyeInvisible
                    className="cursor-pointer text-gray-700"
                    style={{ fontSize: "24px", cursor: "pointer" }}
                    onClick={() => setShowConfirmPassword(false)}
                  />
                )}
              </div>
              <p className="w-full text-center my-1" style={{ color: "red" }}>
                {warning}
              </p>
              <input
                type="submit"
                className="px-6 py-[6px] cursor-pointer w-[380px] hover:bg-[#c39010] rounded-[5px] bg-[#ECB31D] font-bold mt-2"
                value="SIGN UP"
              />
              {mounted && (
                <div className="mt-4 w-full flex justify-center items-center">
                  <GoogleOAuthProvider
                    clientId={import.meta.env.VITE_OAUTH_CLIENT_ID ?? ""}
                  >
                    <GoogleLogin
                      onSuccess={(credentialResponse) => {
                        const details = jwtDecode(
                          credentialResponse.credential ?? ""
                        ) as DecodedGoogleDetails;
                        console.log(details);
                        handleGoogleAuth(details);
                      }}
                      onError={() => {
                        console.log("Login Failed");
                      }}
                    />
                  </GoogleOAuthProvider>
                </div>
              )}
            </form>
          </div>
        </div>

        <div className="panels-container">
          <div className="panel left-panel">
            <div className="content">
              <h3>New here ?</h3>
              <p>
                You have to create an account first in order to start your
                journey with us
              </p>
              <button
                className="btn transparent"
                onClick={() => {
                  resetValues();
                  setIsSignUpMode(true);
                }}
              >
                Sign up
              </button>
            </div>
            <img src={RegImage} alt="reg" className="image" />
          </div>
          <div className="panel right-panel">
            <div className="content">
              <h3>One of us ?</h3>
              <p>
                You can sign in with your existing account and resume your
                journey with us
              </p>
              <button
                className="btn transparent"
                onClick={() => {
                  resetValues();
                  setIsSignUpMode(false);
                }}
              >
                Sign in
              </button>
            </div>
            <img src={LoginImage} alt="log" className="image" />
          </div>
        </div>
      </div>
    </>
  );
}