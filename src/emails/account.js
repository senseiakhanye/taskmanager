const sgMail = require('@sendgrid/mail');


sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendConfirmEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: 'kakhanye@gmail.com',
        subject: 'This is my first creation',
        text: `Welcome ${name}, hope you enjoy this`
    });
}

module.exports = {
    sendConfirmEmail
}