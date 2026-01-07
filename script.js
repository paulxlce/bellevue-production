document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("#contact-form");
  const status = document.querySelector(".form-status");
  const logos = document.querySelectorAll(".theme-logo");
  const FORM_ENDPOINT = "https://formspree.io/f/xwvpgovk";

  if (form) {
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const data = new FormData(form);
      const name = (data.get("name") || "").toString().trim();
      const email = (data.get("email") || "").toString().trim();
      const honeypot = (data.get("_gotcha") || "").toString().trim();

      if (honeypot) {
        return;
      }

      if (!name || !email) {
        status.textContent = "Merci d'ajouter votre nom et votre email pour que nous puissions répondre.";
        status.style.color = "#e63e3e";
        return;
      }

      status.textContent = "Envoi en cours...";
      status.style.color = "#5d6067";
      form.querySelector("button[type='submit']").disabled = true;

      fetch(FORM_ENDPOINT, {
        method: "POST",
        body: data,
        headers: { Accept: "application/json" },
      })
        .then((response) => {
          if (response.ok) {
            status.textContent = "Merci ! Nous revenons vers vous sous un jour ouvré.";
            status.style.color = "#0a84ff";
            form.reset();
          } else {
            status.textContent = "Une erreur est survenue. Merci de réessayer ou de nous écrire directement à contact@bellevue-production.fr.";
            status.style.color = "#e63e3e";
          }
        })
        .catch(() => {
          status.textContent = "Impossible d'envoyer pour le moment. Écrivez-nous à contact@bellevue-production.fr.";
          status.style.color = "#e63e3e";
        })
        .finally(() => {
          form.querySelector("button[type='submit']").disabled = false;
        });
    });
  }

  const revealables = document.querySelectorAll(".reveal");
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.style.animationPlayState = "running";
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.2 }
  );

  revealables.forEach((el) => {
    el.style.animationPlayState = "paused";
    observer.observe(el);
  });

  // Theme toggle removed

  // Mobile preview toggle removed; responsive layout remains handled by CSS media queries.

  // Toggle play overlay on videos
  document.querySelectorAll(".work-media").forEach((media) => {
    const video = media.querySelector("video");
    if (!video) return;
    const setState = () => {
      if (video.paused) {
        media.classList.remove("playing");
      } else {
        media.classList.add("playing");
      }
    };
    video.addEventListener("play", setState);
    video.addEventListener("pause", setState);
    video.addEventListener("ended", setState);
  });

  // Méthode : jauge de progression
  const steps = Array.from(document.querySelectorAll(".method-step"));
  const thumb = document.querySelector(".method-thumb");
  const track = document.querySelector(".method-track");
  const fill = document.querySelector(".method-fill");
  const updateGauge = (ratio) => {
    if (!track) return;
    const horizontal = track.clientWidth >= track.clientHeight;
    if (thumb) {
      if (horizontal) {
        thumb.style.transform = `translate(${ratio * 100}%, 0)`;
      } else {
        thumb.style.transform = `translate(-50%, -50%)`;
        thumb.style.top = `${ratio * 100}%`;
      }
    }
    if (fill) {
      if (horizontal) {
        fill.style.width = `${Math.max(ratio * 100, 4)}%`;
        fill.style.height = "100%";
      } else {
        fill.style.height = `${Math.max(ratio * 100, 4)}%`;
        fill.style.width = "100%";
      }
    }
  };

  if (steps.length && track) {
    const total = steps.length;
    const methodObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const index = steps.indexOf(entry.target);
          const ratio = total > 1 ? index / (total - 1) : 0;
          steps.forEach((el) => el.classList.remove("is-active"));
          entry.target.classList.add("is-active");
          updateGauge(ratio);
        });
      },
      { threshold: 0.4 }
    );
    steps.forEach((step) => methodObserver.observe(step));
  }
});
