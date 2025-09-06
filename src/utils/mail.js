import Mailgen from "mailgen"
import nodemailer from "nodemailer"
import logger from "../logger/winston.logger.js"

const sendMail = async (options) => {
  const mailGenerator = new Mailgen({
    theme: "default",
    product: {
      name: "boilerplate",
      link: "http://localhost:8080",
    },
  })

  const emailTextual = mailGenerator.generatePlaintext(options.mailgenContent)

  const emailHTML = mailGenerator.generate(options.mailgenContent)

  // const transporter = nodemailer.createTransport({
  //   host: process.env.MAILTRAP_SMTP_HOST,
  //   port: process.env.MAILTRAP_SMTP_PORT,
  //   auth: {
  //     user: process.env.MAILTRAP_SMTP_USER,
  //     pass: process.env.MAILTRAP_SMTP_PASS,
  //   },
  // })

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_PASSWORD,
    },
  })

  const mail = {
    from: "boilerplatebackend@gmail.com",
    to: options.email,
    subject: options.subject,
    text: emailTextual,
    html: emailHTML,
  }

  try {
    await transporter.sendMail(mail)
  } catch (error) {
    logger.error(
      "Email service failed silently. Make sure you have provided your MAILTRAP credentials in the .env file"
    )
    logger.error("Error: ", error)
  }
}

const emailVerificationMailgenContent = (username, verificationUrl) => {
  return {
    body: {
      name: username,
      intro: "Welcome to our app! We're very excited to have you on board.",
      action: {
        instructions:
          "To verify your email please click on the following button:",
        button: {
          color: "#22BC66",
          text: "Verify your email",
          link: verificationUrl,
        },
      },
      outro:
        "Need help, or have questions? Just reply to this email, we'd love to help.",
    },
  }
}

const forgotPasswordMailgenContent = (username, passwordResetUrl) => {
  return {
    body: {
      name: username,
      intro: "We got a request to reset the password of our account",
      action: {
        instructions:
          "To reset your password click on the following button or link:",
        button: {
          color: "#22BC66",
          text: "Reset password",
          link: passwordResetUrl,
        },
      },
      outro:
        "Need help, or have questions? Just reply to this email, we'd love to help.",
    },
  }
}

const orderConfirmationMailgenContent = (username, items, totalCost) => {
  return {
    body: {
      name: username,
      intro: "Your order has been processed successfully.",
      table: {
        data: items?.map((item) => {
          return {
            item: item.product?.name,
            price: "INR " + item.product?.price + "/-",
            quantity: item.quantity,
          }
        }),
        columns: {
          // Optionally, customize the column widths
          customWidth: {
            item: "20%",
            price: "15%",
            quantity: "15%",
          },
          // Optionally, change column text alignment
          customAlignment: {
            price: "right",
            quantity: "right",
          },
        },
      },
      outro: [
        `Total order cost: INR ${totalCost}/-`,
        "You can check the status of your order and more in your order history",
      ],
    },
  }
}

export {
  sendMail,
  emailVerificationMailgenContent,
  forgotPasswordMailgenContent,
  orderConfirmationMailgenContent,
}
