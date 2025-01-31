import { fetchArtifactData } from "../api/fetchEntityData.js";

function calculateChildArtifactTypeCounts(artifactId, artifactsMap, IncludeInnerArtifactIds) {
    const artifact = artifactsMap[artifactId];
    if (!artifact) return { innerArtifactCount: {}, innerArtifactDetails: {} };

    if (!artifact.childrenIds || artifact.childrenIds.length === 0) {
        console.log(`Artifact with ID: ${artifactId} does not contain any inner cards.`);
        return { innerArtifactCount: {}, innerArtifactDetails: {} };
    }

    const result = artifact.childrenIds.reduce(
        (acc, childId) => {

            console.log("Before Processing - acc:", JSON.stringify(acc, null, 2)); 
            const childArtifact = artifactsMap[childId];

            if (childArtifact) {
                const type = childArtifact.type.toLowerCase(); 
                
                
                acc.innerArtifactCount[type] = (acc.innerArtifactCount[type] || 0) + 1;
                
                console.log("Updated Count - acc:", JSON.stringify(acc, null, 2));
                

                if (IncludeInnerArtifactIds) {
                    acc.innerArtifactDetails[type] = acc.innerArtifactDetails[type] || [];
                    acc.innerArtifactDetails[type].push(childArtifact.artifactId);
                }
                

                const childDescendantDetails = calculateChildArtifactTypeCounts(childId, artifactsMap,IncludeInnerArtifactIds);

                
                for (const [descendantType, count] of Object.entries(childDescendantDetails.innerArtifactCount || {})) {
                    acc.innerArtifactCount[descendantType] = (acc.innerArtifactCount[descendantType] || 0) + count;
                }

                if(IncludeInnerArtifactIds) { 
                for (const [descendantType, descendantIds] of Object.entries(childDescendantDetails.innerArtifactDetails || {})) {
                    acc.innerArtifactDetails[descendantType] = acc.innerArtifactDetails[descendantType] || [];
                    acc.innerArtifactDetails[descendantType].push(...descendantIds);
                }
            }
            }
            return acc;
        },
        { innerArtifactCount: {}, innerArtifactDetails: {} }
    );

    return result;
}

export async function generateChildTypeCounts(artifactId, IncludeInnerArtifactIds, token) {
    try {
        
        const inputData = await fetchArtifactData(token);
        console.log("Fetched data:", inputData);

        const artifactsMap = inputData.reduce((map, artifact) => {
            map[artifact.artifactId] = artifact;
            return map;
        }, {});

    
        const rootArtifact = artifactsMap[artifactId];
        if (!rootArtifact) {
            console.error(`Artifact with ID: ${artifactId} not found.`);
            return { error: `Artifact with ID: ${artifactId} not found.` };
        }

        if (!rootArtifact.childrenIds || rootArtifact.childrenIds.length === 0) {
            console.log(`Artifact with ID: ${artifactId} does not contain any inner cards.`);
            return { error: `Artifact with ID: ${artifactId} does not contain any inner cards.` };
        }

       
        const childTypeCounts = calculateChildArtifactTypeCounts(artifactId, artifactsMap,IncludeInnerArtifactIds);
        console.log("Successfully fetched artifact counts:", childTypeCounts);

        if (!IncludeInnerArtifactIds) {
            delete childTypeCounts.innerArtifactDetails;
        }        

        return childTypeCounts;
    } catch (error) {
        console.error("An error occurred while generating child type counts:", error.message);
        return { error: "Failed to generate child type counts. Please try again later." };
    }
}

