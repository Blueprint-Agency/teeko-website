import nodemailer from "nodemailer";
import dotenv from "dotenv";
import QRCode from "qrcode";

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

export const sendBookingConfirmation = async (email: string, packageName: string, quantity: string, price: string, verificationCode: string, collectionDate?: string) => {
  // Extract numeric value from price string (e.g., "RM 50" -> 50)
  const priceValue = parseFloat(price.replace(/[^0-9.]/g, '')) || 0;
  const currency = price.replace(/[0-9.]/g, '').trim() || "RM";
  const total = (priceValue * parseInt(quantity)).toFixed(2);

  const formattedCollectionDate = collectionDate ? new Date(collectionDate).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    timeZone: 'Asia/Singapore'
  }) : null;

  // Generate QR code as buffer for CID attachment (works with Gmail)
  let qrCodeBuffer: Buffer | null = null;
  try {
    qrCodeBuffer = await QRCode.toBuffer(verificationCode, {
      width: 200,
      margin: 2,
      color: {
        dark: '#000000',
        light: '#ffffff'
      }
    });
  } catch (qrError) {
    console.error("Error generating QR code:", qrError);
    // Continue without QR code if generation fails
  }

  // QR code HTML using CID reference (cid:qrcode)
  const qrCodeHtml = qrCodeBuffer
    ? `<img src="cid:qrcode" alt="QR Code" width="150" height="150" style="display: block; margin: 0 auto;" />`
    : `<p style="font-size: 12px; color: #999;">(QR code could not be generated)</p>`;

  // Prepare attachments for CID embedding
  const attachments = qrCodeBuffer ? [
    {
      filename: 'qrcode.png',
      content: qrCodeBuffer,
      cid: 'qrcode' // This is the CID referenced in the HTML as src="cid:qrcode"
    }
  ] : [];

  const mailOptions = {
    from: '"Teeko" <no-reply@teeko.ai>',
    to: email,
    subject: "Booking Confirmation - Teeko Travel SIM",
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
        <h1 style="color: #ef4444; text-align: center;">Booking Confirmed!</h1>
        <p style="font-size: 16px; color: #333;">Your Travel SIM booking has been successfully placed.</p>
        
        <div style="background-color: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="margin-top: 0; color: #111;">Order Summary</h3>
          <p style="margin: 5px 0;"><strong>Package:</strong> ${packageName}</p>
          <p style="margin: 5px 0;"><strong>Unit Price:</strong> ${price}</p>
          <p style="margin: 5px 0;"><strong>Quantity:</strong> ${quantity}</p>
          ${formattedCollectionDate ? `<p style="margin: 5px 0;"><strong>Collection Date:</strong> ${formattedCollectionDate}</p>` : ''}
          <hr style="border: none; border-top: 1px solid #ddd; margin: 15px 0;">
          <p style="margin: 5px 0; font-size: 18px;"><strong>Total Price:</strong> ${currency} ${total}</p>
        </div>

        <div style="text-align: center; padding: 20px; border: 2px dashed #ef4444; border-radius: 8px; margin-top: 20px;">
          <h3 style="margin-top: 0; color: #ef4444;">Verification Code</h3>
          <p style="font-size: 14px; color: #666; margin-bottom: 10px;">Show this to the administrator to complete your booking:</p>
          <div style="font-size: 28px; font-weight: bold; letter-spacing: 3px; color: #111; margin-bottom: 20px; font-family: monospace;">${verificationCode}</div>
          ${qrCodeHtml}
        </div>
        
        <p style="font-size: 14px; color: #666; margin-top: 20px;">You can also view this code in your profile page on our website.</p>
      </div>
    `,
    attachments: attachments
  };


  try {
    await transporter.sendMail(mailOptions);
    console.log(`Booking confirmation sent to ${email}`);
  } catch (error) {
    console.error("Error sending booking email:", error);
    throw new Error("Could not send booking confirmation email");
  }
};

export const sendCancellationEmail = async (email: string, packageName: string) => {
  const mailOptions = {
    from: '"Teeko" <no-reply@teeko.ai>',
    to: email,
    subject: "Booking Cancelled - Teeko Travel SIM",
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
        <h1 style="color: #666; text-align: center;">Booking Cancelled</h1>
        <p style="font-size: 16px; color: #333;">Your Travel SIM booking for <strong>${packageName}</strong> has been cancelled.</p>
        <p style="font-size: 14px; color: #666;">If this wasn't you, please contact support.</p>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Cancellation email sent to ${email}`);
  } catch (error) {
    console.error("Error sending cancellation email:", error);
    throw new Error("Could not send cancellation email");
  }
};

export const sendAdminInvitationEmail = async (email: string, password: string) => {
  const loginUrl = `${process.env.FRONTEND_URL || 'https://teeko.ai'}/admin/auth/login`;

  const mailOptions = {
    from: '"Teeko Admin" <no-reply@teeko.ai>',
    to: email,
    subject: "Invitation to Teeko Administration Panel",
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
        <h1 style="color: #ef4444; text-align: center;">Admin Access Granted</h1>
        <p style="font-size: 16px; color: #333;">You have been added as an administrator for the Teeko platform.</p>
        
        <div style="background-color: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="margin-top: 0; color: #111;">Your Login Credentials</h3>
          <p style="margin: 5px 0;"><strong>Email:</strong> ${email}</p>
          <p style="margin: 5px 0;"><strong>Temporary Password:</strong> ${password}</p>
        </div>

        <div style="text-align: center; margin-top: 30px;">
          <a href="${loginUrl}" style="background-color: #ef4444; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">Login to Dashboard</a>
        </div>
        
        <p style="font-size: 12px; color: #666; margin-top: 30px; text-align: center;">
          For security reasons, please change your password immediately after your first login.
        </p>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Admin invitation email sent to ${email}`);
  } catch (error) {
    console.error("Error sending admin invitation email:", error);
    throw new Error("Could not send admin invitation email");
  }
};
