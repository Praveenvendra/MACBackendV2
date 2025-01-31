import e from "express";
import { Router } from "express";
import {processInstances} from "../services/processInstances.js";
import { buildArtifactHierarchy } from "../services/buildArtifactHierarchy.js";
import { generateChildTypeCounts } from "../services/generateChildTypeCounts.js";
import { findCorrectArtifact } from "../services/findCorrectArtifact.js";
import { parseRequestBody } from "../utils/parseRequestBody.js";


const router = Router();
router.use(e.json());



/**
 * @swagger
 * components:
 *   schemas:
 *     Card:
 *       type: object
 *       required:
 *         - artifactId
 *         - agentId
 *         - createdBy
 *         
 *       properties:
 *         artifactId:
 *           type: string
 *           description: The artifactId of the Card
 *         name:
 *           type: string
 *           description: The name of the artifact
 *         
 *       example:
 *         id: 1
 *         name: John Doe
 */

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Get all users
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: List of users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 */
router.post("/interaction", async (req, res) => {

    const {sourceId, destinationId, type, sourceAgentId, destinationAgentId} = req.body;
    const token = req.headers['authorization'];

    if (!sourceId || !destinationId) {
      return res.status(400).json({ error: 'sourceId and destinationId are required.' });
    }

    if (!token || !token.startsWith('Bearer ')) {
      return res.status(400).json({ message: 'Authorization token is required in the format "Bearer <token>"' });
    }
  
    
    const bearerToken = token.split(' ')[1];

    try {
       const result = await processInstances(sourceId, destinationId,type,sourceAgentId,destinationAgentId,bearerToken);
        if (result.success){
           res.status(200).json({result});
    }else
    {
            res.status(500).json({result});
    }}
      catch (error) {
        res.status(500).json({
          error: 'Internal server error.',
          details: error.message,
        });
      }

});

/**
 * @swagger
 * /find-innerArtifacts:
 *   get:
 *     summary: This API endpoint retrieves the recursive hierarchy of inner artifacts in a tree structure, starting from a specified artifactId.
 *     tags: [Artifact]
 *     responses:
 *       200:
 *         description: Returns a JSON object containing the hierarchy of artifacts. A nested list (innerCardDetails) representing child artifacts.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 */
router.get("/find-innerArtifacts", async(req,res) => {

    const {artifactId,innerCardDetails} = req.query;
    const token = req.headers['authorization'];
    if(!artifactId){
      return res.status(400).json({ error: "Missing artifactId query parameter" });
    }

    if (!token || !token.startsWith('Bearer ')) {
      return res.status(400).json({ message: 'Authorization token is required in the format "Bearer <token>"' });
    }
  
    
    const bearerToken = token.split(' ')[1];

    console.log(artifactId);
    console.log(innerCardDetails);

   

    try {
      const includeInnerCardDetails = innerCardDetails === undefined || innerCardDetails !== "false"; 
      const result = await buildArtifactHierarchy(artifactId, includeInnerCardDetails,bearerToken);
      res.json(result);
  } catch (error) {
      console.error("Error:", error.message);
      res.status(500).json({ error: error.message });
  }

})


/**
 * @swagger
 * /digital-footprint:
 *   get:
 *     summary: This API endpoint retrieves the digital footprint of a card by calculating the counts of various artifact types (e.g., Entity, BQ, Brick, Context) for a given artifactId. It analyzes the hierarchy of artifacts and aggregates counts across all nested levels.
 *     tags: [Artifact]
 *     responses:
 *       200:
 *         description: Returns a JSON object containing the counts of child artifact types.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 */
router.get("/digital-footprint", async(req,res) => {
   
             const {artifactId,innerArtifactDetails} = req.query;
             const token = req.headers['authorization'];

             console.log(token);

             if(!artifactId){
              return res.status(400).json({ error: "Missing artifactId query parameter" });
             }

             if (!token || !token.startsWith('Bearer ')) {
              return res.status(400).json({ message: 'Authorization token is required in the format "Bearer <token>"' });
            }
          
            
            const bearerToken = token.split(' ')[1];

             try{
                 const IncludeInnerArtifactIds = innerArtifactDetails === "true"
                 const counts =  await generateChildTypeCounts(artifactId,IncludeInnerArtifactIds,bearerToken);
                 res.json(counts);
             }
             catch(error){
              console.error("Error:", error.message);
              res.status(500).json({ error: error.message });

             }
})


/**
 * @swagger
 * /find-artifact:
 *   post:
 *     summary: Find the artifact details of the given ArtifactIds which are present in the request body
 *     tags: [Artifact]
 *     responses:
 *       200:
 *         description: List of Artifact metadata for the given ArtifactIds 
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 */
router.post('/create-card', async (req, res) => {
  // const artifactId = req.params.artifactId;
  // console.log(req.body)
  // const [toolInput, toolOutput] = parseRequestBody(req.body);
  // const requiredDetails = [req.body, toolInput, toolOutput]
  // const artifactId = toolOutput?.schemaId || toolOutput?.id
  const {toolInputs, toolOutputs, artifactIds} = parseRequestBody(req.body);
  const token = req.headers['authorization']; // Extract Bearer token from request headers

  if (!token || !token.startsWith('Bearer ')) {
    return res.status(400).json({ message: 'Authorization token is required in the format "Bearer <token>"' });
  }

  
  const bearerToken = token.split(' ')[1];

  try {
    const allArtifacts = artifactIds.map((artifactId, index)=>
      findCorrectArtifact(artifactId, bearerToken, [req.body, toolInputs[index], toolOutputs[index]])
    );
   
    const correctArtifactsWithEmptyArray = await Promise.all(allArtifacts)
    // const correctArtifacts = correctArtifactsWithEmptyArray.filter((arr) => arr.length !== 0)
    const correctArtifacts = correctArtifactsWithEmptyArray.reduce((acc, arr) => acc.concat(arr), [])
    console.log("correctArtifacts : ", correctArtifacts)
    if (correctArtifacts.length > 0) {
      res.json({
        message: 'Correct artifact(s) found',
        data: correctArtifacts,
      });
    } else {
      res.status(404).json({
        message: 'No correct artifact found',
      });
    }
  } catch (error) {
    console.error('Error occurred:', error.message);
    res.status(500).json({
      message: 'Error occurred while fetching artifacts',
      error: error.message,
    });
  }
});




export default router;