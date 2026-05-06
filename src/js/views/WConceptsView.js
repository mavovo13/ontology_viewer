class WConceptsView {
  constructor() {
    this._cy = null;
    this._containerEl = null;
  }

  init(containerEl) {
    this._containerEl = containerEl;
  }

  render({ nodes, edges }) {
    if (this._cy) {
      this._cy.destroy();
      this._cy = null;
    }

    this._cy = cytoscape({
      container: this._containerEl,
      elements: { nodes, edges },
      style: [
        {
          selector: 'node',
          style: {
            'background-color': '#4A90D9',
            'label': 'data(label)',
            'color': '#fff',
            'text-valign': 'center',
            'text-halign': 'center',
            'shape': 'round-rectangle',
            'width': 'label',
            'height': 'label',
            'padding': '10px',
            'font-size': '13px',
            'font-family': 'sans-serif',
            'text-wrap': 'wrap',
            'text-max-width': '180px',
          },
        },
        {
          selector: 'node:selected',
          style: {
            'border-width': 3,
            'border-color': '#F5A623',
          },
        },
        {
          selector: 'edge',
          style: {
            'width': 2,
            'line-color': '#999',
            'target-arrow-color': '#999',
            'target-arrow-shape': 'triangle',
            'curve-style': 'bezier',
          },
        },
      ],
      layout: {
        name: 'elk',
        elk: {
          algorithm: 'layered',
          'elk.direction': 'DOWN',
          'elk.layered.spacing.nodeNodeBetweenLayers': 50,
          'elk.spacing.nodeNode': 20,
        },
      },
    });

    return this._cy;
  }

  fit() {
    if (this._cy) {
      this._cy.fit();
    }
  }

  getCy() {
    return this._cy;
  }

  destroy() {
    if (this._cy) {
      this._cy.destroy();
      this._cy = null;
    }
  }

  show() {
    this._containerEl.style.display = 'block';
  }

  hide() {
    this._containerEl.style.display = 'none';
  }
}
