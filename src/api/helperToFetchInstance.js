import axios from "axios";
import { helperToUpdateInstance } from "./helperToUpdateInstance.js";
import { PI_ENTITY_INSTANCES_SERVICE, schemaId } from "../config/constants.js"

export async function helperToFetchInstance(childIds, parentID, token) {
  // Step 1: Initialize an empty array to hold the responses
  const responsesArray = [];
  const url =
    `${PI_ENTITY_INSTANCES_SERVICE}/${schemaId}/instances/list?showDBaaSReservedKeywords=true`;

  // Step 2: Iterate over each childId and make a fetch POST request
  const fetchPromises = childIds.map(async (childId) => {
    // Create the request body with artifactId as childId

    // const requestBody = {
    //   artifactId: childId,
    // };

    const requestBody = {
      "dbType": "TIDB",
      "ownedOnly": true,
      "filter": {
        artifactId: childId
      }
    }  

    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };
    // console.log(JSON.stringify(requestBody))

    try {
      const response = await axios.post(url, requestBody, { headers });
      // console.log("Fetch Instance Data : ", JSON.stringify(response));
      const responseData = response.data;
      // console.log(JSON.stringify(requestBody))
      console.log("Fetch Instance Data : ", JSON.stringify(responseData));
      responseData?.forEach((data) => {
        // if (!data.parentId.includes(parentID)) data.parentId.push(parentID);
        if(!data.parentId)data.parentId = []
        data.parentId.push(parentID);
        data.parentId = [...new Set(data.parentId)]
        const toBeUpdated = {
          "instanceId" : data.piMetadata.entityId,
          "data" : {
            parentId : data.parentId,
            reusability : "deployed"
          }
        }
        responsesArray.push(toBeUpdated);
      });

      // console.log("responsesArray - fetch Instance : ", responsesArray);
    } catch (error) {
      console.error(
        `Error while fetching for childId in fetchInstance : ${childId}`,
        error
      );
    }
  });

  // Step 3: Wait for all fetch calls to complete
  await Promise.all(fetchPromises);
  
  // Step 4: Make the final POST call with the responsesArray
  const updateInstances = responsesArray.map(async (response) => {
    console.log('Update Instance : ', response)
    await helperToUpdateInstance(response, token)
  })
  await Promise.all(updateInstances);

  // await helperToUpdateInstance(responsesArray, token);
}
