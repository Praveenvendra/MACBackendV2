import { fetchArtifactMetadata } from "../api/fetchArtifactMetadata.js";
import { schemaCreation } from "../api/schemaCreation.js";
import { updateSchema } from "../api/UpdateSchema.js";
import { PI_COHORTS_SERVICE, PI_ENTITY_SERVICE } from "../config/constants.js";
import { extractFilters } from "./helperFunctions.js";

function addSiblings(source, destination) {
  source.siblingIds.push(destination.artifactId);
  destination.siblingIds.push(source.artifactId);
  source.siblingIds = [...new Set(source.siblingIds)];
  destination.siblingIds = [...new Set(destination.siblingIds)];
  return [source, destination];
}

function genericUpdates(source, destination) {
  source.createdBy = destination.createdBy;
  source.agentId = destination.agentId;
  source.reusability = "deployed";
  source.parentId = [destination.artifactId];
  source.id = Math.floor(Math.random() * 1_000_000_000);
  destination.childrenIds.push(source.artifactId);
  destination.childrenIds = [...new Set(destination.childrenIds)];
  return [source, destination];
}

async function updateCohortToCohort(source, destination, token) {
  const sourceType = source.artifactType;
  const destinationType = destination.artifactType;

  const sourceCohortId = source.artifactId;
  const destinationCohortId = destination.artifactId;

  

  const result = await fetchArtifactMetadata(
    PI_COHORTS_SERVICE,
    sourceCohortId,
    token
  );

//   console.log("result : ", result);
  const query = result.metadata.model.definitionRequest.rawQueryMap.TIDB;

//   console.log("query : ", query);
  const columns = extractFilters(query);

  console.log("colimns : ", columns);

  // if(source.childrenIds[0] !== destination.childrenIds[0]){
  //     throw new Error(`Interaction not possible: Source "${sourceType}" cannot interact with destination "${destinationType}" because it has different schemaID.`);
  // }

  // return addSiblings(source, destination)

  return null;
}

function updateCohortToEntity(source, destination) {
  const sourceType = source.artifactType;
  const destinationType = destination.artifactType;
  if (source.childrenIds[0] !== destination.artifactId) {
    throw new Error(
      `Interaction not possible: Source "${sourceType}" cannot interact with destination "${destinationType}" because it has different schemaID.`
    );
  }
  source.childrenIds.push(destination.artifactId);
  destination.parentId.push(source.artifactId);
  source.childrenIds = [...new Set(source.childrenIds)];
  destination.parentId = [...new Set(destination.parentId)];
  return [source, destination];
}

function updateCohortToBQ(source, destination) {
  const sourceType = source.artifactType;
  const destinationType = destination.artifactType;
  if (!destination.childrenIds.includes(source.childrenIds[0])) {
    throw new Error(
      `Interaction not possible: Source "${sourceType}" cannot interact with destination "${destinationType}" because it has different schemaID.`
    );
  }
  return addSiblings(source, destination);
}

function updateContextToContext(source, destination) {
  const sourceType = source.artifactType;
  const destinationType = destination.artifactType;
  if (source.childrenIds[0] !== destination.childrenIds[0]) {
    throw new Error(
      `Interaction not possible: Source "${sourceType}" cannot interact with destination "${destinationType}" because it has different schemaID.`
    );
  }
  return addSiblings(source, destination);
}

function updateContextToCohort(source, destination) {
  const sourceType = source.artifactType;
  const destinationType = destination.artifactType;
  if (source.childrenIds[0] !== destination.childrenIds[0]) {
    throw new Error(
      `Interaction not possible: Source "${sourceType}" cannot interact with destination "${destinationType}" because it has different schemaID.`
    );
  }
  return addSiblings(source, destination);
}

async function updateEntityToEntity(source, destination, token, type){
    const sourceType = source.artifactType
    const destinationType = destination.artifactType
    // fetch the API's Metadata then create or update Destination Schema
    // get source schema metadata
    const sourceMetadata = await fetchArtifactMetadata(PI_ENTITY_SERVICE, source.artifactId, token)
    const destinationMetadata = await fetchArtifactMetadata(PI_ENTITY_SERVICE, destination.artifactId, token)
    if(type === "create"){
        const newSchemaMetadata = {}
        newSchemaMetadata.name = destinationMetadata?.metadata?.name + "_" + sourceMetadata?.metadata?.name + "_" + Date.now()
        newSchemaMetadata.description = destinationMetadata?.metadata?.description
        newSchemaMetadata.dataReadAccess = "PUBLIC"
        newSchemaMetadata.dataWriteAccess = "PUBLIC"
        newSchemaMetadata.metadataReadAccess = "PUBLIC"
        newSchemaMetadata.metadataWriteAccess = "PUBLIC"
        newSchemaMetadata.universes = destinationMetadata?.metadata?.universes
        newSchemaMetadata.tags = destinationMetadata?.metadata?.tags
        newSchemaMetadata.primaryDb = destinationMetadata?.metadata?.primaryDb
        newSchemaMetadata.piFeatures = destinationMetadata?.metadata?.piFeatures
        newSchemaMetadata.oltpFeature = destinationMetadata?.metadata?.oltpFeature

        newSchemaMetadata.attributes = []
        const sourceAttributes = sourceMetadata?.metadata?.attributesMap || {};
        const destinationAttributes = destinationMetadata?.metadata?.attributesMap || {};
        const mergedAttributes = { ...sourceAttributes, ...destinationAttributes };
        // Convert merged object to array of value object
        newSchemaMetadata.attributes = Object.entries(mergedAttributes).map(([key, value]) => ({ ...value }));

        newSchemaMetadata.primaryKey = destinationMetadata?.metadata?.primaryKey
        newSchemaMetadata.execute = "PUBLIC"
        newSchemaMetadata.visibility = "PUBLIC"

        await schemaCreation(newSchemaMetadata, token)
    }
    else if(type === "update"){
        const updateSchemaMetadata = {}
        updateSchemaMetadata.universes = destinationMetadata?.metadata?.universes
        const sourceAttributes = sourceMetadata?.metadata?.attributesMap || {};
        const destinationAttributes = destinationMetadata?.metadata?.attributesMap || {};
        const addAttributes = []
        for(const [key, value] of Object.entries(sourceAttributes)){
            // console.log(key, value)
            if(!destinationAttributes.hasOwnProperty(key)) addAttributes.push(value)
        }
        updateSchemaMetadata.addAttributes = addAttributes
        await updateSchema(updateSchemaMetadata, destinationMetadata?.metadata?.id, token)
    }
    
    
    // get dest schema metadata
    // if(source.childrenIds[0] !== destination.artifactId){
    //     throw new Error(`Interaction not possible: Source "${sourceType}" cannot interact with destination "${destinationType}" because it has different schemaID.`);
    // }
    // source.childrenIds.push(destination.artifactId)
    // destination.parentId.push(source.artifactId)
    // source.childrenIds = [...new Set(source.childrenIds)]
    // destination.parentId = [...new Set(destination.parentId)]
    return [source, destination]
}

async function updateEntityToCohort(source, destination, token, type) {
  const sourceMetadata = await fetchArtifactMetadata(
    PI_ENTITY_SERVICE,
    source.artifactId,
    token
  );
  const destinationMetadata = await fetchArtifactMetadata(
    PI_COHORTS_SERVICE,
    destination.artifactId,
    token
  );
  // take query from dest and get the atrribute from the query
  // destinationMetadata?.model?.definitionRequest?.rawQueryMap?.TIDB
}

export async function correctUpdatesForSourceAndDest(
  source,
  destination,
  token,
  type
) {
  if (
    source.artifactType.toLowerCase() === "cohort" &&
    destination.artifactType.toLowerCase() === "cohort"
  ) {
    return updateCohortToCohort(source, destination, token);
  } else if (
    source.artifactType.toLowerCase() === "cohort" &&
    (destination.artifactType.toLowerCase() === "schema" ||
      destination.artifactType.toLowerCase() === "entity" ||
      destination.artifactType.toLowerCase() === "entityschema")
  ) {
    return updateCohortToEntity(source, destination);
  } else if (
    source.artifactType.toLowerCase() === "cohort" &&
    destination.artifactType.toLowerCase() === "bigquery"
  ) {
    return updateCohortToBQ(source, destination);
  } else if (
    source.artifactType.toLowerCase() === "context" &&
    destination.artifactType.toLowerCase() === "context"
  ) {
    return updateContextToContext(source, destination);
  } else if (
    source.artifactType.toLowerCase() === "context" &&
    destination.artifactType.toLowerCase() === "cohort"
  ) {
    return updateContextToCohort(source, destination);
  } else if (
    (destination.artifactType.toLowerCase() === "schema" ||
      destination.artifactType.toLowerCase() === "entity" ||
      destination.artifactType.toLowerCase() === "entityschema") &&
    (destination.artifactType.toLowerCase() === "schema" ||
      destination.artifactType.toLowerCase() === "entity" ||
      destination.artifactType.toLowerCase() === "entityschema")
  ) {
    return await updateEntityToEntity(source, destination, token, type);
  } else {
    return genericUpdates(source, destination);
  }
}
