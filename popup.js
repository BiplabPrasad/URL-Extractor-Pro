document.addEventListener("DOMContentLoaded", () => {
  // --- Globals ---
  const storageKeys = {
    regex: "htmlExtractorRegexList",
    history: "htmlExtractorHistory",
  };
  let regexList = []; // In-memory list of regex objects { id, name, value }
  let historyList = []; // In-memory list of history objects { id, url, timestamp, regexName? }

  // Default regex patterns to add when no patterns exist
  const defaultRegexPatterns = [
    {
      id: Date.now(),
      name: "All HTTP/HTTPS URLs (demo)",
      value: "https?:\\/\\/[\\w\\.-]+\\.[a-zA-Z]{2,}(\\/[\\w\\.-]*)*",
    },
    {
      id: Date.now() + 1,
      name: "Image URLs (demo)",
      value:
        "https?:\\/\\/[\\w\\.-]+\\.[a-zA-Z]{2,}(\\/[\\w\\.-]*)*\\.(jpg|jpeg|png|gif|webp)",
    },
    {
      id: Date.now() + 2,
      name: "AWS CodeDeploy URLs (demo)",
      value:
        "https:\\/\\/console\\.aws\\.amazon\\.com\\/codedeploy\\/home\\?region=[a-zA-Z0-9-]+#\\/deployments\\/d-[A-Z0-9]+",
    },
  ];

  // --- DOM Elements ---
  const tabButtons = document.querySelectorAll(".tab-button");
  const tabContents = document.querySelectorAll(".tab-content");

  // Extract Tab Elements
  const extractBtn = document.getElementById("extractBtn");
  const extractResultsDiv = document.getElementById("extractResults");
  const extractStatusDiv = document.getElementById("extractStatus");
  const extractLoadingDiv = document.getElementById("extractLoading");

  // Regex Tab Elements
  const regexForm = document.getElementById("regexForm");
  const regexNameInput = document.getElementById("regexName");
  const regexValueInput = document.getElementById("regexValue");
  const regexEditIdInput = document.getElementById("regexEditId");
  const saveRegexBtn = document.getElementById("saveRegexBtn");
  const regexListUl = document.getElementById("regexList");
  const regexStatusDiv = document.getElementById("regexStatus");

  // History Tab Elements
  const historySearchInput = document.getElementById("historySearch");
  const historySortSelect = document.getElementById("historySort");
  const historyListUl = document.getElementById("historyList");
  const historyStatusDiv = document.getElementById("historyStatus");
  const clearHistoryBtn = document.getElementById("clearHistoryBtn"); // New button

  // --- Utility Functions ---
  const showStatus = (element, message, type = "info", duration = 3000) => {
    element.textContent = message;
    element.className = `status ${type}`; // type can be 'info', 'success', 'error'
    if (duration > 0) {
      setTimeout(() => {
        if (element.textContent === message) {
          element.textContent = "";
          element.className = "status";
        }
      }, duration);
    }
  };

  const generateId = () => crypto.randomUUID();

  const formatTimestamp = (timestamp) => {
    if (!timestamp) return "N/A";
    try {
      return new Date(timestamp).toLocaleString();
    } catch (e) {
      return "Invalid Date";
    }
  };

  // --- Tab Switching Logic ---
  tabButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const targetTab = button.dataset.tab;

      // Update button active state
      tabButtons.forEach((btn) => btn.classList.remove("active"));
      button.classList.add("active");

      // Update content active state
      tabContents.forEach((content) => {
        if (content.id === targetTab) {
          content.classList.add("active");
        } else {
          content.classList.remove("active");
        }
      });
      // Refresh lists when switching to their tabs
      if (targetTab === "regexTab") renderRegexList();
      if (targetTab === "historyTab") renderHistory();
    });
  });

  // --- Storage Functions ---
  const loadData = async (key) => {
    try {
      const result = await chrome.storage.local.get(key);
      return result[key] || [];
    } catch (error) {
      console.error(`Error loading ${key}:`, error);
      showStatus(
        document.querySelector(".tab-content.active .status"),
        `Error loading data: ${error.message}`,
        "error"
      );
      return [];
    }
  };

  // Function to load regex patterns from storage with default fallback
  const loadRegexPatterns = async () => {
    try {
      const result = await chrome.storage.local.get(storageKeys.regex);
      if (
        result[storageKeys.regex] &&
        Array.isArray(result[storageKeys.regex]) &&
        result[storageKeys.regex].length > 0
      ) {
        regexList = result[storageKeys.regex];
      } else {
        // Initialize with default patterns if no patterns exist
        regexList = defaultRegexPatterns;
        // Save default patterns to storage
        await chrome.storage.local.set({ [storageKeys.regex]: regexList });
        console.log("Default regex patterns initialized");
      }
      renderRegexList();
      return regexList;
    } catch (error) {
      console.error(`Error loading regex patterns:`, error);
      showStatus(
        document.querySelector(".tab-content.active .status"),
        `Error loading regex patterns: ${error.message}`,
        "error"
      );
      return [];
    }
  };

  const saveData = async (key, data) => {
    try {
      await chrome.storage.local.set({ [key]: data });
    } catch (error) {
      console.error(`Error saving ${key}:`, error);
      showStatus(
        document.querySelector(".tab-content.active .status"),
        `Error saving data: ${error.message}`,
        "error"
      );
    }
  };

  // --- Regex Management ---
  const renderRegexList = () => {
    regexListUl.innerHTML = ""; // Clear list
    if (regexList.length === 0) {
      regexListUl.innerHTML = "<li>No regex patterns saved yet.</li>";
      return;
    }
    regexList.forEach((regex) => {
      const li = document.createElement("li");
      li.innerHTML = `
              <div class="item-content">
                  <span class="item-name">${escapeHtml(regex.name)}</span>
                  <span class="item-value">${escapeHtml(regex.value)}</span>
              </div>
              <div class="item-actions">
                  <button class="edit-btn" data-id="${regex.id}">Edit</button>
                  <button class="delete-btn" data-id="${
                    regex.id
                  }">Delete</button>
              </div>
          `;
      // Add event listeners for edit/delete
      li.querySelector(".edit-btn").addEventListener("click", () =>
        startEditRegex(regex.id)
      );
      li.querySelector(".delete-btn").addEventListener("click", () =>
        deleteRegex(regex.id)
      );
      regexListUl.appendChild(li);
    });
  };

  const saveRegex = (event) => {
    event.preventDefault();
    const name = regexNameInput.value.trim();
    const value = regexValueInput.value.trim();
    const editId = regexEditIdInput.value;

    if (!name || !value) {
      showStatus(
        regexStatusDiv,
        "Name and Regex Value cannot be empty.",
        "error"
      );
      return;
    }

    // Basic check for common regex mistakes (like //) - not foolproof
    if (value.startsWith("/") || value.endsWith("/")) {
      showStatus(
        regexStatusDiv,
        "Do not include leading/trailing slashes in the regex value.",
        "error"
      );
      return;
    }
    // Try compiling the regex to catch syntax errors early
    try {
      new RegExp(value);
    } catch (e) {
      showStatus(regexStatusDiv, `Invalid Regex: ${e.message}`, "error");
      return;
    }

    if (editId) {
      // Update existing regex
      const index = regexList.findIndex((r) => r.id === editId);
      if (index > -1) {
        regexList[index] = { ...regexList[index], name, value };
        showStatus(regexStatusDiv, "Regex updated successfully.", "success");
      }
    } else {
      // Add new regex
      const newRegex = { id: generateId(), name, value };
      regexList.push(newRegex);
      showStatus(regexStatusDiv, "Regex added successfully.", "success");
    }

    saveData(storageKeys.regex, regexList);
    renderRegexList();
    resetRegexForm();
  };

  const startEditRegex = (id) => {
    const regexToEdit = regexList.find((r) => r.id === id);
    if (regexToEdit) {
      regexEditIdInput.value = id;
      regexNameInput.value = regexToEdit.name;
      regexValueInput.value = regexToEdit.value;
      saveRegexBtn.textContent = "Update Regex";
      regexNameInput.focus(); // Focus on name field for editing
    }
  };

  const deleteRegex = (id) => {
    if (confirm("Are you sure you want to delete this regex pattern?")) {
      regexList = regexList.filter((r) => r.id !== id);
      saveData(storageKeys.regex, regexList);
      renderRegexList();
      resetRegexForm(); // Reset form if the deleted item was being edited
      showStatus(regexStatusDiv, "Regex deleted.", "success");
    }
  };

  const resetRegexForm = () => {
    regexForm.reset();
    regexEditIdInput.value = "";
    saveRegexBtn.textContent = "Add Regex";
  };

  // --- History Management ---
  const renderHistory = () => {
    historyListUl.innerHTML = ""; // Clear list

    const searchTerm = historySearchInput.value.toLowerCase();
    const sortBy = historySortSelect.value;

    let filteredList = historyList.filter((item) =>
      item.url.toLowerCase().includes(searchTerm)
    );

    filteredList.sort((a, b) => {
      if (sortBy === "oldest") {
        return (a.timestamp || 0) - (b.timestamp || 0);
      } else {
        // newest (default)
        return (b.timestamp || 0) - (a.timestamp || 0);
      }
    });

    if (filteredList.length === 0) {
      historyListUl.innerHTML =
        "<li>No history items found matching criteria.</li>";
      return;
    }

    filteredList.forEach((item) => {
      const li = document.createElement("li");
      li.innerHTML = `
              <div class="item-content">
                  <span class="item-value">${escapeHtml(item.url)}</span>
                   ${
                     item.regexName
                       ? `<span class="item-detail">Matched by: ${escapeHtml(
                           item.regexName
                         )}</span>`
                       : ""
                   }
                  <span class="item-detail">Added: ${formatTimestamp(
                    item.timestamp
                  )}</span>
              </div>
              <div class="item-actions">
                  <button class="open-url-btn" data-url="${escapeHtml(
                    item.url
                  )}">Open</button>
               </div>
          `;
      li.querySelector(".open-url-btn").addEventListener("click", (e) => {
        openUrlInBackground(e.target.dataset.url);
      });
      historyListUl.appendChild(li);
    });
  };

  const addToHistory = (urlsToAdd, regexName) => {
    const now = Date.now();
    const newHistoryItems = urlsToAdd.map((url) => ({
      id: generateId(),
      url: url,
      timestamp: now,
      regexName: regexName, // Store which regex matched it
    }));

    // Add new items to the beginning and save
    historyList = [...newHistoryItems, ...historyList];
    // Optional: Limit history size
    const MAX_HISTORY_SIZE = 500;
    if (historyList.length > MAX_HISTORY_SIZE) {
      historyList = historyList.slice(0, MAX_HISTORY_SIZE);
    }

    saveData(storageKeys.history, historyList);
    // Optionally update view if history tab is active
    if (document.getElementById("historyTab").classList.contains("active")) {
      renderHistory();
    }
  };

  const clearHistory = () => {
    if (confirm("Are you sure you want to clear your extraction history?")) {
      historyList = []; // Clear the in-memory list
      saveData(storageKeys.history, historyList); // Update storage
      renderHistory(); // Re-render the history list
      showStatus(historyStatusDiv, "History cleared.", "success");
    }
  };

  // --- URL Extraction ---
  const openUrlInBackground = (url) => {
    // First get the current tab's index
    chrome.tabs
      .query({ active: true, currentWindow: true })
      .then((tabs) => {
        if (tabs.length === 0) throw new Error("Could not find active tab.");

        // Create new tab at current index + 1 (right next to current tab)
        return chrome.tabs.create({
          url: url,
          active: false,
          index: tabs[0].index + 1, // This places the new tab right after the current one
        });
      })
      .catch((error) => {
        console.error(`Error opening tab for ${url}:`, error);
        showStatus(
          extractStatusDiv,
          `Error opening tab: ${error.message}`,
          "error"
        );
      });
  };

  const displayGroupedUrls = (groupedUrls) => {
    extractResultsDiv.innerHTML = ""; // Clear previous results
    extractLoadingDiv.style.display = "none";

    const groupNames = Object.keys(groupedUrls);

    if (groupNames.length === 0) {
      extractResultsDiv.innerHTML =
        '<p class="status">No URLs found matching any regex pattern.</p>';
      return;
    }

    let totalUrls = 0;
    groupNames.forEach((groupName) => {
      const urls = groupedUrls[groupName];
      if (urls && urls.length > 0) {
        totalUrls += urls.length;

        // Create a container div for the entire group section
        const groupContainer = document.createElement("div");
        groupContainer.className = "url-group-container";

        // Create a container div for the header section
        const headerContainer = document.createElement("div");
        headerContainer.className = "group-header-container";

        // Create the group header
        const groupHeader = document.createElement("h2");
        groupHeader.textContent = escapeHtml(groupName); // Display Regex Name
        groupHeader.className = "group-header";

        // Add "Open All" button for this group
        const openAllButton = document.createElement("button");
        openAllButton.textContent = `Open All (${urls.length})`;
        openAllButton.className = "open-all-btn small-btn";
        openAllButton.addEventListener("click", () => {
          // Open all URLs in this group
          urls.forEach((url) => {
            openUrlInBackground(url);
          });
          showStatus(
            extractStatusDiv,
            `Opening ${urls.length} URLs from "${escapeHtml(
              groupName
            )}" group.`,
            "success"
          );
        });

        // Add header elements to the header container
        headerContainer.appendChild(groupHeader);
        headerContainer.appendChild(openAllButton);

        // Add the header container to the group container
        groupContainer.appendChild(headerContainer);

        // Add a horizontal rule for the underline
        const hr = document.createElement("hr");
        hr.className = "header-underline";
        groupContainer.appendChild(hr);

        // Create the URL list for this group
        const ul = document.createElement("ul");
        ul.className = "url-list";

        // Add each URL to the list
        urls.forEach((url) => {
          const li = document.createElement("li");

          const urlSpan = document.createElement("span");
          urlSpan.className = "url-text";
          urlSpan.textContent =
            url.length > 80
              ? escapeHtml(url.substring(0, 77)) + "..."
              : escapeHtml(url);
          urlSpan.title = url;

          // Create action buttons container
          const actionButtons = document.createElement("div");
          actionButtons.className = "action-buttons";

          // Create open button with icon
          const openButton = document.createElement("button");
          openButton.innerHTML = '<i class="icon-open">↗</i>'; // Simple external link arrow
          openButton.title = "Open URL in new tab";
          openButton.className = "icon-btn open-url-btn";
          openButton.dataset.url = url;
          openButton.addEventListener("click", (event) => {
            openUrlInBackground(
              event.target.closest(".open-url-btn").dataset.url
            );
          });

          // Create copy button with icon
          const copyButton = document.createElement("button");
          copyButton.innerHTML = '<i class="icon-copy">⎘</i>'; // Simple copy symbol
          copyButton.title = "Copy URL to clipboard";
          copyButton.className = "icon-btn copy-url-btn";
          copyButton.dataset.url = url;
          copyButton.addEventListener("click", (event) => {
            const urlToCopy = event.target.closest(".copy-url-btn").dataset.url;
            navigator.clipboard
              .writeText(urlToCopy)
              .then(() => {
                // Show temporary success indicator
                const originalIcon = copyButton.innerHTML;
                copyButton.innerHTML = '<i class="icon-check">✓</i>'; // Simple checkmark
                copyButton.classList.add("copied");
                setTimeout(() => {
                  copyButton.innerHTML = originalIcon;
                  copyButton.classList.remove("copied");
                }, 1500);

                showStatus(
                  extractStatusDiv,
                  "URL copied to clipboard",
                  "success",
                  1500
                );
              })
              .catch((err) => {
                console.error("Could not copy text: ", err);
                showStatus(
                  extractStatusDiv,
                  "Failed to copy URL",
                  "error",
                  1500
                );
              });
          });

          // Add buttons to action container
          actionButtons.appendChild(openButton);
          actionButtons.appendChild(copyButton);

          // Add elements to list item
          li.appendChild(urlSpan);
          li.appendChild(actionButtons);
          ul.appendChild(li);
        });

        // Add the URL list to the group container
        groupContainer.appendChild(ul);

        // Add the complete group container to the results div
        extractResultsDiv.appendChild(groupContainer);
      }
    });

    if (totalUrls > 0) {
      showStatus(
        extractStatusDiv,
        `Found ${totalUrls} URL(s) across ${groupNames.length} pattern(s).`,
        "success"
      );
    } else {
      extractResultsDiv.innerHTML =
        '<p class="status">No URLs found matching any regex pattern.</p>';
    }
  };

  const extractAndDisplayUrls = async () => {
    extractResultsDiv.innerHTML = "";
    showStatus(extractStatusDiv, "", "info"); // Clear status
    extractLoadingDiv.style.display = "block";

    if (regexList.length === 0) {
      showStatus(
        extractStatusDiv,
        'No regex patterns defined. Add patterns in the "Manage Regex" tab.',
        "error"
      );
      extractLoadingDiv.style.display = "none";
      return;
    }

    try {
      const [tab] = await chrome.tabs.query({
        active: true,
        currentWindow: true,
      });
      if (!tab) throw new Error("Could not find active tab.");
      if (
        tab.url &&
        (tab.url.startsWith("chrome://") ||
          tab.url.startsWith("https://chrome.google.com/webstore"))
      ) {
        throw new Error("Cannot extract HTML from this special page.");
      }

      const injectionResults = await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: () => document.documentElement.outerHTML,
      });

      if (
        chrome.runtime.lastError ||
        !injectionResults ||
        injectionResults.length === 0 ||
        !injectionResults[0].result
      ) {
        let errorMsg = "Failed to retrieve HTML from the page.";
        if (chrome.runtime.lastError)
          errorMsg += ` Error: ${chrome.runtime.lastError.message}`;
        throw new Error(errorMsg);
      }

      const htmlContent = injectionResults[0].result;
      const groupedUrls = {};
      const allFoundUrls = new Set(); // To avoid duplicate history entries if matched by multiple regex

      regexList.forEach((regexItem) => {
        try {
          // Important: Create RegExp with 'g' flag for global search
          const regex = new RegExp(regexItem.value, "g");
          const matches = htmlContent.match(regex);

          if (matches && matches.length > 0) {
            const uniqueMatches = [...new Set(matches)]; // Ensure uniqueness within this group
            groupedUrls[regexItem.name] = uniqueMatches;
            uniqueMatches.forEach((url) => allFoundUrls.add(url)); // Add to overall set for history
          }
        } catch (e) {
          console.warn(
            `Invalid regex pattern "${regexItem.name}": ${e.message}`
          );
          // Optionally show a warning in the UI for this specific regex
          showStatus(
            extractStatusDiv,
            `Warning: Regex "${escapeHtml(
              regexItem.name
            )}" is invalid and was skipped.`,
            "error",
            5000
          );
        }
      });

      displayGroupedUrls(groupedUrls);

      // Add all unique found URLs to history (pass only the Set values)
      if (allFoundUrls.size > 0) {
        // We lose the specific regex name info here for simplicity,
        // Could enhance addToHistory to accept the groupedUrls map if needed.
        addToHistory(Array.from(allFoundUrls), null); // Passing null for regexName as a url might match multiple
      }
    } catch (error) {
      console.error("Extraction Error:", error);
      showStatus(extractStatusDiv, `Error: ${error.message}`, "error");
      extractLoadingDiv.style.display = "none";
      extractResultsDiv.innerHTML = "";
    }
  };

  // --- Initialization ---
  const initialize = async () => {
    // Load data
    loadRegexPatterns();
    historyList = await loadData(storageKeys.history);

    // Setup Regex Tab
    regexForm.addEventListener("submit", saveRegex);

    // Setup History Tab
    historySearchInput.addEventListener("input", renderHistory);
    historySortSelect.addEventListener("change", renderHistory);
    clearHistoryBtn.addEventListener("click", clearHistory); // New event listener

    // Setup Extract Tab
    extractBtn.addEventListener("click", extractAndDisplayUrls);

    // Initial Render (only for the default active tab, others render on switch)
    // Assuming 'extractTab' is the default active tab, no initial render needed here.
    // If 'regexTab' or 'historyTab' were default, call their render functions here.

    // Set default tab (if needed, default is first tab 'Extract')
    // document.querySelector('.tab-button[data-tab="extractTab"]').click();

    console.log("Extension initialized.");
  };

  const escapeHtml = (unsafe) => {
    if (typeof unsafe !== "string") return unsafe;
    return unsafe
      .replace(/&/g, "&")
      .replace(/</g, "<")
      .replace(/>/g, ">")
      .replace(/"/g, """)
      .replace(/'/g, "'");
  };

  initialize(); // Start the extension logic
});
