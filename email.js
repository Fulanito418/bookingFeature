//Brevo formerly known as Sendinblue
import logger from "./../log/logger.js";
import InternalServerError from "./../errors/internalServerError.js";
import SibApiV3Sdk from "sib-api-v3-sdk";
import config from "../config.js";

const defaultClient = SibApiV3Sdk.ApiClient.instance;
const apiKey = defaultClient.authentications['api-key'];
apiKey.apiKey = config['SENDINBLUE_KEY'];

/**
 * Sends a new email with template
 * @param {String} to Recipient email
 * @param {String} subject Subject of email
 * @param {Object} templateData Json data of handlebar
 * @param {String} templateId ID of template
 * @returns {null | CustomError} Returns null or CustomError
 */

async function sendEmail(to, subject, templateData, templateId) {
  try {
    const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();
    const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();
    sendSmtpEmail.subject = subject;
    sendSmtpEmail.templateId = parseInt(templateId, 10);
    sendSmtpEmail.to = [{"email": to}];
    sendSmtpEmail.params = templateData;

    const emailResponse = await apiInstance.sendTransacEmail(sendSmtpEmail);
    logger.info(`Email successfully sent: ${emailResponse}`);
    return emailResponse;
  } catch (error) {
    return new InternalServerError(`An error occurred while sending emails: ${error}`);
  }
}

/**
 * Sends a new email without template
 * @param {String} to Recipient email
 * @param {String} subject Subject of email
 * @param {String} content Email content
 * @returns {null | CustomError} Returns null or CustomError
 */

export async function sendEmailWithoutTemplate(to, subject, content) {
  try {
    const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();
    const emailResponse = await apiInstance.sendTransacEmail({
      subject,
      sender: {
        email: config.SUPPORT_EMAIL,
      },
      to: [{
        email: to,
      }],
      htmlContent: content
    })
    logger.info(`Email successfully sent: ${emailResponse}`);
    return emailResponse;
  } catch (error) {
    return new InternalServerError(`An error occurred while sending emails: ${error}`);
  }
}

export default sendEmail;
