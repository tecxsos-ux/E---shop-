
const nodemailer = require('nodemailer');
const Settings = require('../models/Settings');
const User = require('../models/User');

// Helper to get transport (Reused)
const getTransporter = () => {
    return nodemailer.createTransport({
        service: 'gmail', 
        auth: {
            user: 'your-email@gmail.com', // REPLACE THIS
            pass: 'your-app-password'      // REPLACE THIS
        }
    });
};

const sendWelcomeEmail = async (user) => {
    try {
        const settings = await Settings.findOne();
        const brandName = settings?.brandName || 'Phallbun';
        const brandLogo = settings?.brandLogo || 'https://cdn-icons-png.flaticon.com/512/3081/3081559.png';
        const companyEmail = settings?.companyEmail || 'support@phallbun.com';

        const transporter = getTransporter();

        const mailOptions = {
            from: `"${brandName}" <${companyEmail}>`,
            to: user.email,
            subject: `Welcome to ${brandName}!`,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #eee; border-radius: 8px;">
                    <div style="padding: 20px; text-align: center; background-color: #f9fafb;">
                        <img src="${brandLogo}" alt="${brandName}" style="height: 50px;" />
                    </div>
                    <div style="padding: 30px;">
                        <h2>Welcome, ${user.name}!</h2>
                        <p>Thank you for joining us. We are excited to have you on board.</p>
                        <a href="http://localhost:3000" style="display:inline-block; background: #4f46e5; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Start Shopping</a>
                    </div>
                </div>
            `
        };

        await transporter.sendMail(mailOptions);
        console.log(`📧 Welcome email sent to ${user.email}`);
    } catch (error) {
        console.error("⚠️ Email Error:", error.message);
    }
};

const sendOrderInvoiceEmail = async (order) => {
    try {
        const settings = await Settings.findOne();
        const brandName = settings?.brandName || 'Phallbun';
        const brandLogo = settings?.brandLogo || 'https://cdn-icons-png.flaticon.com/512/3081/3081559.png';
        const companyEmail = settings?.companyEmail || 'support@phallbun.com';
        const companyAddress = settings?.companyAddress || '';
        const primaryColor = settings?.primaryColor || '#4f46e5';

        // Determine recipient email (Prioritize guest email on order, then lookup user)
        let recipientEmail = order.customerEmail;
        if (!recipientEmail && order.userId !== 'guest') {
            const user = await User.findOne({ id: order.userId });
            if (user) recipientEmail = user.email;
        }

        if (!recipientEmail) {
            console.log("⚠️ No email found for order invoice");
            return;
        }

        const transporter = getTransporter();

        // Build Items HTML
        const itemsHtml = order.items.map(item => `
            <tr style="border-bottom: 1px solid #eee;">
                <td style="padding: 10px;">
                    <div style="font-weight: bold;">${item.name}</div>
                    <div style="font-size: 12px; color: #666;">
                        ${item.selectedColor ? `Color: ${item.selectedColor} ` : ''} 
                        ${item.selectedSize ? `Size: ${item.selectedSize}` : ''}
                    </div>
                </td>
                <td style="padding: 10px; text-align: center;">${item.quantity}</td>
                <td style="padding: 10px; text-align: right;">$${item.price.toFixed(2)}</td>
                <td style="padding: 10px; text-align: right;">$${(item.price * item.quantity).toFixed(2)}</td>
            </tr>
        `).join('');

        const mailOptions = {
            from: `"${brandName}" <${companyEmail}>`,
            to: recipientEmail,
            subject: `Invoice for Order #${order.id}`,
            html: `
                <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #ffffff; border: 1px solid #e5e7eb; border-radius: 8px; overflow: hidden;">
                    
                    <!-- Header -->
                    <div style="background-color: #f9fafb; padding: 30px; border-bottom: 1px solid #e5e7eb; display: flex; align-items: center; justify-content: space-between;">
                        <div>
                             <img src="${brandLogo}" alt="${brandName}" style="max-height: 40px; display: block;" />
                             <div style="font-weight: bold; color: ${primaryColor}; margin-top: 5px; font-size: 18px;">${brandName}</div>
                        </div>
                        <div style="text-align: right;">
                            <h2 style="margin: 0; color: #333;">INVOICE</h2>
                            <p style="margin: 5px 0 0; color: #666; font-size: 14px;">#${order.id}</p>
                        </div>
                    </div>

                    <!-- Info -->
                    <div style="padding: 30px;">
                        <div style="display: flex; justify-content: space-between; margin-bottom: 30px;">
                            <div style="width: 48%; font-size: 14px; color: #555;">
                                <strong>Bill To:</strong><br>
                                ${order.shippingAddress.line1}<br>
                                ${order.shippingAddress.city}, ${order.shippingAddress.postalCode}<br>
                                ${order.shippingAddress.country}
                            </div>
                            <div style="width: 48%; font-size: 14px; color: #555; text-align: right;">
                                <strong>Date:</strong> ${new Date(order.date).toLocaleDateString()}<br>
                                <strong>Status:</strong> ${order.status}
                            </div>
                        </div>

                        <!-- Items Table -->
                        <table style="width: 100%; border-collapse: collapse; font-size: 14px; margin-bottom: 30px;">
                            <thead>
                                <tr style="background-color: #f3f4f6;">
                                    <th style="padding: 10px; text-align: left;">Item</th>
                                    <th style="padding: 10px; text-align: center;">Qty</th>
                                    <th style="padding: 10px; text-align: right;">Price</th>
                                    <th style="padding: 10px; text-align: right;">Total</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${itemsHtml}
                            </tbody>
                        </table>

                        <!-- Totals -->
                        <div style="border-top: 2px solid #eee; pt-4;">
                            <table style="width: 100%; font-size: 14px;">
                                <tr>
                                    <td style="text-align: right; padding: 5px;">Subtotal:</td>
                                    <td style="text-align: right; padding: 5px; width: 100px;">$${order.subtotal.toFixed(2)}</td>
                                </tr>
                                <tr>
                                    <td style="text-align: right; padding: 5px;">Tax:</td>
                                    <td style="text-align: right; padding: 5px; width: 100px;">$${order.tax.toFixed(2)}</td>
                                </tr>
                                <tr>
                                    <td style="text-align: right; padding: 5px;">Shipping:</td>
                                    <td style="text-align: right; padding: 5px; width: 100px;">$${order.shippingCost.toFixed(2)}</td>
                                </tr>
                                <tr style="font-weight: bold; font-size: 16px; color: ${primaryColor};">
                                    <td style="text-align: right; padding: 10px 5px;">Total:</td>
                                    <td style="text-align: right; padding: 10px 5px;">$${order.total.toFixed(2)}</td>
                                </tr>
                            </table>
                        </div>
                    </div>

                    <!-- Footer -->
                    <div style="background-color: #111827; color: #ffffff; padding: 20px; text-align: center; font-size: 12px;">
                        <p style="margin: 0;">Thank you for your purchase!</p>
                        <p style="margin: 5px 0 0; opacity: 0.7;">${companyAddress}</p>
                    </div>
                </div>
            `
        };

        await transporter.sendMail(mailOptions);
        console.log(`📧 Invoice sent to ${recipientEmail}`);

    } catch (error) {
        console.error("⚠️ Invoice Email Error:", error.message);
    }
};

module.exports = { sendWelcomeEmail, sendOrderInvoiceEmail };
