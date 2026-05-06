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
            'background-color': '#0f1518',
            'border-width': 1,
            'border-color': '#7dffb0',
            'label': 'data(label)',
            'color': '#7dffb0',
            'text-valign': 'center',
            'text-halign': 'center',
            'shape': 'rectangle',
            'width': 'label',
            'height': 'label',
            'padding': '12px',
            'font-size': '12px',
            'font-family': '"JetBrains Mono", "SF Mono", Menlo, monospace',
            'text-wrap': 'wrap',
            'text-max-width': '180px',
            'text-outline-width': 0,
          },
        },
        {
          selector: 'node:selected',
          style: {
            'border-width': 2,
            'border-color': '#ffb547',
            'background-color': '#1c262b',
            'color': '#ffb547',
          },
        },
        {
          selector: 'edge',
          style: {
            'width': 2,
            'line-color': '#7dffb0',
            'target-arrow-color': '#7dffb0',
            'target-arrow-shape': 'triangle',
            'curve-style': 'bezier',
            'arrow-scale': 0.8,
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
