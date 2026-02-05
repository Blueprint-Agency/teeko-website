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

export const sendVerificationEmail = async (email: string, token: string) => {
    const verificationUrl = `http://localhost:3010/auth/verify?token=${token}`;

    const mailOptions = {
        from: '"Teeko" <no-reply@teeko.ai>',
        to: email,
        subject: "Verify your email address",
        html: `
      <h1>Welcome to Teeko!</h1>
      <p>Please verify your email address by clicking the link below:</p>
      <a href="${verificationUrl}">Verify Email</a>
      <p>If you did not create an account, please ignore this email.</p>
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
