import { useState } from "react";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "../components/ui/input-otp";

interface OtpInputProps {
  otp: string;
  setOtp: (value: string) => void;
}

export default function OtpInput({ otp, setOtp }: OtpInputProps) {
  const [otpValues, setOtpValues] = useState<string[]>([
    "",
    "",
    "",
    "",
    "",
    "",
  ]);

  const handleChange = (index: number, value: string) => {
    const newOtpValues = [...otpValues];
    newOtpValues[index] = value;
    setOtpValues(newOtpValues);

    const newOtp = newOtpValues.join("");
    setOtp(newOtp);
  };

  return (
    <InputOTP
      maxLength={6}
      value={otp}
      onChange={(value: string) => setOtp(value)}
    >
      <InputOTPGroup>
        {[0, 1, 2].map((index) => (
          <InputOTPSlot
            key={index}
            index={index}
            value={otpValues[index]}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              handleChange(index, e.target.value)
            }
            {...(undefined as any)}
          />
        ))}
      </InputOTPGroup>
      <InputOTPSeparator />
      <InputOTPGroup>
        {[3, 4, 5].map((index) => (
          <InputOTPSlot
            key={index}
            index={index}
            value={otpValues[index]}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              handleChange(index, e.target.value)
            }
            {...(undefined as any)}
          />
        ))}
      </InputOTPGroup>
    </InputOTP>
  );
}
