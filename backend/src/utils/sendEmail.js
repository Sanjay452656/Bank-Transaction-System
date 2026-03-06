const nodemailer = require('nodemailer')

const tranporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    }
});

const sendEmail = async (to, subject, html) => {
    try {
        const mailOptions = {
            from: `"Bank App" <${process.env.EMAIL_USER}>`,
            to,
            subject,
            html
        };

        const info = await transporter.sendEmail(mailOptions);

        console.log("Email sent",info.response);
        
    } catch (error) {
        console.error("Error",error);
    }
}

module.exports = sendEmail;