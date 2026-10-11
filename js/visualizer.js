class Visualizer {
  constructor(mainContainerId, auxContainerId, auxSectionId) {
    this.mainContainer = document.getElementById(mainContainerId);
    this.auxContainer = document.getElementById(auxContainerId);
    this.auxSection = document.getElementById(auxSectionId);
    this.audioCtx = null;
    this.audioEnabled = false;
  }

  initAudio() {
    if (!this.audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        this.audioCtx = new AudioContext();
      }
    }
    if (this.audioCtx && this.audioCtx.state === "suspended") {
      this.audioCtx.resume();
    }
  }

  playTone(val, minVal = 0, maxVal = 100) {
    if (!this.audioEnabled) return;
    try {
      this.initAudio();
      if (!this.audioCtx) return;

      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();
      
      const normalized = Math.max(0, Math.min(1, (val - minVal) / (maxVal - minVal || 1)));
      const freq = 220 + normalized * 660; // 220Hz (A3) to 880Hz (A5)
      
      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, this.audioCtx.currentTime);
      
      gain.gain.setValueAtTime(0.04, this.audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.audioCtx.currentTime + 0.12);
      
      osc.connect(gain);
      gain.connect(this.audioCtx.destination);
      
      osc.start();
      osc.stop(this.audioCtx.currentTime + 0.12);
    } catch (e) {
      // Ignore audio errors silently
    }
  }

  render(frame) {
    if (!frame) return;

    const {
      array,
      auxArray,
      highlights = {},
      pointers = [],
      auxPointers = [],
      sortedIndices = [],
      activeRange = null
    } = frame;

    const minVal = Math.min(...array, 0);
    const maxVal = Math.max(...array, 100);

    // 1. Render Main Array
    this.mainContainer.innerHTML = "";
    
    // Group pointers by index
    const pointerMap = {};
    pointers.forEach(p => {
      if (!pointerMap[p.index]) pointerMap[p.index] = [];
      pointerMap[p.index].push(p);
    });

    array.forEach((val, idx) => {
      const card = document.createElement("div");
      card.className = "num-card";

      // Determine state class
      let stateClass = "state-default";
      if (sortedIndices.includes(idx)) {
        stateClass = "state-sorted";
      } else if (highlights[idx]) {
        stateClass = `state-${highlights[idx]}`;
      } else if (activeRange && (idx < activeRange[0] || idx > activeRange[1])) {
        stateClass = "state-dimmed";
      }

      card.classList.add(stateClass);

      // Pointers container (top badge)
      const pointersDiv = document.createElement("div");
      pointersDiv.className = "pointer-badges-container";
      
      if (pointerMap[idx]) {
        pointerMap[idx].forEach(ptr => {
          const badge = document.createElement("span");
          badge.className = `pointer-badge badge-${ptr.color || "blue"}`;
          badge.innerText = ptr.label;
          pointersDiv.appendChild(badge);
        });
      }
      card.appendChild(pointersDiv);

      // Value Tile
      const valDiv = document.createElement("div");
      valDiv.className = "card-value";
      valDiv.innerText = val;
      card.appendChild(valDiv);

      // Index Label (bottom)
      const idxDiv = document.createElement("div");
      idxDiv.className = "card-index";
      idxDiv.innerText = `[${idx}]`;
      card.appendChild(idxDiv);

      // Sound trigger on comparison/swap
      if (highlights[idx] === "comparing" || highlights[idx] === "swapping") {
        this.playTone(val, minVal, maxVal);
      }

      this.mainContainer.appendChild(card);
    });

    // 2. Render Auxiliary Array (for Merge Sort / Radix Sort)
    if (auxArray && auxArray.length > 0) {
      this.auxSection.style.display = "block";
      this.auxContainer.innerHTML = "";

      const auxPointerMap = {};
      auxPointers.forEach(p => {
        if (!auxPointerMap[p.index]) auxPointerMap[p.index] = [];
        auxPointerMap[p.index].push(p);
      });

      auxArray.forEach((val, idx) => {
        const auxCard = document.createElement("div");
        auxCard.className = "num-card aux-card";

        // Aux pointers
        const auxPointersDiv = document.createElement("div");
        auxPointersDiv.className = "pointer-badges-container";
        if (auxPointerMap[idx]) {
          auxPointerMap[idx].forEach(ptr => {
            const badge = document.createElement("span");
            badge.className = `pointer-badge badge-${ptr.color || "amber"}`;
            badge.innerText = ptr.label;
            auxPointersDiv.appendChild(badge);
          });
        }
        auxCard.appendChild(auxPointersDiv);

        // Aux Value
        const valDiv = document.createElement("div");
        valDiv.className = "card-value";
        valDiv.innerText = val;
        auxCard.appendChild(valDiv);

        // Aux Index
        const idxDiv = document.createElement("div");
        idxDiv.className = "card-index";
        idxDiv.innerText = `aux[${idx}]`;
        auxCard.appendChild(idxDiv);

        this.auxContainer.appendChild(auxCard);
      });
    } else {
      this.auxSection.style.display = "none";
      this.auxContainer.innerHTML = "";
    }
  }
}

/**
 * Interactive Algorithm Chatbot & Doubt-Solver
 * Context-aware AI tutor providing instant explanations and algorithm doubt resolution
 */
