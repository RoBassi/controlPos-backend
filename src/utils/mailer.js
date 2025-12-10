import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    service: 'Gmail', // O lo que se use en .env
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

export const sendEmail = async ({ to, subject, text }) => {
    try {
        await transporter.sendMail({
            from: `"Soporte ControlPOS" <${process.env.EMAIL_USER}>`,
            to,
            subject,
            text
        });
        return true;
    } catch (error) {
        console.error("Error enviando email:", error);
        return false;
    }
};