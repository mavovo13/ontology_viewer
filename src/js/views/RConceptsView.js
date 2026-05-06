const R_GRAPH_THEMES = {
  nostromo: {
    rNodeBg:       '#1a1000',
    rNodeBorder:   '#ffb547',
    rNodeText:     '#ffb547',
    wNodeBg:       '#0f1518',
    wNodeBorder:   '#7dffb0',
    wNodeText:     '#7dffb0',
    nodeSelBg:     '#1c262b',
    nodeSelBorder: '#ffb547',
    nodeSelText:   '#ffb547',
    edgeLine:      '#ffb547',
    edgeLabelText: '#6e9285',
    edgeLabelBg:   '#05080a',
  },
  amber: {
    rNodeBg:       '#001400',
    rNodeBorder:   '#7dffb0',
    rNodeText:     '#7dffb0',
    wNodeBg:       '#0e0b00',
    wNodeBorder:   '#ffb547',
    wNodeText:     '#ffb547',
    nodeSelBg:     '#1c1600',
    nodeSelBorder: '#7dffb0',
    nodeSelText:   '#7dffb0',
    edgeLine:      '#7dffb0',
    edgeLabelText: '#a08050',
    edgeLabelBg:   '#080600',
  },
  folio: {
    rNodeBg:       '#f3f0e8',
    rNodeBorder:   '#c0392b',
    rNodeText:     '#c0392b',
    wNodeBg:       '#ede9df',
    wNodeBorder:   '#2a5f8f',
    wNodeText:     '#2a5f8f',
    nodeSelBg:     '#d8d2c4',
    nodeSelBorder: '#1e4d7a',
    nodeSelText:   '#1e4d7a',
    edgeLine:      '#c0392b',
    edgeLabelText: '#4a6a8a',
    edgeLabelBg:   '#f8f6f0',
  },
  void: {
    rNodeBg:       '#141414',
    rNodeBorder:   '#888888',
    rNodeText:     '#888888',
    wNodeBg:       '#0e0e0e',
    wNodeBorder:   '#d0d0d0',
    wNodeText:     '#d0d0d0',
    nodeSelBg:     '#282828',
    nodeSelBorder: '#ffffff',
    nodeSelText:   '#ffffff',
    edgeLine:      '#888888',
    edgeLabelText: '#707070',
    edgeLabelBg:   '#080808',
  },
};

class RConceptsView {
  constructor() {
    this._cy = null;
    this._containerEl = null;
    this._needsLayout = false;
  }

  init(containerEl) {
    this._containerEl = containerEl;
  }

  _buildStyle(themeId) {
    const t = R_GRAPH_THEMES[themeId] || R_GRAPH_THEMES.nostromo;
    return [
      {
        selector: 'node[kind="R"]',
        style: {
          'background-color': t.rNodeBg,
          'border-width': 1,
          'border-color': t.rNodeBorder,
          'label': 'data(label)',
          'color': t.rNodeText,
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
          'background-color': t.wNodeBg,
          'border-width': 1,
          'border-color': t.wNodeBorder,
          'label': 'data(label)',
          'color': t.wNodeText,
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
          'label': 'data(label)',
          'font-size': '10px',
          'font-family': '"JetBrains Mono", "SF Mono", Menlo, monospace',
          'color': t.edgeLabelText,
          'text-background-color': t.edgeLabelBg,
          'text-background-opacity': 0.9,
          'text-background-padding': '3px',
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

    this._needsLayout = true;
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
