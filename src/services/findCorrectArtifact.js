import { fetchArtifactMetadata } from "../api/fetchArtifactMetadata.js";
import {
  prepareBigQueryObject,
  prepareBobWorkflowObject,
  prepareCohortObject,
  prepareContextObject,
  prepareHolacracyPlatformObject,
  prepareHolacracyProductObject,
  prepareSchemaObject,
} from "../utils/prepareArtifactDataToIngestObject.js";
import { PI_ENTITY_SERVICE,PI_COHORTS_SERVICE, HOLACRACY_PRODUCT_SERVICE, HOLACRACY_PLATFORM_SERVICE } from "../config/constants.js"

export async function findCorrectArtifact(artifactId, token, requiredDetails) {
  const apiUrls = [
    PI_ENTITY_SERVICE,
    PI_COHORTS_SERVICE,
    "https://ig.gov-cloud.ai/pi-bigquery-service/v1.0/big-queries",
    "https://ig.gov-cloud.ai/pi-context-service/v1.0/contexts",
    "https://ig.gov-cloud.ai/bob-service/v1.0/wf/wfId-deployedVersion?wfId=",
    "https://ig.mobiusdtaas.ai/bob-service/v1/wf/wfId-deployedVersion?deployedVersion=1&wfId=",
    "https://ig.mobiusdtaas.ai/bob-service/v1/wf/deployedVersion",
    HOLACRACY_PRODUCT_SERVICE,
    HOLACRACY_PLATFORM_SERVICE
  ];
  const fetchPromises = apiUrls.map((url) =>
    fetchArtifactMetadata(url, artifactId, token)
  );
  const results = await Promise.all(fetchPromises); // Wait for all promises to resolve

  // Filter out null values (failed requests or non-200 responses)
  const correctArtifacts = results.filter((result) => result !== null);
  let dataToIngest
  if (correctArtifacts.length > 0) {
    const correctData = correctArtifacts[0];
    const artifactUrl = correctData.url;
    const splittedUrl = artifactUrl.split("/");
    const artifactIdentifier = splittedUrl[splittedUrl.length - 1];
    console.log("Artifact Identifier : ", artifactIdentifier);
    switch (artifactIdentifier) {
      case "schemas":
        dataToIngest = await prepareSchemaObject(requiredDetails, correctArtifacts[0], token);
        break;
      case "cohorts":
        dataToIngest = await prepareCohortObject(
          requiredDetails,
          correctArtifacts[0],
          token
        );
        break;
      case "big-queries":
        dataToIngest = await prepareBigQueryObject(
          requiredDetails,
          correctArtifacts[0],
          token
        );
        break;
      case "contexts":
        dataToIngest = await prepareContextObject(
          requiredDetails,
          correctArtifacts[0],
          token
        );
        break;
      case "wfId-deployedVersion?wfId=":
        dataToIngest = await prepareBobWorkflowObject(
          artifactId,
          requiredDetails,
          correctArtifacts[0],
          token
        );
        break;
      case "filter?productCreationIds=":
        dataToIngest = await prepareHolacracyProductObject(
          artifactId,
          requiredDetails,
          correctArtifacts[0],
          token
        );
        break;
      case "filter?platformId=":
        dataToIngest = await prepareHolacracyPlatformObject(
          artifactId,
          requiredDetails,
          correctArtifacts[0],
          token
        );
        break;
      default:
        dataToIngest = {};
    }
    // console.log("dataToIngest : ", dataToIngest);
  }
  //   console.log("correctArtifacts from findCorrectArtifact : ", correctArtifacts)
  // return correctArtifacts; // Return the list of correct artifacts
  if(dataToIngest) return [dataToIngest]
  return []
}
