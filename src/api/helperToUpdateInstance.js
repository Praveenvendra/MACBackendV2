import axios from "axios";
import { PI_ENTITY_INSTANCES_SERVICE, schemaId } from "../config/constants.js";

export async function helperToUpdateInstance(responsesArray, token) {
  // const finalUrl = `${API_ENDPOINT}/${schemaId}/instances?upsert=true`;
  const finalUrl = `${PI_ENTITY_INSTANCES_SERVICE}/${schemaId}/instances`;
  console.log("update instance payload : ", responsesArray)
  // const requestBody = responsesArray;
  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  }; 

  try {
    const response = await axios.put(finalUrl, responsesArray, { headers });
    console.log("UpdateInstance response:", response.data);
  } catch (error) {
    console.error("Failed to send the updateInstance request:", error);
  }
}
