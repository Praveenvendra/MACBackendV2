import axios from "axios";
import { PI_ENTITY_SERVICE, schemaId } from "../config/constants.js";

export async function updateSchema(schemaDetails, id, token) {
  const finalUrl = `${PI_ENTITY_SERVICE}/${id}`
  // const requestBody = responsesArray;
  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  }; 

  const payload = schemaDetails
  console.log("update Schema URL : ", finalUrl)
  console.log("update Schema Payload : ", payload)

  try {
    const response = await axios.put(finalUrl, payload, { headers });
    console.log("updatedSchema response:", response.data);
  } catch (error) {
    console.error("Failed to send the updateSchema request:", error);
  }
}
