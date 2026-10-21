const toast = document.querySelector(".toast");
const nav = document.querySelector("#site-nav");
const menu = document.querySelector(".menu");
const lightbox = document.querySelector(".lightbox");
const lightboxImg = lightbox.querySelector("img");
const lightboxCap = lightbox.querySelector("p");
const progress = document.querySelector("#progress");
const clock = document.querySelector("#clock");

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  window.clearTimeout(showToast.timer);
  showToast.timer = window.setTimeout(() => toast.classList.remove("show"), 1600);
}

async function copyText(text) {
  if (navigator.clipboard && window.isSecureContext) {
    await navigator.clipboard.writeText(text);
    return;
  }
  const area = document.createElement("textarea");
  area.value = text;
  area.setAttribute("readonly", "");
  area.style.position = "fixed";
  area.style.left = "-9999px";
  document.body.appendChild(area);
  area.select();
  const ok = document.execCommand("copy");
  area.remove();
  if (!ok) throw new Error("copy failed");
}

document.querySelectorAll(".js-copy").forEach((button) => {
  button.addEventListener("click", async () => {
    const value = button.dataset.copy;
    try {
      await copyText(value);
      showToast("Copied " + value);
    } catch {
      showToast("Copy " + value + " from the page");
    }
  });
});

menu.addEventListener("click", () => {
  const open = nav.classList.toggle("open");
  menu.setAttribute("aria-expanded", String(open));
});

nav.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    nav.classList.remove("open");
    menu.setAttribute("aria-expanded", "false");
  });
});

function tick() {
  clock.textContent = new Date().toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit"
  });
}

tick();
window.setInterval(tick, 1000);

function onScroll() {
  const root = document.documentElement;
  const max = root.scrollHeight - root.clientHeight;
  const amount = max > 0 ? root.scrollTop / max : 0;
  progress.style.transform = "scaleX(" + amount + ")";
}

onScroll();
document.addEventListener("scroll", onScroll, { passive: true });

function closeLightbox() {
  lightbox.hidden = true;
  lightboxImg.removeAttribute("src");
  document.body.style.overflow = "";
}

document.querySelectorAll(".shot").forEach((shot) => {
  shot.addEventListener("click", () => {
    lightboxImg.src = shot.dataset.full;
    lightboxImg.alt = shot.querySelector("img").alt;
    lightboxCap.textContent = shot.dataset.cap;
    lightbox.hidden = false;
    document.body.style.overflow = "hidden";
    lightbox.querySelector(".lightbox-close").focus();
  });
});

lightbox.querySelector(".lightbox-close").addEventListener("click", closeLightbox);

lightbox.addEventListener("click", (event) => {
  if (event.target === lightbox) closeLightbox();
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && !lightbox.hidden) closeLightbox();
});
