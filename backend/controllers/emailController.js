
const nodemailer = require('nodemailer');
const Settings = require('../models/Settings');

const sendWelcomeEmail = async (user) => {
    try {
        const settings = await Settings.findOne();
        const brandName = settings?.brandName || 'Phallbun';
        const brandLogo = settings?.brandLogo || 'https://cdn-icons-png.flaticon.com/512/3081/3081559.png';
        const companyEmail = settings?.companyEmail || 'support@phallbun.com';
        const companyAddress = settings?.companyAddress || '';

        // CONFIGURATION: Replace with your actual SMTP details
        const transporter = nodemailer.createTransport({
            service: 'gmail', 
            auth: {
                user: 'your-email@gmail.com', // REPLACE THIS
                pass: 'your-app-password'      // REPLACE THIS
            }
        });

        const mailOptions = {
            from: `"${brandName}" <${companyEmail}>`,
            to: user.email,
            subject: `Welcome to ${brandName}!`,
            html: `
                <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #ffffff; border: 1px solid #e5e7eb; border-radius: 12px; overflow: hidden;">
                    <div style="text-align: center; padding: 40px 20px; background-color: #f9fafb; border-bottom: 1px solid #e5e7eb;">
                        <img src="${brandLogo}" alt="${brandName}" style="max-height: 60px; width: auto; display: block; margin: 0 auto;" />
                    </div>
                    <div style="padding: 40px 30px;">
                        <h1 style="color: #111827; font-size: 24px; font-weight: bold; margin-bottom: 20px; text-align: center;">Welcome, ${user.name}!</h1>
                        <p style="color: #4b5563; font-size: 16px; line-height: 1.6; margin-bottom: 24px;">
                            Thank you for creating an account with <strong>${brandName}</strong>. We are thrilled to welcome you to our exclusive community of shoppers.
                        </p>
                        <div style="text-align: center;">
                            <a href="http://localhost:3000" style="display: inline-block; background-color: #4f46e5; color: #ffffff; padding: 14px 30px; border-radius: 8px; font-weight: bold; text-decoration: none; font-size: 16px;">Start Shopping</a>
                        </div>
                    </div>
                    <div style="background-color: #f9fafb; padding: 20px; text-align: center; border-top: 1px solid #e5e7eb;">
                        <p style="color: #9ca3af; font-size: 12px; margin: 0;">
                            &copy; ${new Date().getFullYear()} ${brandName}. All rights reserved.<br>
                            ${companyAddress}
                        </p>
                    </div>
                </div>
            `
        };

        await transporter.sendMail(mailOptions);
        console.log(`📧 Welcome email sent successfully to ${user.email}`);

    } catch (error) {
        console.error("⚠️ Email sending failed (Check SMTP Config):", error.message);
    }
};

module.exports = { sendWelcomeEmail };
