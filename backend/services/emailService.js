const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: process.env.SMTP_PORT || 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  },
  tls: {
    rejectUnauthorized: false // Only for development
  }
});

// Verify connection
transporter.verify((error, success) => {
  if (error) {
    console.log('Email service error:', error.message);
  } else {
    console.log('Email service ready');
  }
});

const generateTicketId = () => {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  return `KWK-${year}${month}${day}-${random}`;
};

const sendContactEmail = async ({ name, email, subject, message, priority, ticketId }) => {
  try {
    // Email to support team
    const supportMailOptions = {
      from: `"Kweek Earn Support" <${process.env.SMTP_USER}>`,
      to: process.env.SUPPORT_EMAIL,
      subject: `[${ticketId}] ${subject} - ${priority} Priority`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2d5a27;">New Contact Form Submission</h2>
          <p><strong>Ticket ID:</strong> ${ticketId}</p>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Subject:</strong> ${subject}</p>
          <p><strong>Priority:</strong> ${priority}</p>
          <p><strong>Message:</strong></p>
          <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px;">
            ${message.replace(/\n/g, '<br>')}
          </div>
        </div>
      `
    };

    // Auto-reply to user
    const userMailOptions = {
      from: `"Kweek Earn Support" <${process.env.SMTP_USER}>`,
      to: email,
      subject: `[${ticketId}] We received your message`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2d5a27;">Thank you for contacting Kweek Earn</h2>
          <p>Dear ${name},</p>
          <p>We have received your message and will get back to you within 24-48 hours.</p>
          <p><strong>Ticket ID:</strong> ${ticketId}</p>
          <p><strong>Subject:</strong> ${subject}</p>
          <p><strong>Your message:</strong></p>
          <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px;">
            ${message.replace(/\n/g, '<br>')}
          </div>
          <p>Please quote your ticket ID in any future correspondence.</p>
          <p>Best regards,<br>Kweek Earn Support Team</p>
        </div>
      `
    };

    // Send emails
    await transporter.sendMail(supportMailOptions);
    await transporter.sendMail(userMailOptions);
    
    return { success: true, ticketId };
  } catch (error) {
    console.error('Email sending error:', error);
    throw error;
  }
};

module.exports = {
  sendContactEmail,
  generateTicketId
};
