const sgMail = require('@sendgrid/mail')



sgMail.setApiKey(process.env.SENDGRID_API_KEY)


const sendWelcomeEmial =  (email,name)=>{
    sgMail.send({
        to: email,
        from: 'nabeel.amjad@zauq.com',
        subject: 'Thanks for joining in!',
        text:`Welcome to the app, ${name}. Let me know how you get along with the app.`
         
    })
}


const sendCancelEmail = (email,name)=>{
    sgMail.send({
        to:email,
        from:'nabeel.amjd@zauq.com',
        subject:'Account cancelation email!',
        text:`Goodbye, ${name}. I hope to see you back sometime soon. `
    })

}

module.exports ={
    sendWelcomeEmial,
    sendCancelEmail
}
// sgMail.send({
//     to:'nabeel.amjad@zauq.com',
//     from: 'nabeel.amjad@zauq.com',
//     subject:'This is my First Creation From Node!',
//     text:'I Hope this one actually gets to you.',

// })
