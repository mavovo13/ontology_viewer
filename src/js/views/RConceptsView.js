class RConceptsView {
  constructor() {
    this._cy = null;
    this._containerEl = null;
    this._needsLayout = false;
  }

  init(containerEl) {
    this._containerEl = containerEl;
  }

  render({ nodes, edges }) {
    if (this._cy) {
      this._cy.destroy();
      this._cy = null;
    }

    this._needsLayout = true;
    this._cy = cytoscape({
      container: this._containerEl,
      elements: { nodes, edges },
      style: [
        {
          selector: 'node[kind="R"]',
          style: {
            'background-color': '#1a1000',
            'border-width': 1,
            'border-color': '#ffb547',
            'label': 'data(label)',
            'color': '#ffb547',
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
          },
        },
        {
          selector: 'node[kind="W"]',
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
            'width': 1,
            'line-color': '#ffb547',
            'target-arrow-color': '#ffb547',
            'target-arrow-shape': 'triangle',
            'curve-style': 'bezier',
            'label': 'data(label)',
            'font-size': '10px',
            'font-family': '"JetBrains Mono", "SF Mono", Menlo, monospace',
            'color': '#6e9285',
            'text-background-color': '#05080a',
            'text-background-opacity': 0.9,
            'text-background-padding': '3px',
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
    if (this._cy && this._needsLayout) {
      this._needsLayout = false;
      this._cy.resize();
      this._cy.layout({
        name: 'elk',
        elk: {
          algorithm: 'layered',
          'elk.direction': 'DOWN',
          'elk.layered.spacing.nodeNodeBetweenLayers': 50,
          'elk.spacing.nodeNode': 20,
        },
      }).run();
    }
  }

  hide() {
    this._containerEl.style.display = 'none';
  }
}
