(() => {
  "use strict";

  // IMPORTANT: Keep this deployed backend URL unchanged.
  const API_BASE = "https://mindnest-1z7w.onrender.com";

  const form = document.getElementById("predict-form");
  const submitBtn = document.getElementById("submit-btn");
  const resetBtn = document.getElementById("reset-btn");
  const errorRetryBtn = document.getElementById("error-retry-btn");

  const stateIdle = document.getElementById("state-idle");
  const stateLoading = document.getElementById("state-loading");
  const stateResult = document.getElementById("state-result");
  const stateError = document.getElementById("state-error");

  const scoreNumberEl = document.getElementById("score-number");
  const scoreBandEl = document.getElementById("score-band");
  const scoreContextEl = document.getElementById("score-context");
  const gaugeFill = document.getElementById("gauge-fill");
  const errorLabelEl = document.getElementById("error-label");
  const errorCopyEl = document.getElementById("error-copy");

  const homePage = document.getElementById("home-page");
  const assessmentPage = document.getElementById("assessment-page");
  const resultPage = document.getElementById("result-page");
  const progressFill = document.getElementById("progress-fill");
  const progressNumber = document.getElementById("progress-number");

  const GAUGE_ARC_LENGTH = 384;
  const sections = [...document.querySelectorAll(".form-section")];

  function goToPage(page) {
    [homePage, assessmentPage, resultPage].forEach((p) => p.classList.remove("active"));
    page.classList.add("active");
    window.scrollTo({ top: 0, behavior: "smooth" });

    document.querySelectorAll(".nav-link[data-page]").forEach((link) => {
      link.classList.toggle("active", link.dataset.page === (page === homePage ? "home" : "assessment"));
    });
  }

  function startAssessment() {
    // Start every assessment with a clean form so a previous attempt
    // is never carried into a new check-in.
    form.reset();
    stressHiddenInput.value = "";
    segGroup.querySelectorAll(".stress-option").forEach((btn) => btn.classList.remove("active"));
    clearAllErrors();
    hideErrorState();
    progressFill.style.width = "8%";
    progressNumber.textContent = "1";

    goToPage(assessmentPage);
    updateProgress();
  }

  document.getElementById("hero-start").addEventListener("click", startAssessment);

  document.getElementById("back-home").addEventListener("click", () => goToPage(homePage));
  document.getElementById("result-home").addEventListener("click", () => goToPage(homePage));
  document.getElementById("result-home-2").addEventListener("click", () => goToPage(homePage));

  function updateProgress() {
    const filled = sections.filter(section => {
      const controls = [...section.querySelectorAll("input:not([type='hidden']), select")];
      const hasStress = section.querySelector("#stress_level");
      return controls.some(c => String(c.value || "").trim() !== "") ||
             (hasStress && String(hasStress.value || "").trim() !== "");
    }).length;

    const current = Math.min(3, Math.max(1, filled + 1));
    progressNumber.textContent = String(current);
    progressFill.style.width = `${Math.min(100, Math.max(8, (filled / 3) * 100))}%`;
  }

  document.querySelectorAll("input, select").forEach(el => {
    el.addEventListener("input", updateProgress);
    el.addEventListener("change", updateProgress);
  });

  const segGroup = document.getElementById("stress_level_group");
  const stressHiddenInput = document.getElementById("stress_level");

  segGroup.querySelectorAll(".stress-option").forEach((btn) => {
    btn.addEventListener("click", () => {
      segGroup.querySelectorAll(".stress-option").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      stressHiddenInput.value = btn.dataset.value;
      clearFieldError(stressHiddenInput);
      updateProgress();
    });
  });

  function fieldWrapper(input) {
    return input.closest(".field");
  }

  function setFieldError(input, message) {
    const wrap = fieldWrapper(input);
    if (!wrap) return;
    wrap.classList.add("field-error");
    const msgEl = wrap.querySelector(".error-msg");
    if (msgEl) msgEl.textContent = message;
  }

  function clearFieldError(input) {
    const wrap = fieldWrapper(input);
    if (!wrap) return;
    wrap.classList.remove("field-error");
    const msgEl = wrap.querySelector(".error-msg");
    if (msgEl) msgEl.textContent = "";
  }

  function clearAllErrors() {
    form.querySelectorAll(".field").forEach(f => f.classList.remove("field-error"));
    form.querySelectorAll(".error-msg").forEach(m => m.textContent = "");
  }

  function validate(payload) {
    const errors = [];

    const numericChecks = [
      ["age", 10, 100],
      ["avg_daily_usage_hours", 0, 24],
      ["daily_unlocks", 0, Infinity],
      ["study_hours", 0, 24],
      ["physical_activity_hours", 0, 24],
      ["sleep_hours_per_night", 0, 24],
    ];

    numericChecks.forEach(([key, min, max]) => {
      const input = document.getElementById(key);
      const val = payload[key];
      if (val === "" || val === null || Number.isNaN(val)) {
        errors.push([input, "This field is required."]);
      } else if (val < min || val > max) {
        errors.push([input, `Must be between ${min} and ${max === Infinity ? "0+" : max}.`]);
      }
    });

    ["gender", "country", "academic_level", "most_used_platform", "purpose_of_use"].forEach(key => {
      const input = document.getElementById(key);
      if (!payload[key] || String(payload[key]).trim() === "") {
        errors.push([input, "This field is required."]);
      }
    });

    if (!payload.stress_level) {
      errors.push([stressHiddenInput, "Pick a stress level."]);
    }

    return errors;
  }

  function collectPayload() {
    const fd = new FormData(form);
    return {
      age: fd.get("age") === "" ? NaN : parseInt(fd.get("age"), 10),
      gender: fd.get("gender") || "",
      country: (fd.get("country") || "").trim(),
      academic_level: fd.get("academic_level") || "",
      most_used_platform: fd.get("most_used_platform") || "",
      purpose_of_use: fd.get("purpose_of_use") || "",
      avg_daily_usage_hours: fd.get("avg_daily_usage_hours") === "" ? NaN : parseFloat(fd.get("avg_daily_usage_hours")),
      daily_unlocks: fd.get("daily_unlocks") === "" ? NaN : parseInt(fd.get("daily_unlocks"), 10),
      study_hours: fd.get("study_hours") === "" ? NaN : parseFloat(fd.get("study_hours")),
      physical_activity_hours: fd.get("physical_activity_hours") === "" ? NaN : parseFloat(fd.get("physical_activity_hours")),
      sleep_hours_per_night: fd.get("sleep_hours_per_night") === "" ? NaN : parseFloat(fd.get("sleep_hours_per_night")),
      stress_level: fd.get("stress_level") || "",
    };
  }

  function bandFor(score) {
    if (score < 4) return {
      label: "Signal: strained",
      context: "Your responses suggest elevated strain right now. Small shifts in sleep or screen time can go a long way."
    };
    if (score < 7) return {
      label: "Signal: balanced",
      context: "Your rhythm looks fairly steady, with some room to recover and reset."
    };
    return {
      label: "Signal: strong",
      context: "Your habits point to a well-supported, resilient baseline. Keep it up."
    };
  }

  function showErrorPage(label, copy) {
    errorLabelEl.textContent = label;
    errorCopyEl.textContent = copy;
    goToPage(resultPage);
    document.querySelector(".result-grid").classList.add("error-visible");
    document.querySelector(".result-actions").style.display = "none";
    document.querySelector(".result-disclaimer").style.display = "none";
    document.querySelector(".hidden-state").hidden = false;
  }

  function hideErrorState() {
    document.querySelector(".result-grid").classList.remove("error-visible");
    document.querySelector(".result-actions").style.display = "";
    document.querySelector(".result-disclaimer").style.display = "";
    document.querySelector(".hidden-state").hidden = true;
  }

  function renderResult(score) {
    hideErrorState();
    const clamped = Math.max(0, Math.min(10, score));
    const { label, context } = bandFor(clamped);

    scoreNumberEl.textContent = Number(score).toFixed(2);
    scoreBandEl.textContent = label;
    scoreContextEl.textContent = context;

    gaugeFill.style.transition = "none";
    gaugeFill.style.strokeDashoffset = String(GAUGE_ARC_LENGTH);
    requestAnimationFrame(() => {
      gaugeFill.style.transition = "";
      gaugeFill.style.strokeDashoffset = String(GAUGE_ARC_LENGTH * (1 - clamped / 10));
    });

    goToPage(resultPage);
  }

  function setSubmitting(isSubmitting) {
    submitBtn.disabled = isSubmitting;
    submitBtn.classList.toggle("loading", isSubmitting);
  }

  function applyServerValidationErrors(detail) {
    if (!Array.isArray(detail)) return false;
    let matched = false;

    detail.forEach(err => {
      const field = Array.isArray(err.loc) ? err.loc[err.loc.length - 1] : null;
      const input = field ? document.getElementById(field) : null;
      const target = field === "stress_level" ? stressHiddenInput : input;
      if (target) {
        setFieldError(target, err.msg || "Invalid value.");
        matched = true;
      }
    });

    return matched;
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    clearAllErrors();
    hideErrorState();

    const payload = collectPayload();
    const clientErrors = validate(payload);

    if (clientErrors.length > 0) {
      clientErrors.forEach(([input, msg]) => input && setFieldError(input, msg));
      clientErrors[0][0]?.focus?.();
      return;
    }

    setSubmitting(true);

    const originalText = submitBtn.querySelector(".btn-label").textContent;
    submitBtn.querySelector(".btn-label").textContent = "Analyzing your signal";

    try {
      const res = await fetch(`${API_BASE}/predict`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.status === 422) {
        const body = await res.json().catch(() => null);
        const matched = body && applyServerValidationErrors(body.detail);
        showErrorPage(
          "Check your answers",
          matched ? "A few fields need attention. We've marked them on the assessment." : "The API rejected this submission. Please review your answers and try again."
        );
        return;
      }

      if (!res.ok) {
        let detailMsg = `The API responded with status ${res.status}.`;
        const body = await res.json().catch(() => null);
        if (body && typeof body.detail === "string") detailMsg = body.detail;
        showErrorPage("Prediction failed", detailMsg);
        return;
      }

      const data = await res.json();

      if (typeof data.predicted_mental_health_score !== "number") {
        showErrorPage("Unexpected response", "The API responded, but the score was missing or malformed.");
        return;
      }

      renderResult(data.predicted_mental_health_score);
    } catch (err) {
      showErrorPage(
        "Can't reach the server",
        `Couldn't connect to ${API_BASE}. Make sure the backend is running and reachable from this page.`
      );
    } finally {
      setSubmitting(false);
      submitBtn.querySelector(".btn-label").textContent = originalText;
    }
  });

  form.querySelectorAll("input, select").forEach(el => {
    el.addEventListener("input", () => clearFieldError(el));
    el.addEventListener("change", () => clearFieldError(el));
  });

  resetBtn.addEventListener("click", () => {
    form.reset();
    stressHiddenInput.value = "";
    segGroup.querySelectorAll(".stress-option").forEach(b => b.classList.remove("active"));
    clearAllErrors();
    hideErrorState();
    progressFill.style.width = "8%";
    progressNumber.textContent = "1";
    goToPage(assessmentPage);
  });

  errorRetryBtn.addEventListener("click", () => {
    hideErrorState();
    goToPage(assessmentPage);
  });

  updateProgress();
})();
