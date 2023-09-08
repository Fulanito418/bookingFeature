import InternalServerError from "../../errors/internalServerError.js";
import { STATUS_CODE } from "../../types/Contants.js";
import getOfficerndAccessTokenController from "../main/getOfficerndAccessTokenController.js";
import axios from "axios";

async function getMeetingRooms() {
    // Grab meeting rooms from 'resources' endpoint:
    // 'https://app.officernd.com/api/v1/organizations/cohatch/resources'
    // https://developer.officernd.com/reference/get_resources
    
  const token = await getOfficerndAccessTokenController();
  let meetingRooms = null;

  var config = {
    method: 'GET',
    url: 'https://app.officernd.com/api/v1/organizations/cohatch/resources?type=meeting_room&$populate=office.physicalAddress.city,office.physicalAddress.state,rate.price',
    // url: 'https://app.officernd.com/api/v1/organizations/cohatch/resources?type=meeting_room&$populate=rate.price',
    // url: 'https://app.officernd.com/api/v1/organizations/cohatch/resources?type=event_space&$populate=rate.price',
    headers: {
        accept: 'application/json',
        authorization: `Bearer ${token}`
      }
  };
  
  await axios(config)
  .then(function (response) {
    meetingRooms = response.data
  })
  .catch(function (error) {
    // eslint-disable-next-line no-console
    console.log(error);
  });
  return meetingRooms
}

async function getOfficerndMeetingRoomsController(req, res, next) {

  const meetingRooms = await getMeetingRooms();

  try {
    res.status(STATUS_CODE.SUCCESS).json({
      status: "success",
      statusCode: STATUS_CODE.SUCCESS,
      data: {
        meetingRooms,
      },
    });
    return null;
  } catch (error) {
    return next(new InternalServerError(`An error occurred while getting market data: ${error.message}`));
  }
}

export default getOfficerndMeetingRoomsController;



