import { useState } from "react";
import { useNavigate } from "react-router-dom";
import emailjs from "@emailjs/browser";

export default function Login() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const sendOTP = async () => {
    if (!email) {
      alert("Please enter your email");
      return;
    }

    // 🔎 ENV SAFETY CHECK (VERY IMPORTANT)
    const SERVICE_ID = process.env.REACT_APP_EMAILJS_SERVICE_ID;
    const TEMPLATE_ID = process.env.REACT_APP_EMAILJS_TEMPLATE_ID;
    const PUBLIC_KEY = process.env.REACT_APP_EMAILJS_PUBLIC_KEY;

    console.log("ENV CHECK:", {
      SERVICE_ID,
      TEMPLATE_ID,
      PUBLIC_KEY,
    });

    if (!SERVICE_ID || !TEMPLATE_ID || !PUBLIC_KEY) {
      alert(
        "EmailJS environment variables are missing.\nCheck .env file and restart server."
      );
      return;
    }

    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    setLoading(true);

    try {
      const response = await emailjs.send(
        SERVICE_ID,
        TEMPLATE_ID,
        {
          to_email: email, // MUST match {{to_email}}
          otp: otp,        // MUST match {{otp}}
        },
        PUBLIC_KEY
      );

      console.log("EmailJS SUCCESS:", response);

      // Store OTP temporarily (session-based)
      sessionStorage.setItem("otp", otp);
      sessionStorage.setItem("email", email);

      navigate("/otp");
    } catch (error) {
      console.error("EmailJS ERROR:", error);
      alert("Failed to send OTP. Check EmailJS service/template.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen gradient-bg flex justify-center items-center text-white px-4">
      <div className="glass backdrop-blur-xl p-8 rounded-2xl w-96 text-center shadow-2xl glow-blue">
        <div className="text-4xl mb-4">💌</div>
        <h2 className="text-3xl font-semibold mb-2 text-neonBlue">
          Welcome Back
        </h2>
        <p className="text-gray-400 text-sm mb-6">
          Enter your email to get started
        </p>

        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-4 rounded-lg bg-black/40 outline-none text-white placeholder-gray-400 focus:ring-2 focus:ring-neonBlue mb-4"
        />

        <button
          onClick={sendOTP}
          disabled={loading}
          className="mt-2 w-full bg-gradient-to-r from-neonPurple to-neonBlue py-4 rounded-xl hover:scale-105 transition disabled:opacity-50 font-semibold glow-purple"
        >
          {loading ? "✉️ Sending OTP..." : "🚀 Send OTP"}
        </button>

        <p className="text-sm text-gray-400 mt-6">
          A 6-digit OTP will be sent to your email
        </p>
      </div>
    </div>
  );
}
