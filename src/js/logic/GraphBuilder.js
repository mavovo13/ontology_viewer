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

    ontology.rConceptTypeIds.forEach(typeId => {
      const concept = ontology.concepts.get(typeId);
      if (concept) {
        nodes.push({ data: { id: concept.id, label: concept.label, kind: 'R' } });
      }
    });

    ontology.rConceptIsaRelations.forEach(rel => {
      edges.push({
        data: { id: rel.id, source: rel.source, target: rel.target, type: 'ISA', label: '' },
      });
    });

    return { nodes, edges };
  }
}
