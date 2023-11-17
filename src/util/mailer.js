const nodemailer = require("nodemailer");
const base_url = process.env.SERVER;

const sendVerificationEmail = async (email, token, _id) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL,
      pass: process.env.MAIL_PASSWORD,
    },
  });
  const mailOptions = {
    from: "coffee_house@gmail.com",
    to: email,
    subject: "Email xác thực",
    html: `<div style="display: flex; justify-content: center;">
            <p style="margin-right: 32px;">Click here!</p>
              <a href="${base_url + "v1/api/verify/" + token + "?_id=" + _id}">
                <button style="border: none; font-weight: 600;padding: 12px;">Xác thực tài khoản</button>
              </a>
          </div>`,
  };
  try {
    await transporter.sendMail(mailOptions).then(() => {
      console.log("Đã gửi email xác thực!");
    });
  } catch (error) {
    console.log("Lỗi khi đang gửi email!", error);
  }
};

module.exports = { sendVerificationEmail };
