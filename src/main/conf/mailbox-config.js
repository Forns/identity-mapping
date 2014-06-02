/**
 * mailbox-config.js
 *
 * Configures administrative mailboxes.
 */

module.exports = function () {
  var nodemailer = require("nodemailer"),
      environment = process.env,
      mailOptions = {
        service: "Gmail",
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
  
  adminMail.validEmail = function (email) {
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
  };
      
  adminMail.shareEmail = function (email, link, sharer) {
    adminMail.sendMail(
      email,
      sharer + " Shared Their Identity Map With You!",
      "<h3>The Indentity Mapping Project</h3>" +
      "<p>The goal of the Identity Mapping Project is to " + 
      "generate thousands (if not millions) of identity maps " + 
      "from around the globe and chart the nature of identity " + 
      "in the today's digital world. An &quot;Identity Map&quot; " + 
      "shows how active someone is online and how their identity is " + 
      "expressed in a variety of online forms.</p>" +
      
      "<p>" + sharer + " completed their identity map and wanted to show you!</p>" +
      "<p><a href='" + link + "' target='_blank'>Click here to see their map!</a></p>" +
      
      "<p>Interested in generating your own identity map and discovering more about the project?</p>" +
      "<p><a href='http://imp.cs.lmu.edu:3000' target='_blank'>Click here to learn more!</a></p>" +
      
      "<p>Thanks for your interest in the Identity Mapping Project! Have a great day.</p>"
    );
  };
  
  return this;
}