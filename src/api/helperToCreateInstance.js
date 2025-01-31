import axios from "axios";
import { PI_ENTITY_INSTANCES_SERVICE, schemaId } from "../config/constants.js";

export async function helperToCreateInstance(responsesArray, token) {
  const finalUrl =
    `${PI_ENTITY_INSTANCES_SERVICE}/${schemaId}/instances`;
  // const requestBody = responsesArray;
  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  }; 

  const payload = {data:responsesArray}

  try {
    const response = await axios.post(finalUrl, payload, { headers });
    console.log("CreatedInstance response:", response.data);
    return {status:response.status, data:response.data}
  } catch (error) {
    console.error("Failed to send the CreateInstance request:", error);
    return {status:error.status, data:error.message}
  }
}
