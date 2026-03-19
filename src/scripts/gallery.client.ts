import PhotoSwipeLightbox from "photoswipe/lightbox";
import "photoswipe/style.css";

/** Used only until the browser has decoded the file (then real pixels are set). */
const FALLBACK_W = 1920;
const FALLBACK_H = 1280;

function prefersReducedMotion(): boolean {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/**
 * PhotoSwipe needs pixel dimensions; we read them from the thumbnail <img>
 * so portfolio.json does not need width/height per file.
 */
function fillPswpDimensions(root: ParentNode = document): void {
  root.querySelectorAll<HTMLAnchorElement>(".pswp-gallery a").forEach((anchor) => {
    const img = anchor.querySelector("img");
    if (!img) return;

    const apply = (): void => {
      const w = img.naturalWidth > 0 ? img.naturalWidth : FALLBACK_W;
      const h = img.naturalHeight > 0 ? img.naturalHeight : FALLBACK_H;
      anchor.dataset.pswpWidth = String(w);
      anchor.dataset.pswpHeight = String(h);
    };

    if (img.complete) {
      apply();
    } else {
      anchor.dataset.pswpWidth = String(FALLBACK_W);
      anchor.dataset.pswpHeight = String(FALLBACK_H);
      img.addEventListener("load", apply, { once: true });
      img.addEventListener("error", apply, { once: true });
    }
  });
}

function initReveal(): void {
  const reduced = prefersReducedMotion();

  const revealEls = document.querySelectorAll<HTMLElement>("[data-reveal]");
  const childEls = document.querySelectorAll<HTMLElement>("[data-reveal-child]");

  if (reduced) {
    revealEls.forEach((el) => el.classList.add("is-visible"));
    childEls.forEach((el) => el.classList.add("is-visible"));
    return;
  }

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        io.unobserve(entry.target);
      });
    },
    { rootMargin: "0px 0px -8% 0px", threshold: 0.06 }
  );

  revealEls.forEach((el) => io.observe(el));

  const ioChild = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        ioChild.unobserve(entry.target);
      });
    },
    { rootMargin: "0px 0px -5% 0px", threshold: 0.08 }
  );

  childEls.forEach((el) => ioChild.observe(el));
}

function initPhotoSwipe(): void {
  document.querySelectorAll<HTMLElement>(".pswp-gallery").forEach((gallery) => {
    const lightbox = new PhotoSwipeLightbox({
      gallery,
      children: "a",
      pswpModule: () => import("photoswipe"),
    });
    lightbox.init();
  });
}

initReveal();
fillPswpDimensions();
initPhotoSwipe();
window.addEventListener("load", () => fillPswpDimensions());
