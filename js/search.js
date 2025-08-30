let pagefind;

document.addEventListener("DOMContentLoaded", async function () {
  // Initialize Pagefind
  pagefind = await import("/pagefind/pagefind.js");

  const modal = document.getElementById("search-modal");
  const searchInput = document.getElementById("search-input");
  const searchResults = document.getElementById("search-results");

  let currentResults = [];
  let selectedIndex = -1;

  // Function to open search modal
  function openSearchModal() {
    modal.classList.add("active");
    document.body.style.overflow = "hidden";

    setTimeout(() => {
      searchInput.focus();
    }, 100);
  }

  // Function to close search modal
  function closeSearchModal() {
    modal.classList.remove("active");
    document.body.style.overflow = "";
    searchInput.value = "";
    searchResults.innerHTML = "";
    currentResults = [];
    selectedIndex = -1;
  }

  // Function to render search results
  function renderResults(results) {
    if (results.length === 0) {
      searchResults.innerHTML =
        '<div class="search-empty">No results found</div>';
      return;
    }

    searchResults.innerHTML = results
      .map(
        (result, index) => `
        <div class="search-result ${index === selectedIndex ? "selected" : ""}" data-index="${index}">
          <a href="${result.url}" class="search-result-title">${result.meta.title}</a>
          <p class="search-result-excerpt">${result.excerpt}</p>
        </div>
      `,
      )
      .join("");

    // Add click handlers to results
    searchResults.querySelectorAll(".search-result").forEach((el, index) => {
      el.addEventListener("click", () => {
        window.location.href = results[index].url;
        closeSearchModal();
      });
    });
  }

  // Search function
  async function performSearch(query) {
    if (!query.trim()) {
      searchResults.innerHTML = "";
      currentResults = [];
      return;
    }

    try {
      const search = await pagefind.search(query);
      const results = await Promise.all(
        search.results.slice(0, 8).map((r) => r.data()),
      );

      currentResults = results;
      selectedIndex = -1;
      renderResults(results);
    } catch (error) {
      console.error("Search error:", error);
      searchResults.innerHTML =
        '<div class="search-empty">Search temporarily unavailable</div>';
    }
  }

  // Search input handler with debouncing
  let searchTimeout;
  searchInput.addEventListener("input", function (e) {
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(() => {
      performSearch(e.target.value);
    }, 150);
  });

  // Keyboard navigation
  searchInput.addEventListener("keydown", function (e) {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      selectedIndex = Math.min(selectedIndex + 1, currentResults.length - 1);
      renderResults(currentResults);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      selectedIndex = Math.max(selectedIndex - 1, -1);
      renderResults(currentResults);
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (selectedIndex >= 0 && currentResults[selectedIndex]) {
        window.location.href = currentResults[selectedIndex].url;
        closeSearchModal();
      }
    }
  });

  // Open search with '/' key OR search button click
  document.addEventListener("keydown", function (e) {
    if (
      e.key === "/" &&
      !["INPUT", "TEXTAREA"].includes(document.activeElement.tagName)
    ) {
      e.preventDefault();
      openSearchModal();
    }

    if (e.key === "Escape") {
      closeSearchModal();
    }
  });

  // Search trigger button
  const searchTrigger = document.getElementById("search-trigger");
  if (searchTrigger) {
    searchTrigger.addEventListener("click", function (e) {
      e.preventDefault();
      openSearchModal();
    });
  }

  // Close search when clicking outside
  modal.addEventListener("click", function (e) {
    if (e.target === modal) {
      closeSearchModal();
    }
  });
});
