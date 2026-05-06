class SidePanel {
  init(panelEl) {
    this._panelEl = panelEl;
    this._contentEl = panelEl.querySelector('.side-panel__content');
    this._closeBtn = panelEl.querySelector('.side-panel__close');

    if (this._closeBtn) {
      this._closeBtn.addEventListener('click', () => this.hide());
    }
  }

  show(concept, relatedRelations) {
    this._panelEl.classList.add('side-panel--visible');

    const content = this._contentEl;
    while (content.firstChild) {
      content.removeChild(content.firstChild);
    }

    const titleEl = document.createElement('h2');
    titleEl.className = 'side-panel__concept-title';
    titleEl.textContent = concept.label;
    content.appendChild(titleEl);

    const kindEl = document.createElement('p');
    kindEl.className = 'side-panel__kind';
    kindEl.textContent = concept.kind === 'W' ? 'W_CONCEPTS（継承概念）' : 'R_CONCEPTS（制約概念）';
    content.appendChild(kindEl);

    if (concept.slots && concept.slots.length > 0) {
      const slotHeader = document.createElement('h3');
      slotHeader.className = 'side-panel__section-title';
      slotHeader.textContent = 'スロット定義';
      content.appendChild(slotHeader);

      const slotList = document.createElement('ul');
      slotList.className = 'side-panel__slot-list';

      concept.slots.forEach(slot => {
        const li = document.createElement('li');
        li.className = 'side-panel__slot-item';

        const namePart = document.createTextNode(slot.name);
        li.appendChild(namePart);

        if (slot.type) {
          const typePart = document.createElement('span');
          typePart.className = 'side-panel__slot-type';
          typePart.textContent = ': ' + slot.type;
          li.appendChild(typePart);
        }

        if (slot.cardinality) {
          const cardPart = document.createElement('span');
          cardPart.className = 'side-panel__slot-cardinality';
          cardPart.textContent = ' [' + slot.cardinality + ']';
          li.appendChild(cardPart);
        }

        slotList.appendChild(li);
      });

      content.appendChild(slotList);
    }

    if (concept.isaParents && concept.isaParents.length > 0) {
      const isaHeader = document.createElement('h3');
      isaHeader.className = 'side-panel__section-title';
      isaHeader.textContent = 'ISA親概念';
      content.appendChild(isaHeader);

      const isaList = document.createElement('ul');
      isaList.className = 'side-panel__isa-list';

      concept.isaParents.forEach(parentId => {
        const li = document.createElement('li');
        li.textContent = parentId;
        isaList.appendChild(li);
      });

      content.appendChild(isaList);
    }

    if (relatedRelations && relatedRelations.length > 0) {
      const relHeader = document.createElement('h3');
      relHeader.className = 'side-panel__section-title';
      relHeader.textContent = '制約関係';
      content.appendChild(relHeader);

      const relList = document.createElement('ul');
      relList.className = 'side-panel__relation-list';

      relatedRelations.forEach(rel => {
        const li = document.createElement('li');
        li.className = 'side-panel__relation-item';
        li.textContent = rel.label + ' (' + rel.type + ')';
        relList.appendChild(li);
      });

      content.appendChild(relList);
    }
  }

  hide() {
    this._panelEl.classList.remove('side-panel--visible');
  }
}
