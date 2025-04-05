// export async function executeFlow(nodes, edges, leadData, emailData) {
//   // Find the starting node (usually LeadSourceNode)
//   const startNode = nodes.find((node) => node.type === "leadSource");

//   let currentNode = startNode;
//   const executedNodes = new Set();
//   const results = [];

//   while (currentNode && !executedNodes.has(currentNode.id)) {
//     executedNodes.add(currentNode.id);

//     // Process the current node
//     const result = await processNode(currentNode, leadData, emailData);
//     results.push(result);

//     // Find next node(s)
//     const outgoingEdges = edges.filter(
//       (edge) => edge.source === currentNode.id
//     );
//     if (outgoingEdges.length > 0) {
//       // If there are outgoing edges, choose the first one for simplicity
//       const nextEdge = outgoingEdges[0];
//       currentNode = nodes.find((node) => node.id === nextEdge.target);
//     } else {
//       currentNode = null; // No more nodes to process
//     }
//   }

//   return results;
// }
