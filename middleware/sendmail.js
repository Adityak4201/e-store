const nodemailer = require("nodemailer");

var sendmail = async function (subject, mytext, sendto) {
  var string = "G-Mail Sending";
  var transport = await nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "piyushpuniya2001@gmail.com",
      pass: "ydqdqwtqercbonam",
    },
  });
  const message = {
    from: "piyushpuniya2001@gmail.com",
    // to: `info@redpositive.in`,
    to: `${sendto}`,
    subject: `${subject}`,
    text: `${mytext}`,
    html: `${mytext}`,
    // attachments: [
    //     { // Use a URL as an attachment
    //         filename: 'your-attachment.png',
    //         path: 'https://media.gettyimages.com/photos/view-of-tesla-model-s-in-barcelona-spain-on-september-10-2018-picture-id1032050330?s=2048x2048'
    //     }
    // ]
  };

  try {
    await transport.sendMail(message, function (err, info) {
      if (err) {
        console.log(err);
        string = "Some err occured plz try after some time";
      }
      console.log("mail infi", info);
      string = "Email Sent! Check Now.";

      return string;
    });
    
  } catch (error) {
    console.log(error);
    return error;
  }
};

module.exports = sendmail;
