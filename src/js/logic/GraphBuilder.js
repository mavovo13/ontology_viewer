class GraphBuilder {
  buildWGraph(ontology) {
    const nodes = [];
    const edges = [];

    ontology.concepts.forEach(concept => {
      if (concept.kind === 'W') {
        nodes.push({
          data: { id: concept.id, label: concept.label, kind: 'W' },
        });
      }
    });

    ontology.isaRelations.forEach(rel => {
      edges.push({
        data: {
          id: rel.id,
          source: rel.source,
          target: rel.target,
          type: 'ISA',
          label: '',
        },
      });
    });

    return { nodes, edges };
  }

  buildRGraph(ontology) {
    const nodes = [];
    const edges = [];
    const addedNodeIds = new Set();

    ontology.concepts.forEach(concept => {
      if (concept.kind === 'R') {
        nodes.push({
          data: { id: concept.id, label: concept.label, kind: 'R' },
        });
        addedNodeIds.add(concept.id);
      }
    });

    ontology.arcRelations.forEach(rel => {
      [rel.source, rel.target].forEach(conceptId => {
        if (!addedNodeIds.has(conceptId)) {
          const concept = ontology.concepts.get(conceptId);
          if (concept) {
            nodes.push({
              data: { id: concept.id, label: concept.label, kind: concept.kind },
            });
            addedNodeIds.add(conceptId);
          }
        }
      });

      edges.push({
        data: {
          id: rel.id,
          source: rel.source,
          target: rel.target,
          type: 'ARC',
          label: rel.label,
        },
      });
    });

    return { nodes, edges };
  }
}
