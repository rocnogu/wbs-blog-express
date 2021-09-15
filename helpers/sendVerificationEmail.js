import VerificationCode from '../models/VerificationCode.js';
import nodemailer from 'nodemailer';

export default async function sendVerificationEmail(user) {
    const {User_Email, _id} = user;
    const newVerificationCode = Math.floor(Math.random() * 899999) + 100000
    
    await VerificationCode.create({
        user_id: _id,
        code: newVerificationCode,
        valid: true
    })

    var transporter = nodemailer.createTransport({
        host: 'smtp.abv.bg',
        port: 465,
        secure: true,
        auth: {
          user: process.env.dev_email,
          pass: process.env.dev_password
        }
    });
    
    try {
        var mailOptions = {
            from: 'rocnogu@abv.bg', 
            to: User_Email,
            subject: 'Please Confirm Your rocnogu Account',
            text: `Hi there! One more step. Please click on this verification email: http://localhost:6969/users/verify?verification_code=${newVerificationCode}`,
            html: "<h1> test html email send </h1>"
        };
        transporter.sendMail(mailOptions, function(error, info){
            if (error) {
                console.log(error);
                throw  new Error (error.message)
            } else {
                console.log('Email sent: ' + info.response);
                return 
            }
        });
    } catch(e) {
        console.log(e);
        throw new Error("there was an error generating email verification stuff")
    }
}