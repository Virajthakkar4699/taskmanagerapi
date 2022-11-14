const sgmail = require("@sendgrid/mail");

// const sendgridAPIKEY =
//   "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";

sgmail.setApiKey(process.env.SENDGRID_API_KEY);

// sgmail.send({
//   to: "18bmiit094@gmail.com",
//   from: "dummytest073@gmail.com",
//   subject: "this is my first email",
//   text: "Hello Viraj",
// });

const sendWelcomeEmail = (email, name) => {
  sgmail.send({
    to: email,
    from: "dummytest073@gmail.com",
    subject: "Welcome to Task Manager",
    text: `Hello ${name}, Welcome to this brand new email functionality `,
  });
};

const senddeletemail = (email, name) => {
  sgmail.send({
    to: email,
    from: "dummytest073@gmail.com",
    subject: "Sorry to see you go from Task Manager",
    text: `Hello ${name}, Your account has been removed`,
  });
};

module.exports = {
  sendWelcomeEmail,
  senddeletemail,
};
