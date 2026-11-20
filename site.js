const menu = document.querySelector('.menu-toggle');
const navigation = document.querySelector('#site-nav');
const smallScreen = window.matchMedia('(max-width: 46rem)');

function setMenu(open) {
  menu.setAttribute('aria-expanded', String(open));
  navigation.hidden = smallScreen.matches && !open;
}

function fitMenu() {
  menu.hidden = !smallScreen.matches;
  setMenu(false);
}

menu.addEventListener('click', () => setMenu(menu.getAttribute('aria-expanded') !== 'true'));
navigation.addEventListener('click', event => {
  if (smallScreen.matches && event.target.closest('a')) setMenu(false);
});
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && menu.getAttribute('aria-expanded') === 'true') {
    setMenu(false);
    menu.focus();
  }
});
smallScreen.addEventListener('change', fitMenu);
fitMenu();
