const mailer = require('nodemailer');
const smtp = require('nodemailer-smtp-transport');
const config = require('../config/config');

const transporter = mailer.createTransport(config.smtp);

module.exports = {
  sendEmail(
    req: any,
    res: any,
    from: string,
    to: string,
    subject: string,
    content: any,
    isHtml: boolean = false,
    number: number,
  ): void {
    const mailOpt: any = {
      from,
      to,
      subject,
    };
    isHtml ? (mailOpt.html = content) : (mailOpt.text = content);
    transporter.sendMail(mailOpt, (err: any, info: any): void => {
      if (err) {
        res.status(400).send({
          message: 'mail send fail',
          code: err,
        });
      } else if (req.sendData.message === 'exists email') {
        res.status(409).send({ message: 'exists email' });
      } else {
        console.log(`sent: ${info.response}`);
        res.status(200).send({ data: number, message: 'ok' });
      }
    });
  },
};
