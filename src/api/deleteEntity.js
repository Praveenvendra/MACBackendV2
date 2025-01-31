import axios from "axios";
import { API_ENDPOINT, schemaId } from "../config/constants.js";

export const deleteEntity = async (entity,token) => {
    
    console.log("token : " , token);


    const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      }; 

    try {
        await axios.delete(`${API_ENDPOINT}/${schemaId}/instances`, {
            headers,
            data: { id: entity }, 
        });
        console.log("Entity deleted successfully");
    } catch (error) {
        console.error("Error deleting entity:", error.response?.data || error.message);
        throw error;
    }
};