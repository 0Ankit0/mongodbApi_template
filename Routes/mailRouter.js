import { Router } from "express";
import express from "express";
import nodemailer from "nodemailer";

const mailRouter = Router();

var app = express();

mailRouter.get('/', async (req, res) => { //this is /sendmail/index page
    res.send("Welcome to the sendmail page");
});
mailRouter.post('/send', async (req, res) => {
    const { emailAddress, emailBody } = req.body;

    // Create a transporter using SMTP
    // const transporter = nodemailer.createTransport({
    //     host: 'smtp.example.com',
    //     port: 587,
    //     secure: false,
    //     auth: {
    //         user: 'your-email@example.com',
    //         pass: 'your-password'
    //     }
    // });
    //Or
    //Create a transporter Using Gmail and ensure that you have enabled "Less secure apps" in your Google account settings
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'your_email@gmail.com',
            pass: 'your_email_password',
        },
    });

    // Define the mail options
    const mailOptions = {
        from: 'your-email@example.com',
        to: emailAddress,
        subject: 'Mail Subject',
        text: emailBody
    };

    try {
        // Send the mail
        await transporter.sendMail(mailOptions);
        res.send("Mail sent successfully");
    } catch (error) {
        console.error(error);
        res.status(500).send("Failed to send mail");
    }
});
mailRouter.post('/send-multiple', async (req, res) => {
    const { emailAddresses, emailBody } = req.body;

    // Create a transporter using SMTP
    // const transporter = nodemailer.createTransport({
    //     host: 'smtp.example.com',
    //     port: 587,
    //     secure: false,
    //     auth: {
    //         user: 'your-email@example.com',
    //         pass: 'your-password'
    //     }
    // });
    //Or
    //Create a transporter Using Gmail and ensure that you have enabled "Less secure apps" in your Google account settings
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'your_email@gmail.com',
            pass: 'your_email_password',
        },
    });

    // Define the mail options
    const mailOptions = {
        from: 'your-email@example.com',
        to: emailAddresses.join(', '), // Join the email addresses with a comma
        subject: 'Mail Subject',
        text: emailBody
    };

    try {
        // Send the mail
        await transporter.sendMail(mailOptions);
        res.send("Mail sent successfully");
    } catch (error) {
        console.error(error);
        res.status(500).send("Failed to send mail");
    }
});
export default mailRouter;
