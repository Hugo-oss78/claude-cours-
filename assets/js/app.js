/* ===========================================================
   Cours Complet sur Claude — logique partagée (progression locale)
   Tout est stocké dans le localStorage du navigateur : rien n'est
   envoyé nulle part, la progression est propre à cet appareil.
   =========================================================== */

(function () {
  "use strict";

  var STORAGE_KEY = "claude-cours-progress-v1";

  var MODULES = [
    { id: "bases", href: "01-bases.html" },
    { id: "prompting", href: "02-prompting.html" },
    { id: "artifacts", href: "03-artifacts.html" },
    { id: "skills", href: "04-skills.html" },
    { id: "workflows", href: "05-workflows.html" },
    { id: "connectors", href: "06-connectors.html" },
    { id: "automation", href: "07-automation.html" },
    { id: "code", href: "08-claude-code.html" },
    { id: "pratique", href: "09-projets-pratiques.html" },
    { id: "loveroom", href: "10-business-loveroom.html" }
  ];

  function loadProgress() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : {};
    } catch (e) {
      return {};
    }
  }

  function saveProgress(data) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (e) {
      /* stockage indisponible (navigation privée, etc.) : on ignore */
    }
  }

  function markDone(moduleId, done) {
    var data = loadProgress();
    data[moduleId] = !!done;
    saveProgress(data);
    renderAll();
  }

  window.ClaudeCourse = {
    modules: MODULES,
    markDone: markDone,
    getProgress: loadProgress
  };

  function renderTopPill() {
    var pill = document.querySelector("[data-progress-pill]");
    if (!pill) return;
    var data = loadProgress();
    var done = MODULES.filter(function (m) { return data[m.id]; }).length;
    pill.textContent = done + " / " + MODULES.length + " modules terminés";
  }

  function renderSidebar() {
    var data = loadProgress();
    var links = document.querySelectorAll(".sidebar a[data-module]");
    links.forEach(function (a) {
      var id = a.getAttribute("data-module");
      if (data[id]) a.classList.add("done");
      else a.classList.remove("done");
    });
  }

  function renderHomeRoadmap() {
    var data = loadProgress();
    var cards = document.querySelectorAll(".rcard[data-module]");
    cards.forEach(function (c) {
      var id = c.getAttribute("data-module");
      if (data[id]) c.classList.add("done");
      else c.classList.remove("done");
    });
  }

  function wireMarkDoneButton() {
    var btn = document.querySelector("[data-mark-done]");
    if (!btn) return;
    var id = btn.getAttribute("data-mark-done");
    var data = loadProgress();
    function refreshLabel() {
      btn.textContent = data[id]
        ? "✓ Module marqué comme terminé"
        : "Marquer ce module comme terminé";
      btn.classList.toggle("callout", false);
    }
    refreshLabel();
    btn.addEventListener("click", function () {
      data = loadProgress();
      data[id] = !data[id];
      saveProgress(data);
      refreshLabel();
      renderAll();
    });
  }

  function wireChecklists() {
    var lists = document.querySelectorAll("[data-checklist]");
    lists.forEach(function (list) {
      var key = "claude-cours-checklist-" + list.getAttribute("data-checklist");
      var boxes = list.querySelectorAll("input[type=checkbox]");
      var saved = {};
      try { saved = JSON.parse(localStorage.getItem(key) || "{}"); } catch (e) {}
      boxes.forEach(function (box, i) {
        if (saved[i]) box.checked = true;
        box.addEventListener("change", function () {
          saved[i] = box.checked;
          try { localStorage.setItem(key, JSON.stringify(saved)); } catch (e) {}
        });
      });
    });
  }

  function renderAll() {
    renderTopPill();
    renderSidebar();
    renderHomeRoadmap();
  }

  document.addEventListener("DOMContentLoaded", function () {
    renderAll();
    wireMarkDoneButton();
    wireChecklists();
  });
})();
