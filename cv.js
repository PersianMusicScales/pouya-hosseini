const printButton = document.querySelector('#print-cv');
printButton.hidden = false;
printButton.addEventListener('click', () => window.print());

const contents = document.querySelector('.cv-index');
const compactContents = window.matchMedia('(max-width: 48rem)');
const contentsLinks = [...contents.querySelectorAll('nav a')];
const sections = contentsLinks.map(link => document.querySelector(link.hash));
function fitContents() {
  contents.open = !compactContents.matches;
}
fitContents();
compactContents.addEventListener('change', fitContents);
contents.addEventListener('click', event => {
  if (compactContents.matches && event.target.closest('a')) contents.open = false;
});

let currentLink;
let scheduled = false;
function showReadingPosition() {
  scheduled = false;
  const readingLine = Math.min(160, window.innerHeight * 0.23);
  let index = 0;
  for (let i = 1; i < sections.length; i++) {
    if (sections[i].getBoundingClientRect().top > readingLine) break;
    index = i;
  }
  if (Math.ceil(window.scrollY + window.innerHeight) >= document.documentElement.scrollHeight - 1) {
    index = sections.length - 1;
  }
  if (currentLink === contentsLinks[index]) return;
  currentLink?.removeAttribute('aria-current');
  currentLink = contentsLinks[index];
  currentLink.setAttribute('aria-current', 'location');
}
function queueReadingPosition() {
  if (!scheduled) {
    scheduled = true;
    window.requestAnimationFrame(showReadingPosition);
  }
}
window.addEventListener('scroll', queueReadingPosition, { passive: true });
window.addEventListener('resize', queueReadingPosition, { passive: true });
showReadingPosition();
