class AlgorithmChatbot {
  constructor(appState) {
    this.appState = appState;
    this.isOpen = false;
    
    // DOM Elements
    this.launcherBtn = document.getElementById("chatbot-launcher-btn");
    this.chatWindow = document.getElementById("chatbot-window");
    this.closeBtn = document.getElementById("chatbot-close-btn");
    this.messagesContainer = document.getElementById("chatbot-messages");
    this.inputField = document.getElementById("chatbot-input");
    this.sendBtn = document.getElementById("chatbot-send-btn");
    this.suggestionsContainer = document.getElementById("chatbot-suggestions");
    this.unreadBadge = document.getElementById("chatbot-unread-badge");

    this.initEventListeners();
    this.renderInitialGreeting();
  }

  initEventListeners() {
    if (!this.launcherBtn || !this.chatWindow) return;

    this.launcherBtn.addEventListener("click", () => this.toggleChat());
    if (this.closeBtn) {
      this.closeBtn.addEventListener("click", () => this.toggleChat(false));
    }
    
    if (this.sendBtn) {
      this.sendBtn.addEventListener("click", () => this.handleUserSend());
    }

    if (this.inputField) {
      this.inputField.addEventListener("keydown", (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
          e.preventDefault();
          this.handleUserSend();
        }
      });
    }

    // Delegate suggestion chip clicks
    if (this.suggestionsContainer) {
      this.suggestionsContainer.addEventListener("click", (e) => {
        const chip = e.target.closest(".suggestion-chip");
        if (chip) {
          const query = chip.dataset.query || chip.innerText;
          this.addUserMessage(query);
          this.processQuery(query);
        }
      });
    }
  }

  toggleChat(forceState = null) {
    this.isOpen = forceState !== null ? forceState : !this.isOpen;
    if (this.isOpen) {
      this.chatWindow.classList.add("open");
      this.launcherBtn.classList.add("active");
      if (this.unreadBadge) this.unreadBadge.style.display = "none";
      if (this.inputField) this.inputField.focus();
      this.updateDynamicSuggestions();
      this.scrollToBottom();
    } else {
      this.chatWindow.classList.remove("open");
      this.launcherBtn.classList.remove("active");
    }
  }

  renderInitialGreeting() {
    const greeting = "👋 Hello! I'm your **Algorithm Assistant**. If you have any doubt about the current algorithm, time complexity, why cards are swapping, or what the colors mean, just ask me below!";
    this.addBotMessage(greeting);
    this.updateDynamicSuggestions();
  }

  updateDynamicSuggestions() {
    if (!this.suggestionsContainer) return;
    const algo = this.appState.currentAlgorithm || "bubble";
    const algoName = (typeof COMPLEXITY_DATA !== "undefined" && COMPLEXITY_DATA[algo]?.name) || "Sorting";

    const commonSuggestions = [
      { text: `💡 Explain current step`, query: "Explain what is happening in the current step" },
      { text: `⚡ Why is ${algoName} used?`, query: `Tell me about ${algoName}` },
      { text: `⏱ Time Complexity of ${algoName}`, query: `What is the time complexity of ${algoName}?` },
      { text: `🎨 What do the colors mean?`, query: "What do the colors mean?" },
      { text: `🔄 Merge vs Quick Sort`, query: "What is the difference between Merge Sort and Quick Sort?" }
    ];

    this.suggestionsContainer.innerHTML = "";
    commonSuggestions.forEach(item => {
      const chip = document.createElement("button");
      chip.className = "suggestion-chip";
      chip.innerText = item.text;
      chip.dataset.query = item.query;
      this.suggestionsContainer.appendChild(chip);
    });
  }

  handleUserSend() {
    const text = this.inputField.value.trim();
    if (!text) return;

    this.addUserMessage(text);
    this.inputField.value = "";
    this.processQuery(text);
  }

  addUserMessage(text) {
    const msgDiv = document.createElement("div");
    msgDiv.className = "chat-msg msg-user";
    msgDiv.innerText = text;
    this.messagesContainer.appendChild(msgDiv);
    this.scrollToBottom();
  }

  addBotMessage(markdownText) {
    const msgDiv = document.createElement("div");
    msgDiv.className = "chat-msg msg-bot";
    msgDiv.innerHTML = this.formatMarkdown(markdownText);
    this.messagesContainer.appendChild(msgDiv);
    this.scrollToBottom();
  }

  showTypingIndicator() {
    const typing = document.createElement("div");
    typing.className = "chat-msg msg-bot typing-indicator-msg";
    typing.id = "bot-typing-indicator";
    typing.innerHTML = `<span class="dot"></span><span class="dot"></span><span class="dot"></span>`;
    this.messagesContainer.appendChild(typing);
    this.scrollToBottom();
  }

  hideTypingIndicator() {
    const el = document.getElementById("bot-typing-indicator");
    if (el) el.remove();
  }

  scrollToBottom() {
    this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
  }

  formatMarkdown(text) {
    return text
      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
      .replace(/\*(.*?)\*/g, "<em>$1</em>")
      .replace(/`([^`]+)`/g, "<code>$1</code>")
      .replace(/\n\n/g, "<br><br>")
      .replace(/\n- (.*?)/g, "<br>• $1")
      .replace(/\n• (.*?)/g, "<br>• $1")
      .replace(/\n/g, "<br>");
  }

  processQuery(rawQuery) {
    this.showTypingIndicator();
    const q = rawQuery.toLowerCase().trim();

    setTimeout(() => {
      this.hideTypingIndicator();
      const response = this.generateAnswer(q);
      this.addBotMessage(response);
      this.updateDynamicSuggestions();
    }, 350);
  }

  generateAnswer(q) {
    const currentAlgo = this.appState.currentAlgorithm || "bubble";
    const currentFrame = this.appState.frames ? this.appState.frames[this.appState.currentFrameIndex] : null;
    const theory = (typeof COMPLEXITY_DATA !== "undefined" && COMPLEXITY_DATA[currentAlgo]) ? COMPLEXITY_DATA[currentAlgo] : { name: "Algorithm" };

    // 1. Current Step Inquiries
    if (q.includes("current step") || q.includes("happening right now") || q.includes("what is happening") || q.includes("explain step") || q.includes("explain this step") || q.includes("why swap") || q.includes("why comparing")) {
      if (!currentFrame) {
        return "The algorithm has not started yet. Click **Play** or **Step Next** to begin!";
      }
      return `**Current Step Analysis (${theory.name}):**\n` +
             `• **Action:** ${currentFrame.explanation}\n` +
             `• **Live Counters:** Comparisons = \`${currentFrame.comparisons}\`, Swaps/Writes = \`${currentFrame.swaps}\`, Array Accesses = \`${currentFrame.accesses}\`\n` +
             `• **Active Pseudocode Line:** Line ${currentFrame.pseudocodeLine}`;
    }

    // 2. Color Explanations
    if (q.includes("color") || q.includes("colour") || q.includes("yellow") || q.includes("amber") || q.includes("green") || q.includes("red") || q.includes("purple") || q.includes("blue")) {
      return "**Color Legend & Meanings:**\n" +
             "• 🔵 **Slate Blue (Default):** Unsorted elements.\n" +
             "• 🟡 **Amber / Yellow (Comparing):** Two elements currently being compared.\n" +
             "• 🔴 **Rose / Red (Swapping/Writing):** Elements actively being swapped or shifted.\n" +
             "• 🟣 **Purple / Cyan (Pivot / Key):** The active partition pivot (Quick Sort) or insertion key.\n" +
             "• 🟢 **Emerald Green (Sorted):** Elements locked in their permanent sorted positions.";
    }

    // 3. Custom Input Array Help
    if (q.includes("custom array") || q.includes("how to input") || q.includes("give input") || q.includes("enter array") || q.includes("array input")) {
      return "**How to Enter Custom Array:**\n" +
             "1. Type your numbers into the **Custom Array Input** box at the top.\n" +
             "2. Separate numbers with commas or spaces (e.g. `64, 34, 25, 12, 22, 11, 90`).\n" +
             "3. Click **Apply Array** or press **Enter**.\n" +
             "4. You can also click the quick preset buttons like **Random**, **Sorted**, or **Reverse Sorted**!";
    }

    // 4. Time Complexity of Current or Specific Algorithm
    if (q.includes("complexity") || q.includes("time") || q.includes("big o") || q.includes("space")) {
      let targetAlgo = currentAlgo;
      if (q.includes("bubble")) targetAlgo = "bubble";
      else if (q.includes("selection")) targetAlgo = "selection";
      else if (q.includes("insertion")) targetAlgo = "insertion";
      else if (q.includes("merge")) targetAlgo = "merge";
      else if (q.includes("quick")) targetAlgo = "quick";
      else if (q.includes("heap")) targetAlgo = "heap";

      if (typeof COMPLEXITY_DATA !== "undefined" && COMPLEXITY_DATA[targetAlgo]) {
        const t = COMPLEXITY_DATA[targetAlgo];
        return `**${t.name} Complexity Analysis:**\n` +
               `• **Best Case Time:** \`${t.timeBest}\`\n` +
               `• **Average Case Time:** \`${t.timeAvg}\`\n` +
               `• **Worst Case Time:** \`${t.timeWorst}\`\n` +
               `• **Auxiliary Space:** \`${t.spaceWorst}\`\n` +
               `• **In-Place:** \`${t.inPlace}\` | **Stable:** \`${t.stable}\`\n` +
               `• **Recurrence Formula:** \`${t.recurrence}\``;
      }
    }

    // 5. Algorithm Explanations (What is X sort?)
    if (q.includes("bubble sort") || q.includes("what is bubble") || (q.includes("bubble") && q.includes("work"))) {
      return "**Bubble Sort:** Repeatedly compares adjacent elements and swaps them if they are in the wrong order. With the early-exit optimization flag, it achieves $\\mathcal{O}(n)$ best-case time when the array is already sorted.";
    }
    if (q.includes("selection sort") || q.includes("what is selection") || (q.includes("selection") && q.includes("work"))) {
      return "**Selection Sort:** Divides the array into sorted and unsorted parts. It repeatedly scans the unsorted part for the minimum element and swaps it into place. It always performs $\\mathcal{O}(n^2)$ comparisons but at most $n-1$ swaps.";
    }
    if (q.includes("insertion sort") || q.includes("what is insertion") || (q.includes("insertion") && q.includes("work"))) {
      return "**Insertion Sort:** Builds the sorted array incrementally by taking the next element (`key`) and shifting larger elements in the sorted prefix to the right. Very fast for nearly sorted arrays ($\\mathcal{O}(n)$ best case).";
    }
    if (q.includes("merge sort") || q.includes("what is merge") || (q.includes("merge") && q.includes("work"))) {
      return "**Merge Sort:** A Divide & Conquer algorithm that splits the array into two halves, recursively sorts them, and merges them using an auxiliary buffer. Guarantees $\\mathcal{O}(n \\log n)$ time in all cases with $\\mathcal{O}(n)$ extra space.";
    }
    if (q.includes("quick sort") || q.includes("what is quick") || (q.includes("quick") && q.includes("work"))) {
      return "**Quick Sort:** A Divide & Conquer algorithm that selects a `pivot`, partitions elements into those $\\le pivot$ and those $> pivot$, then recursively sorts the partitions. Average time is $\\mathcal{O}(n \\log n)$, but degrades to $\\mathcal{O}(n^2)$ if partitions are unbalanced.";
    }
    if (q.includes("heap sort") || q.includes("what is heap") || (q.includes("heap") && q.includes("work"))) {
      return "**Heap Sort:** Builds a Max-Heap in $\\mathcal{O}(n)$ time, then repeatedly extracts the root (maximum element) to the end of the array and restores the heap property in $\\mathcal{O}(\\log n)$ per element. Runs in $\\mathcal{O}(n \\log n)$ in-place.";
    }

    // 6. Comparative Questions
    if ((q.includes("merge") && q.includes("quick")) || q.includes("merge vs quick")) {
      return "**Merge Sort vs Quick Sort:**\n" +
             "• **Merge Sort:** Guaranteed $\\mathcal{O}(n \\log n)$ in all cases, Stable, but requires $\\mathcal{O}(n)$ extra memory.\n" +
             "• **Quick Sort:** In-place $\\mathcal{O}(1)$ extra memory, faster in practice due to cache locality, but $\\mathcal{O}(n^2)$ worst case on sorted arrays with naive pivot.";
    }
    if ((q.includes("quick") && q.includes("heap")) || q.includes("heap vs quick")) {
      return "**Quick Sort vs Heap Sort:**\n" +
             "• Both have $\\mathcal{O}(n \\log n)$ average time and are in-place.\n" +
             "• **Heap Sort** guarantees $\\mathcal{O}(n \\log n)$ worst-case, whereas Quick Sort can degrade to $\\mathcal{O}(n^2)$.\n" +
             "• However, **Quick Sort** is faster in practice because Heap Sort makes non-contiguous memory jumps ($2i+1, 2i+2$) causing CPU cache misses.";
    }

    // 7. Master Theorem & Proofs
    if (q.includes("master theorem") || q.includes("recurrence") || q.includes("proof")) {
      return "**Master Theorem for Merge Sort:**\n" +
             "• Recurrence: `T(n) = 2T(n/2) + O(n)`\n" +
             "• Here `a = 2`, `b = 2`, `f(n) = O(n)`\n" +
             "• `log_b(a) = log_2(2) = 1` ==> `n^1 = n`\n" +
             "• Since `f(n) = Theta(n^1)`, **Case 2 applies**:\n" +
             "• `T(n) = Theta(n log n)`";
    }

    // 8. In-Place & Stability
    if (q.includes("stable") || q.includes("stability")) {
      return "**What is Stability?**\n" +
             "A sorting algorithm is **Stable** if equal elements retain their original relative order after sorting.\n" +
             "• **Stable:** Bubble Sort, Insertion Sort, Merge Sort.\n" +
             "• **Unstable:** Quick Sort, Heap Sort, Selection Sort.";
    }
    if (q.includes("in-place") || q.includes("inplace")) {
      return "**What is In-Place?**\n" +
             "An algorithm is **In-Place** if it requires $\\mathcal{O}(1)$ (or $\\mathcal{O}(\\log n)$ stack space) extra auxiliary memory.\n" +
             "• **In-Place:** Bubble, Selection, Insertion, Quick, Heap sorts.\n" +
             "• **Not In-Place:** Merge Sort (requires $\\mathcal{O}(n)$ auxiliary buffer).";
    }

    // 9. Inversions
    if (q.includes("inversion")) {
      return "**What is an Inversion?**\n" +
             "An inversion is a pair `(i, j)` where `i < j` but `arr[i] > arr[j]`.\n" +
             "• An already sorted array has **0 inversions**.\n" +
             "• A reverse-sorted array has maximum inversions: `n(n-1)/2`.\n" +
             "• **Insertion Sort** swaps directly resolve inversions, running in `O(n + I)` time!";
    }

    // 10. Default Fallback
    return `I can help you with doubts about **${theory.name}** or any sorting concept! Try asking:\n` +
           `• *"Explain what is happening in the current step"*\n` +
           `• *"Why is ${theory.name} ${theory.timeWorst || "O(n²)"} in worst case?"*\n` +
           `• *"What do the colors mean?"*\n` +
           `• *"What is the difference between Merge and Quick sort?"*\n` +
           `• *"How does the timeline scrubber work?"*`;
  }
}

/**
 * Main Application Controller for Interactive Sorting Visualizer
 * Handles real-time playback, custom array parsing, pseudocode line-tracking,
 * and Real-Life Examples & Drawbacks rendering.
 */
