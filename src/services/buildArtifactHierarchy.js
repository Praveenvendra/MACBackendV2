import { fetchArtifactData } from "../api/fetchEntityData.js";

const buildHierarchy = (
  artifactId,
  artifactsMap,
  processedArtifacts = new Set()
) => {
  const artifact = artifactsMap[artifactId];

  if (!artifact) {
    console.warn(`Artifact with ID: ${artifactId} not found`);
    return null;
  }

  if (processedArtifacts.has(artifactId)) {
    return null;
  }

  processedArtifacts.add(artifactId);

  const uniqueChildrenIds = [...new Set(artifact.childrenIds || [])];

  const innerCardDetails = uniqueChildrenIds
    .map((childId) => buildHierarchy(childId, artifactsMap, processedArtifacts))
    .filter(Boolean);

  return {
    artifactType: artifact.artifactType,
    childrenIds: uniqueChildrenIds,
    description: artifact.description,
    reusability: artifact.reusability,
    type: artifact.type,
    artifactName: artifact.artifactName,
    artifactId: artifact.artifactId,
    innerCardDetails,
  };
};

export const buildArtifactHierarchy = async (
  artifactId,
  includeInnerCardDetails,
  token
) => {
  try {
    const inputData = await fetchArtifactData(token);

    const artifactsMap = inputData.reduce((map, artifact) => {
      map[artifact.artifactId] = artifact;
      return map;
    }, {});

    const rootArtifact = artifactsMap[artifactId];

    if (!rootArtifact) {
      return {
        message: `Artifact with ID: ${artifactId} not found`,
      };
    }

    if (!rootArtifact.childrenIds || rootArtifact.childrenIds.length === 0) {
      return {
        type: rootArtifact.type,
        artifactName: rootArtifact.artifactName,
        artifactId: rootArtifact.artifactId,
        message: `Artifact with ID: ${artifactId} is a simple artifact and does not contain children.`,
      };
    }

    if (!includeInnerCardDetails) {
      return {
        artifactType: rootArtifact.artifactType,
        childrenIds: rootArtifact.childrenIds,
        description: rootArtifact.description,
        reusability: rootArtifact.reusability,
        type: rootArtifact.type,
        artifactName: rootArtifact.artifactName,
        artifactId: rootArtifact.artifactId,
      };
    }

    const hierarchy = buildHierarchy(artifactId, artifactsMap);
    console.log("Final hierarchy response:", hierarchy);
    return hierarchy;
  } catch (error) {
    throw new Error("Failed to build artifact hierarchy: " + error.message);
  }
};
