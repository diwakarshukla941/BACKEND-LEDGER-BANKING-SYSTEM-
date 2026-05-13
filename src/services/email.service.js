const nodemailer = require('nodemailer');
require("dotenv").config();

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        type: "OAuth2",
        user: process.env.EMAIL_USER,
        clientId: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
        refreshToken: process.env.REFRESH_TOKEN
    }
})


// verify connection configuration


transporter.verify((error, success) => {
    if (error) {
        console.log(error);
    } else {
        console.log("Ready to send email");
    }
})


const sendEmail = async (to, subject, text, html) => {
    try {
        const info = await transporter.sendMail({
            from: `Backend Ledger <${process.env.EMAIL_USER}>`,
            to,
            subject,
            text,
            html
        })
        console.log("Email sent:%s ", info.response);
        console.log("preview URL: %s", nodemailer.getTestMessageUrl(info));
    } catch (error) {
        console.log(error);
    }
}

async function sendRegisterationEmail(userEmail, name) {
    const subject = "Welcome to Backend Ledger";
    const text = `Hi ${name},\n\nWelcome to Backend Ledger! We're excited to have you on board. If you have any questions or need assistance, feel free to reach out.\n\nBest regards,\nThe Backend Ledger Team`;
    const html = `<p>Hi ${name},</p><p>Welcome to Backend Ledger! We're excited to have you on board. If you have any questions or need assistance, feel free to reach out.</p><p>Best regards,<br>The Backend Ledger Team</p>`;

    await sendEmail(userEmail, subject, text, html);
}

async function sendTransactionEmail(userEmail, name, amount, toAccount) {
    const subject = "Transaction Alert";
    const text = `Hi ${name},\n\nYou have sent ${amount} to account ${toAccount}.\n\nBest regards,\nThe Backend Ledger Team`;
    const html = `<p>Hi ${name},</p><p>You have sent ${amount} to account ${toAccount}.</p><p>Best regards,<br>The Backend Ledger Team</p>`;

    await sendEmail(userEmail, subject, text, html);
}

async function sendTransactionFailureEmail(userEmail, name, amount, toAccount) {
    const subject = "Transaction Failed Alert";
    const text = `Hi ${name},\n\nYour transaction of ${amount} to account ${toAccount} has failed. Please check your account and try again.\n\nBest regards,\nThe Backend Ledger Team`;
    const html = `<p>Hi ${name},</p><p>Your transaction of ${amount} to account ${toAccount} has failed. Please check your account and try again.</p><p>Best regards,<br>The Backend Ledger Team</p>`;

    await sendEmail(userEmail, subject, text, html);
}   


module.exports = { sendRegisterationEmail, sendTransactionEmail, sendTransactionFailureEmail, sendEmail }; 