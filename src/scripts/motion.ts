// Scroll motion shared by every page: split headings slide up line by line,
// [data-reveal] blocks rise in, [data-parallax] images drift.
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';

gsap.registerPlugin(ScrollTrigger, SplitText);

export function initMotion() {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduce) return;

  // Silent loops play only while on screen
  const clips = new IntersectionObserver(
    (entries) =>
      entries.forEach((e) => {
        const v = e.target as HTMLVideoElement;
        if (e.isIntersecting) v.play().catch(() => {});
        else v.pause();
      }),
    { threshold: 0.2 },
  );
  document.querySelectorAll('video[data-autoplay]').forEach((v) => clips.observe(v));

  document.fonts.ready.then(() => {
    document.querySelectorAll<HTMLElement>('[data-split]').forEach((el) => {
      SplitText.create(el, {
        type: 'lines',
        mask: 'lines',
        linesClass: 'split-line',
        autoSplit: true,
        onSplit(self) {
          return gsap.from(self.lines, {
            yPercent: 110,
            duration: 1,
            ease: 'expo.out',
            stagger: 0.08,
            delay: Number(el.dataset.splitDelay ?? 0),
            scrollTrigger: el.hasAttribute('data-split-now') ? undefined : { trigger: el, start: 'top 88%' },
          });
        },
      });
    });
  });

  gsap.utils.toArray<HTMLElement>('[data-reveal]').forEach((el) => {
    gsap.to(el, {
      opacity: 1,
      translate: '0 0',
      duration: 1,
      ease: 'expo.out',
      delay: Number(el.dataset.revealDelay ?? 0),
      scrollTrigger: { trigger: el, start: 'top 90%' },
    });
  });

  gsap.utils.toArray<HTMLElement>('[data-parallax]').forEach((el) => {
    const amount = Number(el.dataset.parallax || 12);
    gsap.fromTo(
      el,
      { yPercent: -amount },
      { yPercent: amount, ease: 'none', scrollTrigger: { trigger: el.parentElement, scrub: true } },
    );
  });
}
