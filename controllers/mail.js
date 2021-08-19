const handleMail = (req, res, nodemailer) => { 
     const { name, email, subject, message } = req.body
     if (!name || !email || !subject || !message){ 
        return res.json("Please fill out all fields")
     }
      let transporter = nodemailer.createTransport({ 
         host: 'smtp.gmail.com',
         port: 465,
         secure:true,
         auth: {
            type: 'OAuth2',
            user: process.env.GOOGLE_EMAIL,
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_SECRET,
            refreshToken: process.env.GOOGLE_REFRESH,
            accessToken: process.env.GOOGLE_ACCESS,
            expires: 1484314697598
        }
    })
    const mail = { 
        from: `"${name}" <${email}>`,
            to: process.env.CONTACT_TO,
            subject: subject,
            text: message + `regards, ${name} ${email}`,
    }
    transporter.sendMail(mail, (err, info) => {
        if (err) { 
         res.status(err).json("Message failed")
        }
        else { 
            res.json("Message successfully sent!")
        }
    })  
}

module.exports = { 
    handleMail: handleMail
}