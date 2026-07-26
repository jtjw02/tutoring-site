// custom cursor dot
const dot = document.getElementById('cursorDot');
if (dot) {
  window.addEventListener('mousemove', e => {
    dot.style.left = e.clientX + 'px';
    dot.style.top = e.clientY + 'px';
  });
}

// mobile nav toggle
const navToggle = document.getElementById('navToggle');
const navList = document.getElementById('navList');
if (navToggle && navList) {
  navToggle.addEventListener('click', () => {
    navList.classList.toggle('open');
  });
  navList.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => navList.classList.remove('open'));
  });
}

// scroll reveal
const io = new IntersectionObserver((entries) => {
  entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('in'); });
}, { threshold: 0.1 });
document.querySelectorAll('.reveal').forEach(el => io.observe(el));

// hero graph draw-in (home page only)
const path = document.getElementById('parabola');
if (path) {
  const len = path.getTotalLength();
  path.style.strokeDasharray = len;
  path.style.strokeDashoffset = len;
  requestAnimationFrame(() => {
    path.style.transition = 'stroke-dashoffset 1.6s cubic-bezier(0.16,1,0.3,1)';
    path.style.strokeDashoffset = 0;
  });
}
