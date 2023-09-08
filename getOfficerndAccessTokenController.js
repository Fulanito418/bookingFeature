import config from "../../config.js";
import qs from "qs";
import axios from "axios";

async function getOfficerndAccessTokenController() {
  
  let accessToken = null;
  
  try {
    const data = { client_id: config["OFFICERND_CLIENT_ID"], client_secret: config["OFFICERND_CLIENT_SECRET"], grant_type: "client_credentials", scope: "officernd.api.read officernd.api.write" };
    const options = {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      data: qs.stringify(data),
      url: "https://identity.officernd.com/oauth/token",
    };
    const result = await axios(options);
    accessToken = result.data.access_token;
  } catch (error) {
    accessToken = null;
  }

export default getOfficerndAccessTokenController;
