import { helperToFetchInstance } from "../api/helperToFetchInstance.js";
import { helperToCreateInstance } from "../api/helperToCreateInstance.js";
import { generateUniqueId } from "./generateUniqueId.js";

function prepareGenericObject(requiredDetails, artifactMetadata) {
  const [input, toolInput, toolOutput] = requiredDetails;

  const dataToIngest = {
    agentId: input?.agentId || "dummyAgentId",
    metadata: artifactMetadata?.metadata || {},
    createdBy: input?.agentReasoning[0].agentName || "dummyName",
    artifactName: "dummyArtifactName",
    childrenIds: [],
    description: toolInput?.description || "dummyDescription",
    reusability: "draft",
    artifactId: "dummyId",
    type: "dummyType",
    parentId: [],
    artifactType: "dummyArtifactType",
    id : generateUniqueId()
  };

  return dataToIngest;
}

export async function prepareSchemaObject(
  requiredDetails,
  artifactMetadata,
  token
) {
  const [input, toolInput, toolOutput] = requiredDetails;
  //   console.log("requiredDetails : ", requiredDetails)
  const dataToIngest = prepareGenericObject(requiredDetails, artifactMetadata);
  dataToIngest.artifactName = toolInput?.schemaName;
  dataToIngest.artifactId = toolOutput?.schemaId;
  dataToIngest.type = "atom";
  dataToIngest.artifactType = "Schema";
  
  console.log("dataToIngest", dataToIngest);
  // await helperToCreateInstance([dataToIngest], token);
  const resp = await helperToCreateInstance([dataToIngest], token);
  console.log("Resp for schemaObject", resp)
  if(resp.status === 200)return dataToIngest;
  else return {...resp}
}

export async function prepareCohortObject(
  requiredDetails,
  artifactMetadata,
  token
) {
  const [input, toolInput, toolOutput] = requiredDetails;

  const dataToIngest = prepareGenericObject(requiredDetails, artifactMetadata);
  dataToIngest.artifactName = toolInput?.schemaName || toolInput?.name;
  dataToIngest.childrenIds = artifactMetadata?.metadata?.model?.definitionRequest?.tables || [];
  dataToIngest.artifactId = toolOutput?.id;
  dataToIngest.type = "molecule";
  dataToIngest.artifactType = "Cohort";

  console.log("DataToIngest : ", dataToIngest)
  const resp = await helperToCreateInstance([dataToIngest], token);
  await helperToCreateInstance([dataToIngest], token);
  await helperToFetchInstance(dataToIngest.childrenIds, dataToIngest.artifactId, token); // pass input also for agentId check if needed
  console.log("Resp for schemaObject", resp)
  if(resp.status === 200)return dataToIngest;
  else return {...resp}
  // return dataToIngest;
}

export async function prepareBigQueryObject(
  requiredDetails,
  artifactMetadata,
  token
) {
  const [input, toolInput, toolOutput] = requiredDetails;

  const dataToIngest = prepareGenericObject(requiredDetails, artifactMetadata);
  dataToIngest.artifactName = toolInput?.schemaName || toolInput?.name;
  dataToIngest.childrenIds = artifactMetadata?.metadata?.queryModel?.definition?.aqDefinitionRequest?.tables || [];
  dataToIngest.artifactId = toolOutput?.id;
  dataToIngest.type = "molecule";
  dataToIngest.artifactType = "BigQuery";

//   const agentId = input?.agentId;
//   const metadata = input?.metadata || {};
//   const createdBy = input?.agentReasoning[0].agentName || "demoName"; // Keeping Dummy name for now
//   const artifactName = toolInput?.schemaName;
//   const childrenIds =
//     artifactMetadata?.metadata?.queryModel?.definition?.aqDefinitionRequest
//       ?.tables;
//   const description = toolInput?.description;
//   const reusability = "draft"; // need to identify how to change it to deployed or published
//   const artifactId = toolOutput?.schemaId || toolOutput?.id;
//   const type = "molecule";
//   const parentId = [];
//   const artifactType = toolOutput?.msg.split(" ")[0];

//   const dataToIngest = {
//     agentId,
//     metadata,
//     createdBy,
//     artifactName,
//     childrenIds,
//     description,
//     reusability,
//     artifactId,
//     type,
//     parentId,
//     artifactType,
//   };
  console.log(dataToIngest)
  await helperToCreateInstance([dataToIngest], token);
  await helperToFetchInstance(dataToIngest.childrenIds, dataToIngest.artifactId, token);
  return dataToIngest;
}

export async function prepareContextObject(
  requiredDetails,
  artifactMetadata,
  token
){
  const [input, toolInput, toolOutput] = requiredDetails;

  const dataToIngest = prepareGenericObject(requiredDetails, artifactMetadata);
  dataToIngest.artifactName = toolInput?.schemaName || toolInput?.name;
  dataToIngest.childrenIds = artifactMetadata?.metadata?.definition?.tables || [];
  dataToIngest.artifactId = toolOutput?.id;
  dataToIngest.type = "molecule";
  dataToIngest.artifactType = "Context";

//   const agentId = input?.agentId;
//   const metadata = input?.metadata || {};
//   const createdBy = input?.agentReasoning[0].agentName || "demoName"; // Keeping Dummy name for now
//   const artifactName = toolInput?.schemaName;
//   const childrenIds = artifactMetadata?.metadata?.definition?.tables;
//   const description = toolInput?.description;
//   const reusability = "draft"; // need to identify how to change it to deployed or published
//   const artifactId = toolOutput?.schemaId || toolOutput?.id;
//   const type = "molecule";
//   const parentId = [];
//   const artifactType = "Context";

//   const dataToIngest = {
//     agentId,
//     metadata,
//     createdBy,
//     artifactName,
//     childrenIds,
//     description,
//     reusability,
//     artifactId,
//     type,
//     parentId,
//     artifactType,
//   };
  console.log(dataToIngest)
  await helperToCreateInstance([dataToIngest], token);
  await helperToFetchInstance(dataToIngest.childrenIds, dataToIngest.artifactId, token);
  return dataToIngest;
}

export async function prepareBobWorkflowObject(
  artifactIdMain,
  requiredDetails,
  artifactMetadata,
  token
){

  const [input, toolInput, toolOutput] = requiredDetails;
  const dataToIngest = prepareGenericObject(requiredDetails, artifactMetadata);
  dataToIngest.artifactName = toolInput?.workflowName;
  dataToIngest.childrenIds = artifactMetadata?.metadata?.definition?.tables || [];
  dataToIngest.artifactId = artifactIdMain;
  dataToIngest.type = "molecule";
  dataToIngest.artifactType = "Workflow";

//   const agentId = input?.agentId;
//   const metadata = input?.metadata || {};
//   const createdBy = input?.agentReasoning[0].agentName || "demoName"; // Keeping Dummy name for now
//   const artifactName = toolInput?.workflowName;
//   const childrenIds = artifactMetadata?.metadata?.definition?.tables || [];
//   const description = toolInput?.description;
//   const reusability = "draft"; // need to identify how to change it to deployed or published
//   const artifactId = artifactIdMain;
//   const type = "molecule";
//   const parentId = [];
//   const artifactType = "Workflow";
//   const dataToIngest = {
//     agentId,
//     metadata,
//     createdBy,
//     artifactName,
//     childrenIds,
//     description,
//     reusability,
//     artifactId,
//     type,
//     parentId,
//     artifactType,
//   };


  console.log(dataToIngest)
  await helperToCreateInstance([dataToIngest], token);
  await helperToFetchInstance(dataToIngest.childrenIds, dataToIngest.artifactId, token);
  return dataToIngest;
}

export async function prepareHolacracyProductObject(artifactIdMain,
  requiredDetails,
  artifactMetadata,
  token
){
  const [input, toolInput, toolOutput] = requiredDetails;

  const dataToIngest = prepareGenericObject(requiredDetails, artifactMetadata);
  dataToIngest.artifactName = artifactMetadata?.metadata?.content[0].name || "dummyHolacracyProductArtifactName";
  dataToIngest.artifactId = artifactIdMain;
  dataToIngest.type = "molecule";
  dataToIngest.artifactType = "brick";

  console.log(dataToIngest)
  await helperToCreateInstance([dataToIngest], token);

  return dataToIngest
}

export async function prepareHolacracyPlatformObject(artifactIdMain,
  requiredDetails,
  artifactMetadata,
  token
){
  const [input, toolInput, toolOutput] = requiredDetails;

  const dataToIngest = prepareGenericObject(requiredDetails, artifactMetadata);
  dataToIngest.artifactName = artifactMetadata?.metadata?.content[0].name || "dummyHolacracyPlatformArtifactName";
  dataToIngest.artifactId = artifactIdMain;
  dataToIngest.type = "molecule";
  dataToIngest.artifactType = "brick";

  console.log(dataToIngest)
  await helperToCreateInstance([dataToIngest], token);

  return dataToIngest
}
