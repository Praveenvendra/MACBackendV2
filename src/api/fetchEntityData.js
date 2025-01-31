import axios from "axios";
import { ADHOC, PI_ENTITY_INSTANCES_SERVICE, schemaId } from "../config/constants.js";



export const fetchEntityData = async (artifactId, agentId, token) => {
    console.log("Agent ID:", agentId);

    const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      }; 
    
    const queryPayload = {
        type: "tidb",
        definition: `SELECT * FROM t_${schemaId}_t WHERE artifactId = '${artifactId}'`
    };

    // console.log("queryPayload : ", queryPayload)
    // console.log("URL entity ADHOC : ", ADHOC)


    console.log("queryPayload : ", queryPayload);

    try {  
        const response = await axios.post(
            `${ADHOC}`, 
             queryPayload,
            { headers }
        );

        // console.log ( response.data);

        const entities = response.data?.model?.data?.map((item) => {
            // console.log("item ",item);
            const entity = { ...item};
            entity.childrenIds = JSON.parse(entity.childrenIds || "[]");
            entity.parentId = JSON.parse(entity.parentId || "[]");
            entity.siblingIds = JSON.parse(entity.siblingIds || "[]")
            return entity;
        }) || [];
        console.log("entites : " , entities);


        if (entities.length === 0) {
            throw new Error(`No entities found for artifactId: ${artifactId} and agentId: ${agentId}`);
        }


        return entities;
    }
     catch (error) {
        console.error("Error fetching entity data:", error);
        throw error;
    }
};




export const fetchArtifactData = async (token) => {

    const headers = {
        "Content-Type": "application/json",
         Authorization: `Bearer ${token}`,
      }; 

      const body = {
        dbType : "TIDB"
      }

      console.log("PI_ENTITY_INSTANCES_SERVICE",PI_ENTITY_INSTANCES_SERVICE);
      
    try {
        const response = await axios.post(
            `${PI_ENTITY_INSTANCES_SERVICE}/${schemaId}/instances/list?size=100`, body,
            { headers }
        );

        console.log("response : ", response.data)
        const entities = response.data; 

        return entities;  

    } catch (error) {
        console.error("Error fetching entity data:", error.message); 
        throw new Error("Failed to fetch artifact data from the API");
    }
};
