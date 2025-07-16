import { useEffect, useState } from "react";
import OtpInput from "./OtpInput";
import { Button } from "@/components/ui/button";
import { CgPassword } from "react-icons/cg";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

interface OtpProps {
  setShowOtp: (value: boolean) => void;
}

const Otp = ({ setShowOtp }: OtpProps) => {
  const [warning, setWarning] = useState<string>("");
  const [otp, setOtp] = useState<string>("");
  const [timeCount, setTimeCount] = useState<number>(180);
  const [email, setEmail] = useState<string>("");
  const router = useNavigate();
  const { isAuthenticated, setIsAuthenticated, setAuthenticationFlag } =
    useAuth();

  useEffect(() => {
    const otpObject: any = JSON.parse(
      localStorage.getItem("otpObject") ?? "null"
    );

    if (otpObject) {
      if (
        otpObject.type === "REGISTER" ||
        otpObject.type === "UPDATE_PASSWORD"
      ) {
        setEmail(otpObject.signupDto.id);
      } else if (otpObject.type === "FORGOT_PASSWORD") {
        setEmail(otpObject.id);
      }

      const currentTime = new Date().getTime();
      const timeElapsed = (currentTime - otpObject.timestamp) / 1000;
      const remainingTime = 180 - timeElapsed;

      if (remainingTime > 0) {
        setTimeCount(remainingTime);
      } else {
        localStorage.removeItem("otpObject");
        setShowOtp(false);
      }
    }

    const interval = setInterval(() => {
      setTimeCount((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (timeCount <= 0) {
      setShowOtp(false);
      localStorage.removeItem("otpObject");
    }
  }, [timeCount]);

  const handleCancel = () => {
    localStorage.removeItem("otpObject");
    setShowOtp(false);
  };

  const handleSubmit = async () => {
    if (otp.length !== 6) {
      setWarning("Please enter a valid otp");
      return;
    }

    const otpObject: any = JSON.parse(
      localStorage.getItem("otpObject") ?? "null"
    );
    let dataToSend: any;
    let username: string = "";
    let password: string = "";

    if (otpObject) {
      const { signupDto } = otpObject;

      dataToSend = {
        userEmail:
          otpObject.type === "REGISTER"
            ? signupDto.email
            : otpObject.type === "FORGOT_PASSWORD"
            ? otpObject.id
            : signupDto.email,
        otp: otp,
        type: otpObject.type,
      };

      if (
        otpObject.type === "REGISTER" ||
        otpObject.type === "UPDATE_PASSWORD"
      ) {
        username = signupDto.name;
        password = signupDto.password;
      }

      console.log("Data to send:", dataToSend);

      try {
        let response;

        response = await axios.post(
          `${import.meta.env.VITE_SERVER_URL}/auth/verify`,
          dataToSend
        );

        console.log("Response:", response);

        if (response?.status === 200) {
          if (otpObject.type === "REGISTER") {
            const user = otpObject.signupDto;
            await axios.post(
              `${import.meta.env.VITE_SERVER_URL}/auth/signup`,
              user
            );
          }

          localStorage.setItem("token", response.data.access_token);
          localStorage.setItem("id", response.data.used_id);
          localStorage.setItem("role", response.data.user_role);
          localStorage.setItem("userRole", response.data.user_role);
          // setToastMessage("OTP verification successfully");
          setIsAuthenticated && setIsAuthenticated(true);
          setAuthenticationFlag && setAuthenticationFlag(true);
          setShowOtp(false);
          localStorage.removeItem("otpObject");
          router("/");
        }
      } catch (error: any) {
        console.log("Error:", error);
        if (error.response?.status === 401) {
          setWarning(error.response.data.error);
        }
      }
    }
  };

  return (
    <div className="absolute top-0 left-0 w-[100vw] h-[100svh] bg-slate-200 bg-opacity-70 z-[500] flex justify-center items-center">
      <div className="w-full max-w-[370px] rounded bg-white shadow-md shadow-gray-500 max-h-[100svh] overflow-y-auto">
        <div className="w-full h-[2.3rem] bg-slate-500 flex items-center justify-end rounded-t">
          <div
            className="font-bold text-sm text-white h-[1.8rem] w-[1.8rem] mr-2 hover:bg-red-600 hover:rounded-full flex justify-center items-center cursor-pointer"
            onClick={handleCancel}
          >
            X
          </div>
        </div>
        <div className="mt-2 mb-2 flex flex-col items-center">
          <div className="flex justify-center items-center rounded-lg">
            <CgPassword className="text-[2.8rem] text-gray-700 mr-2" />
            <p className="font-serif text-[1.5rem] font-bold text-gray-700">
              OTP
            </p>
          </div>
          <p className="p-2 pt-0 font-serif text-[0.92rem]">{`An email with verification otp is sent to your mail ${email}. The otp will expire in next 3 minutes.\nPlease enter the otp to verify your email.`}</p>
          <p className="font-sans text-sm text-red-600 w-full text-center mt-2 mb-3">
            {warning}
          </p>
          <OtpInput otp={otp} setOtp={setOtp} />
          <p className="mt-2 font-bold text-[0.92rem] font-sans">
            {`Otp expires in ${timeCount.toFixed(0)} seconds`}
          </p>
          <div className="px-3 w-full" onClick={handleSubmit}>
            <Button className="mt-2 mb-2 w-full text-sm font-bold cursor-pointer">
              Verify OTP
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Otp;
