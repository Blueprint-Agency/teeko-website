import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const transporter = nodemailer.createTransport({
    service: process.env.SMTP_SERVICE, // e.g., 'gmail'
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || "465"),
    secure: true, // true for 465, false for other ports
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
});

export const sendVerificationEmail = async (email: string, code: string) => {
    const mailOptions = {
        from: '"Teeko" <no-reply@teeko.ai>',
        to: email,
        subject: "Your Verification Code - Teeko",
        html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
        <h1 style="color: #ef4444; text-align: center;">Welcome to Teeko!</h1>
        <p style="font-size: 16px; color: #333;">Please verify your email address by entering the code below:</p>
        <div style="background-color: #f9fafb; padding: 20px; text-align: center; border-radius: 8px; margin: 20px 0;">
          <span style="font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #111;">${code}</span>
        </div>
        <p style="font-size: 14px; color: #666;">This code will expire in 3 minutes.</p>
        <p style="font-size: 14px; color: #666;">If you did not create an account, please ignore this email.</p>
      </div>
    `,
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`Verification email sent to ${email}`);
    } catch (error) {
        console.error("Error sending email:", error);
        throw new Error("Could not send verification email");
    }
};
