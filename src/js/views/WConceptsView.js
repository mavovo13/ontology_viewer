const W_GRAPH_THEMES = {
  nostromo: {
    nodeBg:        '#0f1518',
    nodeBorder:    '#7dffb0',
    nodeText:      '#7dffb0',
    nodeSelBg:     '#1c262b',
    nodeSelBorder: '#ffb547',
    nodeSelText:   '#ffb547',
    edgeLine:      '#7dffb0',
  },
  amber: {
    nodeBg:        '#0e0b00',
    nodeBorder:    '#ffb547',
    nodeText:      '#ffb547',
    nodeSelBg:     '#1c1600',
    nodeSelBorder: '#7dffb0',
    nodeSelText:   '#7dffb0',
    edgeLine:      '#ffb547',
  },
  folio: {
    nodeBg:        '#ede9df',
    nodeBorder:    '#2a5f8f',
    nodeText:      '#2a5f8f',
    nodeSelBg:     '#d8d2c4',
    nodeSelBorder: '#1e4d7a',
    nodeSelText:   '#1e4d7a',
    edgeLine:      '#2a5f8f',
  },
  void: {
    nodeBg:        '#0e0e0e',
    nodeBorder:    '#d0d0d0',
    nodeText:      '#d0d0d0',
    nodeSelBg:     '#282828',
    nodeSelBorder: '#ffffff',
    nodeSelText:   '#ffffff',
    edgeLine:      '#d0d0d0',
  },
};

class WConceptsView {
  constructor() {
    this._cy = null;
    this._containerEl = null;
  }

  init(containerEl) {
    this._containerEl = containerEl;
  }

  _buildStyle(themeId) {
    const t = W_GRAPH_THEMES[themeId] || W_GRAPH_THEMES.nostromo;
    return [
      {
        selector: 'node',
        style: {
          'background-color': t.nodeBg,
          'border-width': 1,
          'border-color': t.nodeBorder,
          'label': 'data(label)',
          'color': t.nodeText,
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
          'border-color': t.nodeSelBorder,
          'background-color': t.nodeSelBg,
          'color': t.nodeSelText,
        },
      },
      {
        selector: 'edge',
        style: {
          'width': 2,
          'line-color': t.edgeLine,
          'target-arrow-color': t.edgeLine,
          'target-arrow-shape': 'triangle',
          'curve-style': 'bezier',
          'arrow-scale': 0.8,
        },
      },
    ];
  }

  render({ nodes, edges }) {
    if (this._cy) {
      this._cy.destroy();
      this._cy = null;
    }

    const themeId = document.documentElement.dataset.theme || 'nostromo';

    this._cy = cytoscape({
      container: this._containerEl,
      elements: { nodes, edges },
      style: this._buildStyle(themeId),
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

  updateTheme(themeId) {
    if (!this._cy) return;
    this._cy.style(this._buildStyle(themeId));
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
