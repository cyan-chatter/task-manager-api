const sgMail = require('@sendgrid/mail')
sgMail.setApiKey(process.env.SENDGRID_API_KEY)

// sgMail.send({
//     to:'sayanchatterjee2000@gmail.com',
//     from:'sayanchatterjee_2k19co348@dtu.ac.in',
//     subject:'This is my first Sendgrid Mail',
//     text:'Hope this reaches you'
// })

const sendWelcomeEmail = (email,name)=>{
    sgMail.send({
        to: email,
        from: 'sayanchatterjee_2k19co348@dtu.ac.in',
        subject: 'Thanks for joining in',
        text: `Welcome to the app, ${name}. Let me know how you get along with the app`
    })
}

const sendCancellationEmail = (email,name)=>{
    sgMail.send({
        to: email,
        from: 'sayanchatterjee_2k19co348@dtu.ac.in',
        subject: 'Hope to see you again',
        text: `I enjoyed the time I got with you. Thank You ${name} for your support. Please feel free to tell me if there is anything I could have done to make this better`
    })
    
}

module.exports = {
    sendWelcomeEmail,
    sendCancellationEmail
}