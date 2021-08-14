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
         user: process.env.CONTACT_USER,
         pass: process.env.CONTACT_PASSWORD,
        },
    })
    const mail = { 
        from: `"${name}" <${email}>`,
            to: process.env.CONTACT_TO,
            subject: subject,
            text: message,
    }
    transporter.sendMail(mail, (err, info) => {
        if (err) { 
         res.status(err).json("Message failed")
        }
        else { 
            res.json("success")
        }
    })  
}

module.exports = { 
    handleMail: handleMail
}