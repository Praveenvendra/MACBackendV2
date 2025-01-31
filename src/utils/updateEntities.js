import { correctUpdatesForSourceAndDest } from "./correctUpdatesForSourceAndDest.js";

export  const updateEntities = async (sourceEntities, destinationEntities, token, type) => {
    const source = { ...sourceEntities[0] };
    const destination = { ...destinationEntities[0] };
    return await correctUpdatesForSourceAndDest(source, destination, token, type)
    // source.createdBy = destination.createdBy;
    // source.agentId = destination.agentId;
    // source.reusability = 'deployed';
    // source.parentId = [destination.artifactId];
    // source.id = Math.floor(Math.random() * 1_000_000_000);
    // destination.childrenIds.push(source.artifactId);
    // return [source, destination];
};


