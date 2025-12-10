import nodemailer from 'nodemailer';

// --- AGREGA ESTO PARA DEPURAR (BORRAR LUEGO) ---
console.log("---- DEBUG MAILER ----");
console.log("User:", process.env.EMAIL_USER);
// Solo mostramos los primeros y últimos caracteres por seguridad visual
const pass = process.env.EMAIL_PASS || "";
console.log("Pass:", pass.substring(0, 3) + "..." + pass.substring(pass.length - 3));
console.log("----------------------");
// --
const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true, // true para 465, false para otros puertos
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