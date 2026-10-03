// Example standalone branded video (script/video-example.json): the template for the build-branded-video skill.
//   vexample01  title slide      the shared title slide (video/series.js), the video's title from the lesson's series block
//   vexample02  the tip          two dogs on a path, a distance bar, "Spot it first", "Turn before the alarm"; logo close with a call to action
(() => {
  const { sayAt, clamp } = C1;
  registerScene('vexample01', ctx => SKIT.titleSlide(ctx));

  registerScene('vexample02', ctx => {
    const { stage, tl, cue, end, dur } = ctx;
    C2.style(stage);
    const at = (i, p, fb, lead) => sayAt(ctx, i, p, fb, lead);
    const h = K.heading(stage, 'See it *before your dog does*', { x: 100, y: 110, w: 1400, size: 64 });
    A.in(tl, h.all, 0.05, 'fadeUp', { dur: 0.7, stagger: 0.1 });
    const sv = K.svg(stage, { x: 0, y: 0, w: 1920, h: 1080 });
    const D1 = C2.dog(sv, 520, 620, 0.9);
    const D2 = C2.dog(sv, 1450, 620, 0.9);
    D2.outer.setAttribute('transform', 'translate(2900 0) scale(-1 1)');
    A.in(tl, D1.outer, cue(0) + 0.2, 'fadeUp', { dur: 0.6 });
    A.in(tl, D2.outer, cue(0) + 0.5, 'fade', { dur: 0.6 });
    const bar = K.path(sv, 'M 760 780 L 1200 780', { stroke: C2.C.green, 'stroke-width': 8 });
    A.draw(tl, bar, clamp(at(0, 'before your dog does', 0.6, 0.3), cue(0) + 0.8, end(0)), 0.8);
    const p1 = C2.pill(stage, 'eye', 'Spot it *first*', { x: 980, y: 820, center: true, size: 34 });
    A.in(tl, p1, clamp(at(0, 'spot', 0.3, 0.2), cue(0) + 0.6, end(0)), 'pop', { dur: 0.5 });
    const p2 = C2.pill(stage, 'undo-2', 'Turn before *the alarm*', { x: 980, y: 300, center: true, size: 34, variant: 'green' });
    A.in(tl, p2, clamp(at(1, 'turn around', 0.4, 0.3), cue(1) + 0.2, end(1) - 0.5), 'fadeUp', { dur: 0.5 });
    tl.to(D1.outer, { x: -60, duration: 0.8, ease: 'power2.inOut' }, clamp(at(1, 'turn around', 0.45, 0.1), cue(1) + 0.3, end(1) - 0.4));
    SKIT.logoClose(ctx, cue(2) + 0.1, [h.root, sv, p1, p2], { cta: 'Help with walks? *Book a session*' });
  });
})();
