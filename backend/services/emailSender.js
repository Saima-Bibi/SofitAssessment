import nodemailer from "nodemailer"

const emailSender=(obj)=>{

   
    const transporter = nodemailer.createTransport({
        service:process.env.SERVICE,
        auth: {
            user: process.env.USER,
            pass: process.env.PASSWORD
        },
       
    })

    const mailOptions = {
        from: {
            name:"EMS",
            address:process.env.USER},
        to: obj.email,
        subject: obj.subject,
        text: obj.text
    }

    try {
        const result = transporter.sendMail(mailOptions)
        console.log('Email sent successfully', result)
        return result

    } catch (error) {
        console.log(error)
    }
}
export {emailSender}