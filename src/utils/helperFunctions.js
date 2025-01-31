export function extractFilters(query) {
    const whereClauseMatch = query.match(/where\s+(.+)/i);
    if (!whereClauseMatch) return {};

    const whereClause = whereClauseMatch[1];

    // Enhanced regex to match key-value pairs, including !=, IS NULL, IS NOT NULL
    const regex = /(\w+)\s*(=|!=|<=|>=|<|>|IS NOT NULL|IS NULL)\s*'?(.*?)'?\s*(?:AND|OR|$)/gi;
    let match;
    let filters = {};

    while ((match = regex.exec(whereClause)) !== null) {
        const key = match[1];
        const operator = match[2];
        const value = match[3] || null; // Handle NULL cases

        filters[key] = { operator, value };
    }
    // return key and value and operator
    return Object.keys(filters);
}