import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function OTP() {
  const [otpInput, setOtpInput] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    // If user refreshes OTP page without login
    const storedEmail = sessionStorage.getItem("email");
    if (!storedEmail) {
      navigate("/login");
    }
  }, [navigate]);

  const verifyOTP = () => {
    const storedOTP = sessionStorage.getItem("otp");

    if (!otpInput) {
      setError("Please enter OTP");
      return;
    }

    if (otpInput.length !== 6) {
      setError("OTP must be 6 digits");
      return;
    }

    if (otpInput === storedOTP) {
      // ✅ Clear OTP after success
      sessionStorage.removeItem("otp");

      // Optional: mark user as authenticated
      sessionStorage.setItem("authenticated", "true");

      navigate("/dashboard");
    } else {
      setError("Invalid OTP. Please try again.");
    }
  };

  return (
    <div className="min-h-screen gradient-bg flex justify-center items-center text-white px-4">
      <div className="glass backdrop-blur-xl p-8 rounded-2xl w-96 text-center shadow-2xl animate-fadeIn glow-purple">
        <div className="text-4xl mb-4">🔒</div>
        <h2 className="text-3xl font-semibold mb-2 text-neonPurple">
          Verify OTP
        </h2>

        <p className="text-sm text-gray-400 mb-6">
          Enter the 6-digit OTP sent to your email
        </p>

        <input
          type="text"
          maxLength={6}
          value={otpInput}
          onChange={(e) => {
            setOtpInput(e.target.value);
            setError("");
          }}
          placeholder="● ● ● ● ● ●"
          className="w-full p-4 text-center tracking-widest text-xl rounded-lg bg-black/40 outline-none text-white focus:ring-2 focus:ring-neonPurple"
        />

        {error && (
          <p className="text-red-400 text-sm mt-3 animate-pulse">
            ⚠️ {error}
          </p>
        )}

        <button
          onClick={verifyOTP}
          className="mt-6 w-full bg-gradient-to-r from-neonPurple to-neonBlue py-4 rounded-xl font-semibold hover:scale-105 transition glow-purple"
        >
          ✔️ Verify OTP
        </button>

        <p className="text-xs text-gray-500 mt-6">
          🕒 OTP is valid for this session only
        </p>
      </div>
    </div>
  );
}
