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

  var PROFILE_KEY = "claude-cours-profile-v1";

  function loadProfileData() {
    try {
      var raw = localStorage.getItem(PROFILE_KEY);
      return raw ? JSON.parse(raw) : {};
    } catch (e) {
      return {};
    }
  }

  function saveProfileData(data) {
    try {
      localStorage.setItem(PROFILE_KEY, JSON.stringify(data));
    } catch (e) {
      /* stockage indisponible : on ignore */
    }
  }

  window.ClaudeCourse = {
    modules: MODULES,
    markDone: markDone,
    getProgress: loadProgress,
    loadProfile: loadProfileData,
    saveProfile: saveProfileData
  };

  /* Remplace dans les promptbox les infos fixes de l'appartement
     ([ville], [adresse], [CODE_PORTE]...) par les valeurs enregistrées
     dans le profil local, quand elles existent. */
  var PROFILE_TOKENS = [
    { tokens: ["[ville]", "[ville/quartier]"], field: "ville" },
    { tokens: ["[adresse]"], field: "adresse" },
    { tokens: ["[CODE_PORTE]", "[code boîte à clés]"], field: "code_porte" },
    { tokens: ["[wifi]"], field: "wifi" },
    { tokens: ["[règles de la maison]"], field: "regles" },
    { tokens: ["[numéro d'urgence]"], field: "urgence" },
    { tokens: ["[NOM_APPART]"], field: "nom" }
  ];

  function escapeHtml(s) {
    var d = document.createElement("div");
    d.textContent = s;
    return d.innerHTML;
  }

  function personalizePromptboxes() {
    var profile = loadProfileData();
    var boxes = document.querySelectorAll(".promptbox");
    boxes.forEach(function (box) {
      var html = box.innerHTML;
      PROFILE_TOKENS.forEach(function (t) {
        var val = profile[t.field];
        if (!val) return;
        t.tokens.forEach(function (tok) {
          if (html.indexOf(tok) !== -1) {
            html = html.split(tok).join('<span class="filled">' + escapeHtml(val) + "</span>");
          }
        });
      });
      box.innerHTML = html;
    });
  }

  /* Moteur de quiz générique : chaque .quiz-q porte data-qid, data-answer,
     data-explain ; chaque bouton .quiz-opt porte data-choice. Les réponses
     sont mémorisées dans le localStorage pour rester visibles au retour. */
  function wireQuiz() {
    var storeKey = "claude-cours-quiz-v1";
    var saved = {};
    try { saved = JSON.parse(localStorage.getItem(storeKey) || "{}"); } catch (e) {}

    var questions = document.querySelectorAll(".quiz-q");
    questions.forEach(function (q) {
      var id = q.getAttribute("data-qid");
      var correct = q.getAttribute("data-answer");
      var explain = q.getAttribute("data-explain") || "";
      var feedback = q.querySelector(".quiz-feedback");
      var opts = q.querySelectorAll(".quiz-opt");

      function applyChoice(choice) {
        opts.forEach(function (o) {
          o.classList.remove("correct", "incorrect");
        });
        var correctBtn = q.querySelector('.quiz-opt[data-choice="' + correct + '"]');
        var chosenBtn = q.querySelector('.quiz-opt[data-choice="' + choice + '"]');
        if (correctBtn) correctBtn.classList.add("correct");
        if (chosenBtn && choice !== correct) chosenBtn.classList.add("incorrect");
        if (feedback) {
          feedback.textContent = (choice === correct ? "✅ Exact. " : "❌ Pas tout à fait. ") + explain;
          feedback.classList.add("show");
        }
      }

      if (saved[id]) applyChoice(saved[id]);

      opts.forEach(function (o) {
        o.addEventListener("click", function () {
          var choice = o.getAttribute("data-choice");
          saved[id] = choice;
          try { localStorage.setItem(storeKey, JSON.stringify(saved)); } catch (e) {}
          applyChoice(choice);
        });
      });
    });
  }

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

  function wireProfileForm() {
    var form = document.querySelector("[data-profile-form]");
    if (!form) return;
    var status = form.querySelector("[data-profile-status]");
    var profile = loadProfileData();
    form.querySelectorAll("[data-field]").forEach(function (input) {
      var key = input.getAttribute("data-field");
      if (profile[key]) input.value = profile[key];
    });
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var data = {};
      form.querySelectorAll("[data-field]").forEach(function (input) {
        data[input.getAttribute("data-field")] = input.value.trim();
      });
      saveProfileData(data);
      if (status) {
        status.textContent = "✓ Profil enregistré sur cet appareil.";
        setTimeout(function () { status.textContent = ""; }, 3000);
      }
    });
    var resetBtn = form.querySelector("[data-profile-reset]");
    if (resetBtn) {
      resetBtn.addEventListener("click", function () {
        if (!confirm("Effacer toutes les informations enregistrées ?")) return;
        try { localStorage.removeItem(PROFILE_KEY); } catch (e) {}
        form.querySelectorAll("[data-field]").forEach(function (input) { input.value = ""; });
        if (status) {
          status.textContent = "Profil effacé.";
          setTimeout(function () { status.textContent = ""; }, 3000);
        }
      });
    }
  }

  document.addEventListener("DOMContentLoaded", function () {
    renderAll();
    wireMarkDoneButton();
    wireChecklists();
    personalizePromptboxes();
    wireQuiz();
    wireProfileForm();
  });
})();
