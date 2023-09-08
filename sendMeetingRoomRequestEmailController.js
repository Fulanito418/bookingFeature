import InternalServerError from "../../errors/internalServerError.js";
import dateFormatter from "../../service/dateFormatter.js";
import timeFormatter from "../../service/timeFormatter.js";
import { STATUS_CODE } from "../../types/Contants.js";
import config from "../../config.js";
import sendEmail from "../../utils/email.js";

/**
 * Sends email to member and Community Manager (CM) after booking request is made of type (meeting room, amenity, life event).
 * @param {Request} req The request object
 * @param {Response} res The response object
 * @param {Function} next Express next function
 * @returns {null | CustomError} Returns null or CustomError
 */

const ID_EMAIL_OFFICENAME = [
  { value: "606b14899ff4771341cc9201", email: "gateway@cohatch.com", location: "COhatch The Gateway" }, 
  { value: "606af8810b1f05378ad799e7", email: "upperarlington@cohatch.com", location: "COhatch Upper Arlington" }, 
  { value: "6287bdc9fc1c6944183a059f", email: "shadyside@cohatch.com", location: "COhatch Walnut St" }, 
];

async function sendMeetingRoomRequestEmailController(req, res, next) {
  try {
    const {
      firstName,
      lastName,
      emailAddress,
      companyName,
      telephone,
      cohatchRoomAndLocation,
      anticipatedDate,
      startTime,
      endTime,
      attending,
      otherDetails,
      officeId,
      bookingType,
    } = req.body;
    
    //Will send email to member letting them know a CM will reach out to them shortly
    const templateData = {
      COHATCH_ROOM_AND_LOCATION: cohatchRoomAndLocation,
    };
    
    await sendEmail(emailAddress, "Booking Request Received", templateData, config["LIFE_PERKS_BOOKING_RECEIVED"]);

    //Will send ADMIN_BOOKING_REQUEST_TEMPLATE to the CM of the COhatch location informing them of a new booking
    const templateDataForCM = {
      FIRST_NAME: firstName,
      LAST_NAME: lastName,
      COHATCH_ROOM_AND_LOCATION: cohatchRoomAndLocation,
      DATE_OF_EVENT: dateFormatter(anticipatedDate),
      START_TIME: timeFormatter(startTime),
      END_TIME: timeFormatter(endTime),
      ATTENDING: attending,
      OTHER_DETAILS: otherDetails,
      EMAIL: emailAddress,
      TELEPHONE: telephone,
      COMPANY: companyName,
    };

    await sendEmail(ID_EMAIL_OFFICENAME.find((office) => office.value === officeId).email, "New Booking Request on COhatch+", templateDataForCM, config["ADMIN_BOOKING_REQUEST_TEMPLATE"]);
    
    res.status(STATUS_CODE.SUCCESS).json({
      status: "success",
      statusCode: STATUS_CODE.SUCCESS,
      data: "Attempted to send emails",
    });

    return null;
  } catch (error) {
    return next(
      new InternalServerError(
        `An error occurred while creating contact message: ${error.message}`
      )
    );
  }
}

export default sendMeetingRoomRequestEmailController;
