const AppEvents = {
  ONTOLOGY_LOADED: 'ontologyLoaded',
  VIEW_CHANGED: 'viewChanged',
  CONCEPT_SELECTED: 'conceptSelected',
};

const VIEW_W_CONCEPTS = 'W_CONCEPTS';
const VIEW_R_CONCEPTS = 'R_CONCEPTS';

class AppState {
  constructor() {
    this.ontology = null;
    this.activeView = VIEW_W_CONCEPTS;
    this.selectedConceptId = null;
    this._listeners = {};
  }

  subscribe(event, listener) {
    if (!this._listeners[event]) {
      this._listeners[event] = [];
    }
    this._listeners[event].push(listener);
  }

  emit(event, payload) {
    const listeners = this._listeners[event] || [];
    listeners.forEach(fn => fn(payload));
  }

  setOntology(ontology) {
    this.ontology = ontology;
    this.selectedConceptId = null;
    this.emit(AppEvents.ONTOLOGY_LOADED, ontology);
  }

  setActiveView(view) {
    this.activeView = view;
    this.emit(AppEvents.VIEW_CHANGED, view);
  }

  setSelectedConcept(conceptId) {
    this.selectedConceptId = conceptId;
    this.emit(AppEvents.CONCEPT_SELECTED, conceptId);
  }
}
