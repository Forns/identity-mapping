/**
 * mailbox-config.js
 *
 * Configures administrative mailboxes.
 */

module.exports = function () {
  var nodemailer = require("nodemailer"),
      environment = process.env,
      mailOptions = {
        secureConnection: true,
        port: 465,
        auth: {
          user: environment.IMP_EMAIL_USER,
          pass: environment.IMP_EMAIL_PASS
        }
      };
      
  if (!environment.IMP_EMAIL_USER) {
    console.log("[X] MAIL: Problem with node mailer environment credentials IMP_EMAIL_USER");
  }
  if (!environment.IMP_EMAIL_PASS) {
    console.log("[X] MAIL: Problem with node mailer environment credentials IMP_EMAIL_PASS");
  }
  
  adminMail = this.adminMail = {};
  
  // Set up the email client
  adminMail.transport = nodemailer.createTransport("SMTP", mailOptions);
  
  // Function to send mail to a recipient with the given message and subject
  adminMail.sendMail = function (recipient, subject, message) {
    adminMail.transport.sendMail({
      from: "Identity Mapping Project <" + environment.IMP_EMAIL_USER + ">",
      to: recipient,
      subject: subject,
      html: message
    });
  };
  
  return this;
}
