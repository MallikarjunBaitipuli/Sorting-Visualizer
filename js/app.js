document.addEventListener("DOMContentLoaded", () => {
  // Application State
  const state = {
    currentAlgorithm: "bubble",
    rawArray: [45, 12, 85, 32, 89, 39, 69, 44, 1],
    frames: [],
    currentFrameIndex: 0,
    isPlaying: false,
    timerId: null,
    speedMs: 500, // delay between frames
    startTime: null,
    elapsedMs: 0
  };

  // Instantiate Visualizer
  const visualizer = new Visualizer("main-array-container", "aux-array-container", "aux-array-section");

  // DOM Element References
  const algorithmSelect = document.getElementById("algorithm-select");
  const customArrayInput = document.getElementById("custom-array-input");
  const loadArrayBtn = document.getElementById("load-array-btn");
  const inputErrorMsg = document.getElementById("input-error-msg");

  // Preset Buttons
  const presetRandomBtn = document.getElementById("preset-random");
  const presetSortedBtn = document.getElementById("preset-sorted");
  const presetReverseBtn = document.getElementById("preset-reverse");
  const presetNearlyBtn = document.getElementById("preset-nearly");
  const presetDuplicatesBtn = document.getElementById("preset-duplicates");

  // Playback Buttons & Controls
  const playPauseBtn = document.getElementById("play-pause-btn");
  const playPauseIcon = document.getElementById("play-pause-icon");
  const playPauseText = document.getElementById("play-pause-text");
  const stepBackBtn = document.getElementById("step-back-btn");
  const stepForwardBtn = document.getElementById("step-forward-btn");
  const resetBtn = document.getElementById("reset-btn");
  const timelineSlider = document.getElementById("timeline-slider");
  const stepCounterText = document.getElementById("step-counter-text");
  const speedSlider = document.getElementById("speed-slider");
  const speedLabel = document.getElementById("speed-label");
  const soundToggle = document.getElementById("sound-toggle");

  // Status & Metrics DOM
  const stepExplanationText = document.getElementById("step-explanation-text");
  const metricComparisons = document.getElementById("metric-comparisons");
  const metricSwaps = document.getElementById("metric-swaps");
  const metricAccesses = document.getElementById("metric-accesses");
  const metricTime = document.getElementById("metric-time");

  // Complexity & Theory DOM
  const algoNameTitle = document.getElementById("algo-name-title");
  const algoCategoryBadge = document.getElementById("algo-category-badge");
  const algoDescription = document.getElementById("algo-description");
  const timeBestVal = document.getElementById("time-best-val");
  const timeAvgVal = document.getElementById("time-avg-val");
  const timeWorstVal = document.getElementById("time-worst-val");
  const spaceWorstVal = document.getElementById("space-worst-val");
  const inPlaceVal = document.getElementById("inplace-val");
  const stableVal = document.getElementById("stable-val");
  const recurrenceVal = document.getElementById("recurrence-val");
  const pseudocodeContainer = document.getElementById("pseudocode-lines-container");

  // Real-Life Applications & Drawbacks DOM
  const realLifeTitle = document.getElementById("real-life-analogy-title");
  const realLifeStory = document.getElementById("real-life-story");
  const practicalUsesList = document.getElementById("practical-uses-list");
  const advantagesList = document.getElementById("advantages-list");
  const drawbacksList = document.getElementById("drawbacks-list");

  // --- 1. Array Parsing and Validation ---
  function parseCustomArray(inputStr) {
    if (!inputStr || typeof inputStr !== "string") {
      throw new Error("Input cannot be empty. Please enter comma or space separated numbers.");
    }

    const cleaned = inputStr.replace(/[\[\]]/g, "").trim();
    if (!cleaned) {
      throw new Error("Array contains no numbers. Enter values like: 64, 34, 25, 12, 22, 11, 90");
    }

    const tokens = cleaned.split(/[\s,]+/);
    const parsed = [];

    for (const token of tokens) {
      if (!token) continue;
      const num = Number(token);
      if (isNaN(num)) {
        throw new Error(`Invalid token "${token}". Please enter valid integers only.`);
      }
      if (!Number.isInteger(num)) {
        throw new Error(`Float value "${token}" detected. Please use integers for sorting visualization.`);
      }
      if (num < -999 || num > 9999) {
        throw new Error(`Number ${num} is out of visual range (-999 to 9999) for readable card rendering.`);
      }
      parsed.push(num);
    }

    if (parsed.length < 2) {
      throw new Error("Array must have at least 2 numbers to visualize sorting.");
    }
    if (parsed.length > 30) {
      throw new Error(`Array length is ${parsed.length}. Recommended max size for clear card readability is 30 elements.`);
    }

    return parsed;
  }

  function handleCustomArrayLoad() {
    inputErrorMsg.innerText = "";
    inputErrorMsg.style.display = "none";

    try {
      const parsed = parseCustomArray(customArrayInput.value);
      state.rawArray = parsed;
      customArrayInput.value = parsed.join(", ");
      resetSimulation();
      showNotification("Custom array loaded successfully!", "success");
    } catch (err) {
      inputErrorMsg.innerText = err.message;
      inputErrorMsg.style.display = "block";
      showNotification(err.message, "error");
    }
  }

  function showNotification(msg, type = "info") {
    const toast = document.getElementById("toast-banner");
    if (toast) {
      toast.innerText = msg;
      toast.className = `toast-banner show toast-${type}`;
      setTimeout(() => {
        toast.className = "toast-banner";
      }, 3000);
    }
  }

  // --- 2. Frame Generation ---
  function generateFrames() {
    const arr = [...state.rawArray];
    const algo = state.currentAlgorithm;

    switch (algo) {
      case "bubble":
        state.frames = generateBubbleSortFrames(arr);
        break;
      case "selection":
        state.frames = generateSelectionSortFrames(arr);
        break;
      case "insertion":
        state.frames = generateInsertionSortFrames(arr);
        break;
      case "merge":
        state.frames = generateMergeSortFrames(arr);
        break;
      case "quick":
        state.frames = generateQuickSortFrames(arr);
        break;
      case "heap":
        state.frames = generateHeapSortFrames(arr);
        break;
      default:
        state.frames = generateBubbleSortFrames(arr);
    }

    timelineSlider.max = Math.max(0, state.frames.length - 1);
    timelineSlider.value = 0;
  }

  // --- 3. UI Synchronization ---
  function updateUIForCurrentFrame() {
    if (!state.frames || state.frames.length === 0) return;

    const frame = state.frames[state.currentFrameIndex];
    if (!frame) return;

    // Render cards
    visualizer.render(frame);

    // Update Slider & Counters
    timelineSlider.value = state.currentFrameIndex;
    stepCounterText.innerText = `Step ${state.currentFrameIndex + 1} of ${state.frames.length}`;

    // Update Metrics
    metricComparisons.innerText = frame.comparisons;
    metricSwaps.innerText = frame.swaps;
    metricAccesses.innerText = frame.accesses;

    // Update Step Explanation
    stepExplanationText.innerText = frame.explanation || "Algorithm in progress...";

    // Highlight active line in pseudocode
    const lines = pseudocodeContainer.querySelectorAll(".pseudo-line");
    lines.forEach(lineEl => {
      const lineNum = Number(lineEl.dataset.line);
      if (lineNum === frame.pseudocodeLine) {
        lineEl.classList.add("active-line");
      } else {
        lineEl.classList.remove("active-line");
      }
    });

    // Check if finished
    if (state.currentFrameIndex >= state.frames.length - 1) {
      pauseSimulation();
    }
  }

  function renderPseudocodeAndTheory() {
    const algoKey = state.currentAlgorithm;
    const theory = COMPLEXITY_DATA[algoKey];
    const pseudocode = PSEUDOCODE_DATA[algoKey];

    if (!theory || !pseudocode) return;

    // Update Theory Card
    algoNameTitle.innerText = theory.name;
    algoCategoryBadge.innerText = theory.category;
    algoDescription.innerText = theory.description;
    timeBestVal.innerText = theory.timeBest;
    timeAvgVal.innerText = theory.timeAvg;
    timeWorstVal.innerText = theory.timeWorst;
    spaceWorstVal.innerText = theory.spaceWorst;
    inPlaceVal.innerText = theory.inPlace;
    stableVal.innerText = theory.stable;
    recurrenceVal.innerText = theory.recurrence;

    // Update Real-Life Example & Analogy Card
    if (realLifeTitle && theory.realLifeExample) {
      realLifeTitle.innerText = theory.realLifeExample.analogy;
      realLifeStory.innerText = theory.realLifeExample.story;
    }

    // Update Practical Uses
    if (practicalUsesList && theory.practicalUses) {
      practicalUsesList.innerHTML = "";
      theory.practicalUses.forEach(use => {
        const li = document.createElement("li");
        li.innerText = use;
        practicalUsesList.appendChild(li);
      });
    }

    // Update Advantages
    if (advantagesList && theory.advantages) {
      advantagesList.innerHTML = "";
      theory.advantages.forEach(adv => {
        const li = document.createElement("li");
        li.innerHTML = `<span class="icon-check">✓</span> <span>${adv}</span>`;
        advantagesList.appendChild(li);
      });
    }

    // Update Drawbacks
    if (drawbacksList && theory.drawbacks) {
      drawbacksList.innerHTML = "";
      theory.drawbacks.forEach(draw => {
        const li = document.createElement("li");
        li.innerHTML = `<span class="icon-cross">✗</span> <span>${draw}</span>`;
        drawbacksList.appendChild(li);
      });
    }

    // Render Pseudocode lines
    pseudocodeContainer.innerHTML = "";
    pseudocode.forEach(item => {
      const lineDiv = document.createElement("div");
      lineDiv.className = "pseudo-line";
      lineDiv.dataset.line = item.line;

      const numSpan = document.createElement("span");
      numSpan.className = "pseudo-num";
      numSpan.innerText = item.line;

      const codeSpan = document.createElement("span");
      codeSpan.className = "pseudo-code";
      codeSpan.innerText = item.text;

      lineDiv.appendChild(numSpan);
      lineDiv.appendChild(codeSpan);
      pseudocodeContainer.appendChild(lineDiv);
    });
  }

  // --- 4. Playback Controller ---
  function playSimulation() {
    if (state.isPlaying) return;

    if (state.currentFrameIndex >= state.frames.length - 1) {
      state.currentFrameIndex = 0;
    }

    state.isPlaying = true;
    playPauseIcon.className = "icon-pause";
    playPauseText.innerText = "Pause";
    playPauseBtn.classList.add("btn-playing");

    if (!state.startTime) {
      state.startTime = performance.now() - state.elapsedMs;
    }

    tickLoop();
  }

  function pauseSimulation() {
    state.isPlaying = false;
    if (state.timerId) {
      clearTimeout(state.timerId);
      state.timerId = null;
    }
    playPauseIcon.className = "icon-play";
    playPauseText.innerText = "Play";
    playPauseBtn.classList.remove("btn-playing");
  }

  function tickLoop() {
    if (!state.isPlaying) return;

    if (state.currentFrameIndex < state.frames.length - 1) {
      state.currentFrameIndex++;
      updateUIForCurrentFrame();

      state.timerId = setTimeout(() => {
        tickLoop();
      }, state.speedMs);
    } else {
      pauseSimulation();
    }
  }

  function resetSimulation() {
    pauseSimulation();
    generateFrames();
    state.currentFrameIndex = 0;
    state.elapsedMs = 0;
    state.startTime = null;
    metricTime.innerText = "0 ms";
    updateUIForCurrentFrame();
  }

  function stepForward() {
    pauseSimulation();
    if (state.currentFrameIndex < state.frames.length - 1) {
      state.currentFrameIndex++;
      updateUIForCurrentFrame();
    }
  }

  function stepBackward() {
    pauseSimulation();
    if (state.currentFrameIndex > 0) {
      state.currentFrameIndex--;
      updateUIForCurrentFrame();
    }
  }

  // --- 5. Presets Generation ---
  function generateRandomArray(size = 9) {
    const arr = [];
    for (let i = 0; i < size; i++) {
      arr.push(Math.floor(Math.random() * 95) + 5);
    }
    return arr;
  }

  function generateSortedArray(size = 9) {
    const arr = generateRandomArray(size);
    arr.sort((a, b) => a - b);
    return arr;
  }

  function generateReverseArray(size = 9) {
    const arr = generateRandomArray(size);
    arr.sort((a, b) => b - a);
    return arr;
  }

  function generateNearlySortedArray(size = 9) {
    const arr = generateSortedArray(size);
    if (arr.length > 3) {
      const idx1 = Math.floor(size / 3);
      const idx2 = idx1 + 1;
      const tmp = arr[idx1];
      arr[idx1] = arr[idx2];
      arr[idx2] = tmp;
    }
    return arr;
  }

  function generateDuplicatesArray(size = 9) {
    const pool = [15, 30, 45, 60, 30, 45, 15, 60, 30];
    return pool.slice(0, size);
  }

  function loadPreset(generatorFn, name) {
    const size = state.rawArray.length || 9;
    const newArr = generatorFn(size);
    state.rawArray = newArr;
    customArrayInput.value = newArr.join(", ");
    inputErrorMsg.style.display = "none";
    resetSimulation();
    showNotification(`Loaded ${name} preset array!`, "info");
  }

  // --- 6. Event Listeners ---
  algorithmSelect.addEventListener("change", (e) => {
    state.currentAlgorithm = e.target.value;
    renderPseudocodeAndTheory();
    resetSimulation();
    if (window.chatbot) window.chatbot.updateDynamicSuggestions();
  });

  loadArrayBtn.addEventListener("click", handleCustomArrayLoad);

  customArrayInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      handleCustomArrayLoad();
    }
  });

  // Preset Buttons
  presetRandomBtn.addEventListener("click", () => loadPreset(generateRandomArray, "Random"));
  presetSortedBtn.addEventListener("click", () => loadPreset(generateSortedArray, "Sorted"));
  presetReverseBtn.addEventListener("click", () => loadPreset(generateReverseArray, "Reverse Sorted"));
  presetNearlyBtn.addEventListener("click", () => loadPreset(generateNearlySortedArray, "Nearly Sorted"));
  presetDuplicatesBtn.addEventListener("click", () => loadPreset(generateDuplicatesArray, "Duplicates"));

  // Playback Controls
  playPauseBtn.addEventListener("click", () => {
    visualizer.initAudio();
    if (state.isPlaying) {
      pauseSimulation();
    } else {
      playSimulation();
    }
  });

  stepBackBtn.addEventListener("click", stepBackward);
  stepForwardBtn.addEventListener("click", stepForward);
  resetBtn.addEventListener("click", resetSimulation);

  timelineSlider.addEventListener("input", (e) => {
    pauseSimulation();
    state.currentFrameIndex = Number(e.target.value);
    updateUIForCurrentFrame();
  });

  speedSlider.addEventListener("input", (e) => {
    const val = Number(e.target.value);
    const delayMap = {
      1: { ms: 1200, label: "0.25x (Very Slow)" },
      2: { ms: 750, label: "0.5x (Slow)" },
      3: { ms: 400, label: "1.0x (Normal)" },
      4: { ms: 180, label: "2.0x (Fast)" },
      5: { ms: 60, label: "5.0x (Turbo)" }
    };
    const speedConfig = delayMap[val] || delayMap[3];
    state.speedMs = speedConfig.ms;
    speedLabel.innerText = speedConfig.label;
  });

  soundToggle.addEventListener("change", (e) => {
    visualizer.audioEnabled = e.target.checked;
    if (e.target.checked) {
      visualizer.initAudio();
      visualizer.playTone(50, 0, 100);
    }
  });

  // --- 7. Initial Initialization ---
  customArrayInput.value = state.rawArray.join(", ");
  renderPseudocodeAndTheory();
  resetSimulation();

  // Initialize Algorithm Chatbot
  window.chatbot = new AlgorithmChatbot(state);
});
