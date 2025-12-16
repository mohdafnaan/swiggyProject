import twilio from "twilio";
import dotenv from "dotenv";
dotenv.config();

async function sendSms(to,body) {
  try {
    let sid = process.env.SID;
    let token = process.env.AUTHTOKEN;
    let phone = process.env.PHONE;

    const user = twilio(sid, token);

    let sender = await user.messages.create({
      from: phone,
      to: to,
      body: body,
    });
    console.log("sms sent", sender.sid);
  } catch (error) {
    console.log(error);
  }
}
export default sendSms;