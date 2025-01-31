import axios from "axios";
import { HOLACRACY_PLATFORM_SERVICE, HOLACRACY_PRODUCT_SERVICE } from "../config/constants.js";


export async function fetchArtifactMetadata(url, artifactId, token) {
  try {
    // Set up the request headers with Bearer token
    const headers = {
      Authorization: `Bearer ${token}`,
    };

    // Make the HTTP GET request with the Authorization header
    let response;
    if (
      [
        "https://ig.gov-cloud.ai/bob-service/v1.0/wf/wfId-deployedVersion?wfId=",
        "https://ig.mobiusdtaas.ai/bob-service/v1/wf/wfId-deployedVersion?deployedVersion=1&wfId=",
        HOLACRACY_PRODUCT_SERVICE,
        HOLACRACY_PLATFORM_SERVICE
      ].includes(url)
    ) {
      // console.log(`fetchArtifactMetadata URL 1 = ${url}${artifactId}`)
      response = await axios.get(`${url}${artifactId}`, { headers });
    } else {
      response = await axios.get(`${url}/${artifactId}`, { headers });
    }
    // const response = await axios.get(`${url}/${artifactId}`, { headers });

    if (response.status === 200) {
      // Return the full metadata of the artifact from the successful API
      return { status: "success", url, metadata: response.data }; // Assuming the artifact metadata is in response.data
    }

    return null; // Return null if the response is not 200
  } catch (error) {
    console.error(`Error fetching from ${url}: ${error.status}`);
    return null; // Return null if there is an error
  }
}