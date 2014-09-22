/**
 * mailbox-config.js
 *
 * Configures administrative mailboxes.
 */

module.exports = function (status) {
  var nodemailer = require("nodemailer"),
      environment = process.env,
      mailOptions = {
        service: "Gmail",
        auth: {
          user: environment.IMP_EMAIL_USER,
          pass: environment.IMP_EMAIL_PASS
        }
      },
      
      mailHeader = "<div style='background-color: #e9eaef; height: 60px; line-height: 60px; width: 100%; position: relative; z-index: -10; text-shadow: 0 1px 0 rgba(255, 255, 255, 0.25); box-shadow: 3px 3px 15px #000; -moz-box-shadow: 3px 3px 15px #000; -webkit-box-shadow: 3px 3px 15px #000;'>" +
                       "<a href='http://www.lmu.edu/' style='float: right; background-color: white; padding-left: 10px;'>" +
                         "<img src='" + status.SITE_DOMAIN + "/assets/lmu-logo.png' style='height: 60px; width: 114px;' />" +
                       "</a>" +
                       "<h2 style='font-size: 24px; margin-left: 10px;'>Identity Mapping Project</h2>" +
                     "</div>";
      
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
      html: mailHeader + message
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
      "<p>The goal of the Identity Mapping Project is to " + 
      "generate thousands (if not millions) of identity maps " + 
      "from around the globe and chart the nature of identity " + 
      "in the today's digital world. An &quot;Identity Map&quot; " + 
      "shows how active someone is online and how their identity is " + 
      "expressed in a variety of online forms.</p>" +
      
      "<p>" + sharer + " completed an identity map and wanted to show you!</p>" +
      "<p><a href='" + link + "' target='_blank'>Click here to see the map!</a><br/>" +
      "(alternately, copy and paste the following into your browser):<br/>" + link + "</p>" +
      
      "<p>Interested in generating your own identity map? <a href='http://imp.cs.lmu.edu' target='_blank'>Click here to begin!</a></p>" +
      "<p>(or copy and paste the following into your browser):<br/>" + status.SITE_DOMAIN + "</p>" +
      
      "<p>Thanks for your interest in the Identity Mapping Project!</p>"
    );
  };
  
  return this;
}
