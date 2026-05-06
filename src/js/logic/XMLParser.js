class ParseError extends Error {
  constructor(message, cause) {
    super(message);
    this.name = 'ParseError';
    this.cause = cause;
  }
}

class XMLParser {
  parse(xmlText) {
    const domParser = new DOMParser();
    const doc = domParser.parseFromString(xmlText, 'application/xml');

    const parseError = doc.querySelector('parsererror');
    if (parseError) {
      throw new ParseError('XMLの解析に失敗しました: ' + parseError.textContent);
    }

    const root = doc.documentElement;
    if (!root) {
      throw new ParseError('XMLドキュメントが空です');
    }

    const wConceptsEl = root.querySelector('W_CONCEPTS');
    const rConceptsEl = root.querySelector('R_CONCEPTS');

    if (!wConceptsEl && !rConceptsEl) {
      throw new ParseError('W_CONCEPTSまたはR_CONCEPTSが見つかりませんでした');
    }

    const concepts = new Map();
    const isaRelations = [];
    const arcRelations = [];

    if (wConceptsEl) {
      this._parseWConcepts(wConceptsEl, concepts, isaRelations, arcRelations);
    }

    if (rConceptsEl) {
      this._parseRConcepts(rConceptsEl, concepts);
    }

    const fileName = root.getAttribute('filename') || '';

    return { concepts, isaRelations, arcRelations, fileName };
  }

  _parseWConcepts(wConceptsEl, concepts, isaRelations, arcRelations) {
    const labelToId = new Map();

    const conceptEls = wConceptsEl.querySelectorAll(':scope > CONCEPT');
    conceptEls.forEach(el => {
      const id = el.getAttribute('id');
      if (!id) return;

      const labelEl = el.querySelector(':scope > LABEL');
      const label = labelEl ? labelEl.textContent.trim() : id;

      const slots = this._parseSlots(el);

      const concept = { id, label, kind: 'W', slots, isaParents: [] };
      concepts.set(id, concept);
      if (labelToId.has(label)) {
        console.warn(`重複ラベルが検出されました: "${label}" (既存ID: ${labelToId.get(label)}, 新ID: ${id})`);
      } else {
        labelToId.set(label, id);
      }
    });

    const isaEls = wConceptsEl.querySelectorAll(':scope > ISA');
    isaEls.forEach(el => {
      const parentLabel = el.getAttribute('parent');
      const childLabel = el.getAttribute('child');
      const isaId = el.getAttribute('id') || `isa_${parentLabel}_${childLabel}`;

      const sourceId = labelToId.get(parentLabel);
      const targetId = labelToId.get(childLabel);

      if (sourceId && targetId) {
        isaRelations.push({
          id: isaId, source: sourceId, target: targetId, type: 'ISA', label: '',
        });

        const childConcept = concepts.get(targetId);
        if (childConcept) {
          childConcept.isaParents.push(sourceId);
        }
      }
    });

    conceptEls.forEach(el => {
      const conceptId = el.getAttribute('id');
      if (!conceptId) return;

      const relationsEl = el.querySelector(':scope > RELATIONS');
      if (!relationsEl) return;

      const rConstEls = relationsEl.querySelectorAll(':scope > R_CONST');
      rConstEls.forEach(rcEl => {
        const rcId = rcEl.getAttribute('id') || '';
        const rcLabel = rcEl.getAttribute('label') || '';

        if (!rcId) return;

        if (!concepts.has(rcId)) {
          concepts.set(rcId, { id: rcId, label: rcLabel, kind: 'R', slots: [], isaParents: [] });
        }

        const arcEls = rcEl.querySelectorAll(':scope > ARC');
        const addedConceptIds = new Set();

        arcEls.forEach(arcEl => {
          const arcValue = arcEl.textContent.trim();
          const conceptLabel = arcValue.split('$')[0];
          const arcConceptId = labelToId.get(conceptLabel);
          if (arcConceptId && !addedConceptIds.has(arcConceptId)) {
            addedConceptIds.add(arcConceptId);
            arcRelations.push({
              id: `${rcId}_arc_${arcConceptId}`,
              source: arcConceptId,
              target: rcId,
              type: 'ARC',
              label: rcLabel,
            });
          }
        });
      });
    });
  }

  _parseRConcepts(rConceptsEl, concepts) {
    const conceptEls = rConceptsEl.querySelectorAll(':scope > CONCEPT');
    conceptEls.forEach(el => {
      const id = el.getAttribute('id');
      if (!id) return;

      const labelEl = el.querySelector(':scope > LABEL');
      const label = labelEl ? labelEl.textContent.trim() : id;

      const slots = this._parseSlots(el);

      concepts.set(id, { id, label, kind: 'R', slots, isaParents: [] });
    });
  }

  _parseSlots(conceptEl) {
    const slots = [];
    const slotsEl = conceptEl.querySelector(':scope > SLOTS');
    if (!slotsEl) return slots;

    const slotEls = slotsEl.querySelectorAll(':scope > SLOT');
    slotEls.forEach(slotEl => {
      const role = slotEl.getAttribute('role') || '';
      const classConstraint = slotEl.getAttribute('class_constraint') || '';
      const num = slotEl.getAttribute('num') || '';
      const type = slotEl.getAttribute('type') || '';
      const label = slotEl.getAttribute('label') || '';

      slots.push({ name: role || label, type: classConstraint, cardinality: num, kind: type });
    });

    return slots;
  }
}
