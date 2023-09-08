import InternalServerError from "../../errors/internalServerError.js";
import dateFormatter from "../../service/dateFormatter.js";
import timeFormatter from "../../service/timeFormatter.js";
import { STATUS_CODE } from "../../types/Contants.js";
import config from "../../config.js";
import sendEmail from "../../utils/email.js";

/**
 * Sends email to member and CM after booking request is made of type (meeting room, amenity, life event).
 * @param {Request} req The request object
 * @param {Response} res The response object
 * @param {Function} next Express next function
 * @returns {null | CustomError} Returns null or CustomError
 */


//Use these if the booking request is a meeting room and for Columbus
const ID_EMAIL_OFFICENAME_COLUMBUS = [ 
    { value: "606af8810b1f05378ad799e7", email: "stacey@cohatch.com", location: "COhatch Upper Arlington" }, 
    { value: "606af89d5e433411eec209cf", email: "stacey@cohatch.com", location: "COhatch Easton" },
    { value: "606af8ab5e4334f28dc209e7", email: "stacey@cohatch.com", location: "COhatch Polaris" },  
    { value: "606b14899ff4771341cc9201", email: "stacey@cohatch.com", location: "COhatch The Gateway" }, 
    { value: "606af88d5e43340c60c209b8", email: "stacey@cohatch.com", location: "COhatch Delaware" }, 
    { value: "606af872e1fae54e2da1c315", email: "stacey@cohatch.com", location: "COhatch Springfield" }, 
    { value: "606b0d3422b1003de911eea7", email: "stacey@cohatch.com", location: "COhatch Dublin" }, 
    { value: "606af8e161a5fbfe224c3002", email: "stacey@cohatch.com", location: "COhatch Worthington - The Hardware Store" }, 
    { value: "606af8be5e43345791c20a01", email: "stacey@cohatch.com", location: "COhatch Worthington - The Library & The Madery" }, 
]

const columbusIDArray = [
"606af8810b1f05378ad799e7",
"606af89d5e433411eec209cf",
"606af8ab5e4334f28dc209e7",
"606b14899ff4771341cc9201",
"606af88d5e43340c60c209b8",
"606af872e1fae54e2da1c315",
"606b0d3422b1003de911eea7",
"606af8e161a5fbfe224c3002",
"606af8be5e43345791c20a01",
]

const ID_EMAIL_OFFICENAME = [
  { value: "606b10f2f7ff2fc987137673", email: "beachwood@cohatch.com", location: "COhatch Beachwood" }, 
  { value: "606af961262dad011aa7c154", email: "mckenna@cohatch.com", location: "COhatch Broad Ripple" }, 
  { value: "61a4e2f49b30e7104f11278b", email: "mckenna@cohatch.com", location: "COhatch Carmel" }, 
  { value: "6109728eb12e145cca3b1f59", email: "mckenna@cohatch.com", location: "COhatch Circle Centre" }, 
  { value: "606af88d5e43340c60c209b8", email: "delaware@cohatch.com", location: "COhatch Delaware" }, 
  { value: "606b0d3422b1003de911eea7", email: "dublin@cohatch.com", location: "COhatch Dublin" }, 
  { value: "606af89d5e433411eec209cf", email: "easton@cohatch.com", location: "COhatch Easton" }, 
  { value: "61a502e6b36e570a87ac582f", email: "Alex@cohatch.com", location: "COhatch Findlay Market" }, 
  { value: "606af857c10359a5c9f3f6ed", email: "hydepark@cohatch.com", location: "COhatch Hyde Park" }, 
  { value: "60a1138d775d0f03eec14ee0", email: "kenwood@cohatch.com", location: "COhatch Kenwood" }, 
  { value: "61435fba63579c94b09276e5", email: "lakeland@cohatch.com", location: "COhatch Lakeland" }, 
  { value: "5d1bcda0dbd6e40010479eec", email: "mason@cohatch.com", location: "COhatch Mason" }, 
  { value: "606b0ea033fc9a7d5b53a1b7", email: "milford@cohatch.com", location: "COhatch Milford" }, 
  { value: "606af848e1fae5fe0aa1c2af", email: "mckenna@cohatch.com", location: "COhatch Noblesville" }, 
  { value: "5fd23f130ecc6d8a668543db", email: "ohiocity@cohatch.com", location: "COhatch Ohio City" }, 
  { value: "606af8ab5e4334f28dc209e7", email: "polaris@cohatch.com", location: "COhatch Polaris" }, 
  { value: "624f4116bd2861034d10d844", email: "mckenna@cohatch.com", location: "COhatch Polk Stables" }, 
  { value: "6287bdffe608c584f6faecb1", email: "Alex@cohatch.com", location: "COhatch Southside Works" }, 
  { value: "606af872e1fae54e2da1c315", email: "springfield@cohatch.com", location: "COhatch Springfield" }, 
  { value: "61435e994274f6b1e4d2bff8", email: "stpete@cohatch.com", location: "COhatch St. Petersburg" }, 
  { value: "624f40390fd203233bb9b659", email: "Alex@cohatch.com", location: "COhatch Tarpon Springs" }, 
  { value: "606b14899ff4771341cc9201", email: "gateway@cohatch.com", location: "COhatch The Gateway" }, 
  { value: "606af8810b1f05378ad799e7", email: "upperarlington@cohatch.com", location: "COhatch Upper Arlington" }, 
  { value: "6287bdc9fc1c6944183a059f", email: "shadyside@cohatch.com", location: "COhatch Walnut St" }, 
  { value: "6287bd60e608c53fd3fae8d3", email: "waterfront@cohatch.com", location: "COhatch Waterfront" }, 
  { value: "61435f4e2a9271b93fb57221", email: "westtampa@cohatch.com", location: "COhatch West Tampa" }, 
  { value: "625675b22cec9a850f913a58", email: "Alex@cohatch.com", location: "COhatch Westerville" }, 
  { value: "606af8e161a5fbfe224c3002", email: "worthington@cohatch.com", location: "COhatch Worthington - The Hardware Store" }, 
  { value: "606af8be5e43345791c20a01", email: "worthington@cohatch.com", location: "COhatch Worthington - The Library & The Madery" }, 
  { value: "61097250b12e1486413b171a", email: "mckenna@cohatch.com", location: "COhatch Zionsville" }
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

    
    //If booking type is a meeting room AND in columbus then email stacey@cohatch.com
    if (bookingType === "meeting room" && columbusIDArray.includes(officeId)) {
      await sendEmail(ID_EMAIL_OFFICENAME_COLUMBUS.find((office) => office.value === officeId).email, "New Booking Request on COhatch+", templateDataForCM, config["ADMIN_BOOKING_REQUEST_TEMPLATE"]);  
    } else {
      await sendEmail(ID_EMAIL_OFFICENAME.find((office) => office.value === officeId).email, "New Booking Request on COhatch+", templateDataForCM, config["ADMIN_BOOKING_REQUEST_TEMPLATE"]);
    }
    
    

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
