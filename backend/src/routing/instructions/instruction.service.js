/**
 * Generates human-readable turn-by-turn navigation instructions and floor transition metadata.
 */
function generateInstructions(pathNodes, pathEdges) {
  if (!pathNodes || pathNodes.length <= 1) {
    const destName = pathNodes && pathNodes.length === 1 ? pathNodes[0].name : 'your destination';
    return { instructions: [`You have arrived at ${destName}.`], floor_transitions: [] };
  }

  const instructions = [];
  const floorTransitions = [];

  for (let i = 0; i < pathNodes.length - 1; i++) {
    const currentNode = pathNodes[i];
    const nextNode = pathNodes[i + 1];
    const edge = pathEdges[i];

    const distMeters = edge ? Math.round(edge.distance_meters) : 0;
    const distStr = distMeters > 0 ? ` (${distMeters}m)` : '';

    // Floor transition check
    if (currentNode.floor !== nextNode.floor) {
      const transitionType = edge ? edge.edge_type : (nextNode.type === 'elevator' ? 'elevator' : 'stairs');
      floorTransitions.push({
        from_floor: currentNode.floor,
        to_floor: nextNode.floor,
        transition_type: transitionType,
        node_id: currentNode.id
      });

      if (transitionType === 'elevator') {
        instructions.push(`Take the elevator to Floor ${nextNode.floor}.`);
      } else if (transitionType === 'stairs') {
        instructions.push(`Take the stairs to Floor ${nextNode.floor}.`);
      } else {
        instructions.push(`Proceed to Floor ${nextNode.floor}.`);
      }
      continue;
    }

    // Step-by-step instruction by edge type & node type
    const isDestination = (i === pathNodes.length - 2);

    if (edge && edge.edge_type === 'outdoor_path') {
      if (nextNode.type === 'entrance') {
        instructions.push(`Walk ${distMeters}m along the outdoor path toward ${nextNode.name}.`);
      } else {
        instructions.push(`Walk ${distMeters}m along the outdoor path toward ${nextNode.name}.`);
      }
    } else if (edge && edge.edge_type === 'entrance') {
      instructions.push(`Enter ${nextNode.name || currentNode.name} through the entrance.`);
    } else if (edge && edge.edge_type === 'ramp') {
      instructions.push(`Use accessible ramp toward ${nextNode.name}${distStr}.`);
    } else if (edge && edge.edge_type === 'elevator') {
      instructions.push(`Take the elevator to ${nextNode.name}.`);
    } else if (edge && edge.edge_type === 'stairs') {
      instructions.push(`Take the stairs to ${nextNode.name}.`);
    } else if (isDestination) {
      instructions.push(`Continue ${distMeters}m along the corridor to destination: ${nextNode.name}.`);
      instructions.push(`You have arrived at ${nextNode.name}.`);
    } else {
      instructions.push(`Continue ${distMeters}m along the corridor toward ${nextNode.name}.`);
    }
  }

  return {
    instructions,
    floor_transitions: floorTransitions
  };
}

module.exports = {
  generateInstructions
};
