// export function parseRequestBody(body) {
//   // console.log(body)
//   let toolInput = body["toolUses.toolInput"];
//   // console.log(toolInput)
//   toolInput = toolInput.replaceAll(`"`, `'`);
//   toolInput = toolInput.replaceAll("`", '"');
//   toolInput = toolInput.replaceAll('"[', "[");
//   toolInput = toolInput.replaceAll(']"', "]");
//   toolInput = JSON.parse(toolInput);
//   // console.log(toolInput)

//   let toolOutput = body["toolUses.toolOutput"];
//   // console.log(toolInput)
//   toolOutput = toolOutput.replaceAll(`"`, `'`);
//   toolOutput = toolOutput.replaceAll("`", '"');
//   toolOutput = toolOutput.replaceAll('"[', "[");
//   toolOutput = toolOutput.replaceAll(']"', "]");
//   toolOutput = JSON.parse(toolOutput);
//   // console.log(toolOutput, toolOutput.schemaId)
//   return [toolInput, toolOutput];
// }

function parsePiData(tool, toolInputs, toolOutputs, artifactIds) {
  // toolInputs.push(tool.toolInput);

  // Parse toolOutput and push to toolOutputs array
  const parsedOutput = JSON.parse(tool.toolOutput);
  

  // Extract schemaId or id and push to artifactIds array
  if (parsedOutput.schemaId) {
    artifactIds.push(parsedOutput.schemaId);
    toolInputs.push(tool.toolInput)
    toolOutputs.push(parsedOutput);
  } else if (parsedOutput.id) {
    artifactIds.push(parsedOutput.id);
    toolInputs.push(tool.toolInput)
    toolOutputs.push(parsedOutput);
  }
}

function parseBobWorkflowData(tool, toolInputs, toolOutputs, artifactIds) {
  let toolOutput;
  if (tool?.toolOutput) toolOutput = JSON.parse(tool.toolOutput);

  if (toolOutput?.xml) {
    // Parse the XML string into an XML document object
    const regex = /<bpmn:process[^>]*\sid=['"]([^'"]+)['"]/;
    const match = toolOutput.xml.match(regex);

    if (match) {
      let processId = match[1].trim();
      processId = processId.trim()
      // console.log(match)
      console.log("BobWorkflowID found : -", processId); // Output: "GaianWorkflows1736940225846"
      artifactIds.push(processId);
      toolOutputs.push(toolOutput);
      toolInputs.push(tool?.toolInput);
    } else {
      console.log("Process id not found.");
    }
  } else {
    console.log('The "xml" key is not present in the object.');
  }
}

function parseHolacracyData(tool, toolInputs, toolOutputs, artifactIds){
  let toolOutput = JSON.parse(tool.toolOutput)
  toolOutput = toolOutput?.content[0]
  if(toolOutput?.id){
    toolOutputs.push(toolOutput)
    toolInputs.push(tool.toolInput)
    artifactIds.push(toolOutput?.id)
  }
}

export function parseRequestBody(response) {
  const toolInputs = [];
  const toolOutputs = [];
  const artifactIds = [];

  // Loop through agentReasoning array
  for (const agent of response.agentReasoning) {
    // Loop through usedTools array
    for (const tool of agent.usedTools) {
      // Push toolInput to toolInputs array
      if (tool.tool.includes("pi_create") || tool.tool.toLowerCase().includes("bigquery") || tool.tool.toLowerCase().includes("cohort") || tool.tool.toLowerCase().includes("context")) {
        parsePiData(tool, toolInputs, toolOutputs, artifactIds);
      } else if (tool.tool.includes("XML_Generator_Tool1")) {
        parseBobWorkflowData(tool, toolInputs, toolOutputs, artifactIds);
      }
      else if(tool.tool.includes("holacracy")){
        parseHolacracyData(tool, toolInputs, toolOutputs, artifactIds)
      }
    }
  }
  return { toolInputs, toolOutputs, artifactIds };
}

// export function parseRequestBody(response) {
//   const toolInputs = [];
//   const toolOutputs = [];
//   const artifactIds = [];

//   // Loop through agentReasoning array
//   for (const agent of response.agentReasoning) {
//     // Check if agentName contains "PI_AGENT"
//     if (agent.agentName.includes("PI_AGENT")) {
//       // Loop through usedTools array
//       for (const tool of agent.usedTools) {
//         // Push toolInput to toolInputs array
//         toolInputs.push(tool.toolInput);

//         // Parse toolOutput and push to toolOutputs array
//         const parsedOutput = JSON.parse(tool.toolOutput);
//         toolOutputs.push(parsedOutput);

//         // Extract schemaId or id and push to artifactIds array
//         if (parsedOutput.schemaId) {
//           artifactIds.push(parsedOutput.schemaId);
//         } else if (parsedOutput.id) {
//           artifactIds.push(parsedOutput.id);
//         }
//       }
//     }
//     if (agent.agentName.includes("BOB_AGENT")) {
//       let toolOutput;
//       for (const tool of agent.usedTools) {
//         console.log(tool.tool);
//         if (tool?.toolOutput) toolOutput = JSON.parse(tool.toolOutput);

//         if (toolOutput?.xml) {
//           // Parse the XML string into an XML document object
//           // const regex = /<bpmn:process[^>]*\sid="([^"]+)"/;
//           const regex = /<bpmn:process[^>]*\sid=['"]([^'"]+)['"]/;
//           const match = toolOutput.xml.match(regex);

//           if (match) {
//             let processId = match[1];
//             console.log(processId); // Output: "GaianWorkflows1736940225846"
//             artifactIds.push(processId)
//             toolOutputs.push(toolOutput)
//             toolInputs.push(tool?.toolInput)
//             break; // Breaks out of the inner loop
//           } else {
//             console.log("Process id not found.");
//           }
//         } else {
//           console.log('The "xml" key is not present in the object.');
//         }
//       }
//     }
//   }
//   return { toolInputs, toolOutputs, artifactIds };
// }
