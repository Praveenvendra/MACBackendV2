export const schemaId = "6798a3d828ed6325a787f78a";
export const API_ENDPOINT = 'https://ig.gov-cloud.ai/tf-entity-ingestion/v1.0/schemas';
export const PI_ENTITY_SERVICE = 'https://ig.gov-cloud.ai/pi-entity-service-dbaas/v1.0/schemas'
export const PI_ENTITY_INSTANCES_SERVICE = 'https://ig.gov-cloud.ai/pi-entity-instances-service/v2.0/schemas'
export const PI_COHORTS_SERVICE = 'https://ig.gov-cloud.ai/pi-cohorts-service-dbaas/v1.0/cohorts'
export const HOLACRACY_PRODUCT_SERVICE = "https://ig.gov-cloud.ai/holacracy/v2.0/products/creation/filter?productCreationIds="
export const HOLACRACY_PLATFORM_SERVICE = "https://ig.gov-cloud.ai/holacracy/v1.0/platforms/filter?platformId="
export const ADHOC = 'https://ig.gov-cloud.ai/pi-cohorts-service/v1.0/cohorts/adhoc'




export const HEADERS = () => ({
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${process.env.API_TOKEN}`,
});
