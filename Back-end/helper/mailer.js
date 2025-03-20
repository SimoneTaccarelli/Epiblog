import nodeMailer from 'nodemailer';
import dotenv from 'dotenv';

const transporter = nodeMailer.createTransport({
    host : process.env.EMAIL_HOST,
    port : process.env.EMAIL_PORT,
    auth : {
        user : process.env.EMAIL_USER,
        pass : process.env.EMAIL_PASSWORD
    },   
});

export default transporter;