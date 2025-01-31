import axios from "axios";
import { PI_ENTITY_SERVICE, schemaId } from "../config/constants.js";

export async function schemaCreation(schemaDetails, token) {
  const finalUrl = PI_ENTITY_SERVICE
  // const requestBody = responsesArray;
  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  }; 

  const payload = schemaDetails
  console.log("Schema URL : ", finalUrl)
  console.log("Schema Payload : ", payload)

  try {
    const response = await axios.post(finalUrl, payload, { headers });
    console.log("CreatedSchema response:", response.data);
  } catch (error) {
    console.error("Failed to send the CreateSchema request:", error);
  }
}
