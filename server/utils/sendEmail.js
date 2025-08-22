// utils/sendEmail.js
import nodemailer from 'nodemailer';

export async function sendEmail({ to, subject, html }) {
  try {
    // Create test account
    const testAccount = await nodemailer.createTestAccount();

    // Create reusable transporter
    const transporter = nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    });

    // Send the email
    const info = await transporter.sendMail({
      from: '"NourishNetwork" <noreply@nourish.com>',
      to,
      subject,
      html,
    });

    console.log('✅ Email sent:', info.messageId);
    console.log('📬 Preview URL:', nodemailer.getTestMessageUrl(info));
  } catch (err) {
    console.error('❌ Email Error:', err.message);
  }
}
