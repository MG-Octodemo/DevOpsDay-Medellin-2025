const nodemailer = require('nodemailer');

// Create a transporter using the defined email service
const transporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE,
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: process.env.EMAIL_PORT === 465,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});

// Format date for email
const formatDate = (date) => {
  return new Date(date).toLocaleString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZoneName: 'short'
  });
};

// Send registration confirmation email
exports.sendRegistrationConfirmation = async (email, name, talkTitle, talkTime) => {
  try {
    const formattedDate = formatDate(talkTime);
    
    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: email,
      subject: `Registration Confirmed: ${talkTitle}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Registration Confirmation</h2>
          <p>Hello ${name || 'there'},</p>
          <p>Your registration for the following talk at DevOpsDay Medellin 2025 has been confirmed:</p>
          <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <h3 style="margin-top: 0;">${talkTitle}</h3>
            <p><strong>Time:</strong> ${formattedDate}</p>
          </div>
          <p>Please arrive a few minutes early. We look forward to seeing you there!</p>
          <p>If you need to cancel your registration, you can do so from your account dashboard.</p>
          <p>Best regards,<br>The DevOpsDay Medellin Team</p>
        </div>
      `
    };
    
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent:', info.messageId);
    return info;
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
};

// Test email connection
exports.testConnection = async () => {
  try {
    await transporter.verify();
    return true;
  } catch (error) {
    console.error('Email connection error:', error);
    return false;
  }
};