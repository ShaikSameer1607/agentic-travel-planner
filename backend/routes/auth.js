import express from "express";
import nodemailer from "nodemailer";

const router = express.Router();

// Store OTPs in memory (in production, use a database)
const otpStore = new Map();

// Generate a random 6-digit OTP
function generateOTP() {
  return Math.floor(1000 + Math.random() * 9000).toString();
}

// Configure nodemailer transporter
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.gmail.com",
  port: parseInt(process.env.SMTP_PORT) || 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Send OTP endpoint
router.post("/send-otp", async (req, res) => {
  try {
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({ 
        success: false, 
        message: "Email is required" 
      });
    }

    // Generate OTP
    const otp = generateOTP();
    
    // Store OTP with expiration (5 minutes)
    const expiresAt = Date.now() + 5 * 60 * 1000;
    otpStore.set(email, { otp, expiresAt });
    
    console.log(`🔐 Generated OTP for ${email}: ${otp}`);
    
    // Send email (if credentials are configured)
    if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
      try {
        await transporter.sendMail({
          from: process.env.EMAIL_USER,
          to: email,
          subject: "Your Agentic Travel Planner OTP",
          text: `Your OTP code is: ${otp}\n\nThis code will expire in 5 minutes.`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h2 style="color: #2EF8FF;">Agentic Travel Planner</h2>
              <p>Your OTP code is:</p>
              <h1 style="color: #FF3C88; font-size: 36px; letter-spacing: 5px;">${otp}</h1>
              <p>This code will expire in 5 minutes.</p>
              <hr>
              <p style="font-size: 12px; color: #666;">
                If you didn't request this code, please ignore this email.
              </p>
            </div>
          `,
        });
        
        console.log(`📧 OTP sent to ${email}`);
      } catch (emailError) {
        console.error("📧 Email sending failed:", emailError.message);
        // Don't fail the request if email fails, just log it
      }
    } else {
      console.log("📧 Email credentials not configured - skipping email send");
    }
    
    res.json({ 
      success: true, 
      message: "OTP sent successfully (check console logs if email not configured)" 
    });
  } catch (error) {
    console.error("❌ OTP generation error:", error);
    res.status(500).json({ 
      success: false, 
      message: "Failed to generate OTP" 
    });
  }
});

// Verify OTP endpoint
router.post("/verify-otp", (req, res) => {
  try {
    const { email, otp } = req.body;
    
    if (!email || !otp) {
      return res.status(400).json({ 
        success: false, 
        message: "Email and OTP are required" 
      });
    }

    // When email services are not configured, accept any OTP for testing
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      // For testing purposes, we'll accept any 4-digit OTP
      if (otp.length === 4 && /^\d+$/.test(otp)) {
        res.json({ 
          success: true, 
          message: "OTP verified successfully (test mode)" 
        });
      } else {
        return res.status(400).json({ 
          success: false, 
          message: "Please enter a 4-digit OTP for testing" 
        });
      }
    } else {
      // Normal verification when email is configured
      const storedOTP = otpStore.get(email);
      
      if (!storedOTP) {
        return res.status(400).json({ 
          success: false, 
          message: "OTP not found or expired" 
        });
      }
      
      // Check if OTP is expired
      if (Date.now() > storedOTP.expiresAt) {
        otpStore.delete(email);
        return res.status(400).json({ 
          success: false, 
          message: "OTP has expired" 
        });
      }
      
      // Check if OTP matches
      if (storedOTP.otp !== otp) {
        return res.status(400).json({ 
          success: false, 
          message: "Invalid OTP" 
        });
      }
      
      // Clear OTP after successful verification
      otpStore.delete(email);
      
      res.json({ 
        success: true, 
        message: "OTP verified successfully" 
      });
    }
  } catch (error) {
    console.error("❌ OTP verification error:", error);
    res.status(500).json({ 
      success: false, 
      message: "Failed to verify OTP" 
    });
  }
});

// Resend OTP endpoint
router.post("/resend-otp", (req, res) => {
  const { email } = req.body;
  
  if (!email) {
    return res.status(400).json({ 
      success: false, 
      message: "Email is required" 
    });
  }

  // Check if there's an existing OTP
  if (!otpStore.has(email)) {
    return res.status(400).json({ 
      success: false, 
      message: "No OTP request found for this email" 
    });
  }

  // Generate new OTP
  const otp = generateOTP();
  const expiresAt = Date.now() + 5 * 60 * 1000;
  otpStore.set(email, { otp, expiresAt });
  
  console.log(`🔐 Resent OTP for ${email}: ${otp}`);
  
  res.json({ 
    success: true, 
    message: "OTP resent successfully" 
  });
});

export default router;