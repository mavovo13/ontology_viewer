document.addEventListener('DOMContentLoaded', () => {
  const appState = new AppState();
  const xmlParser = new XMLParser();
  const graphBuilder = new GraphBuilder();
  const wConceptsView = new WConceptsView();
  const rConceptsView = new RConceptsView();
  const fileUploader = new FileUploader();
  const viewToggle = new ViewToggle();
  const sidePanel = new SidePanel();

  const dropZoneEl = document.getElementById('drop-zone');
  const fileInputEl = document.getElementById('file-input');
  const toggleEl = document.getElementById('view-toggle');
  const panelEl = document.getElementById('side-panel');
  const wContainerEl = document.getElementById('w-concepts-container');
  const rContainerEl = document.getElementById('r-concepts-container');
  const fitBtnEl = document.getElementById('fit-btn');
  const errorBannerEl = document.getElementById('error-banner');
  const fileNameBarEl = document.getElementById('file-name-bar');

  wConceptsView.init(wContainerEl);
  rConceptsView.init(rContainerEl);
  sidePanel.init(panelEl);
  viewToggle.init(toggleEl);

  viewToggle.setActive(VIEW_W_CONCEPTS);
  rConceptsView.hide();

  let _errorTimerId = null;
  function showError(message) {
    if (_errorTimerId) clearTimeout(_errorTimerId);
    errorBannerEl.textContent = message;
    errorBannerEl.classList.add('error-banner--visible');
    _errorTimerId = setTimeout(() => {
      errorBannerEl.classList.remove('error-banner--visible');
      _errorTimerId = null;
    }, 5000);
  }

  function hideDropZone() {
    dropZoneEl.style.display = 'none';
  }

  function bindNodeClick(cy) {
    cy.on('tap', 'node', evt => {
      const nodeId = evt.target.id();
      appState.setSelectedConcept(nodeId);
    });

    cy.on('tap', evt => {
      if (evt.target === cy) {
        appState.setSelectedConcept(null);
      }
    });
  }

  fileUploader.init(dropZoneEl, fileInputEl);

  fileUploader.onError(message => showError(message));

  fileUploader.onFileSelected((xmlText, fileName) => {
    errorBannerEl.classList.remove('error-banner--visible');
    try {
      const ontology = xmlParser.parse(xmlText);
      ontology.fileName = fileName;
      appState.setOntology(ontology);
    } catch (err) {
      showError('XMLの読み込みに失敗しました: ' + err.message);
    }
  });

  appState.subscribe(AppEvents.ONTOLOGY_LOADED, ontology => {
    hideDropZone();

    if (fileNameBarEl) {
      fileNameBarEl.textContent = ontology.fileName || '';
      fileNameBarEl.classList.add('file-name-bar--visible');
    }

    const wGraphData = graphBuilder.buildWGraph(ontology);
    const rGraphData = graphBuilder.buildRGraph(ontology);
    const wCy = wConceptsView.render(wGraphData);
    rConceptsView.render(rGraphData);

    bindNodeClick(wCy);

    const rCy = rConceptsView.getCy();
    if (rCy) {
      bindNodeClick(rCy);
    }

    const currentView = appState.activeView;
    if (currentView === VIEW_W_CONCEPTS) {
      wConceptsView.show();
      rConceptsView.hide();
    } else {
      wConceptsView.hide();
      rConceptsView.show();
    }
  });

  appState.subscribe(AppEvents.VIEW_CHANGED, view => {
    viewToggle.setActive(view);
    sidePanel.hide();
    appState.setSelectedConcept(null);

    if (view === VIEW_W_CONCEPTS) {
      wConceptsView.show();
      rConceptsView.hide();
    } else {
      wConceptsView.hide();
      rConceptsView.show();
    }
  });

  appState.subscribe(AppEvents.CONCEPT_SELECTED, conceptId => {
    if (!conceptId) {
      sidePanel.hide();
      return;
    }

    const ontology = appState.ontology;
    if (!ontology) return;

    const concept = ontology.concepts.get(conceptId);
    if (!concept) return;

    const relatedRelations = [
      ...ontology.isaRelations.filter(r => r.source === conceptId || r.target === conceptId),
      ...ontology.arcRelations.filter(r => r.source === conceptId || r.target === conceptId),
    ];

    const isaParentsLabeled = concept.isaParents.map(parentId => {
      const parent = ontology.concepts.get(parentId);
      return parent ? parent.label : parentId;
    });

    const conceptWithLabels = { ...concept, isaParents: isaParentsLabeled };

    sidePanel.show(conceptWithLabels, relatedRelations);
  });

  viewToggle.onChange(view => {
    appState.setActiveView(view);
  });

  fitBtnEl.addEventListener('click', () => {
    if (appState.activeView === VIEW_W_CONCEPTS) {
      wConceptsView.fit();
    } else {
      rConceptsView.fit();
    }
  });
});
