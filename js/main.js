(() => {
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');

  // Type once per page load. Keep the full heading available to assistive
  // technology and reserve its space so the surrounding layout stays still.
  const intro = document.getElementById('intro');
  const name = intro.textContent;
  const reserve = document.createElement('span');
  reserve.className = 'intro-reserve';
  reserve.setAttribute('aria-hidden', 'true');
  reserve.textContent = name;
  const typed = document.createElement('span');
  typed.className = 'intro-typed';
  typed.setAttribute('aria-hidden', 'true');
  intro.setAttribute('aria-label', name);
  intro.replaceChildren(reserve, typed);
  let typingTimer;
  const letters = Array.from(name);
  let character = 0;
  function finishTyping() {
    clearTimeout(typingTimer);
    typed.textContent = name;
    typed.classList.remove('is-typing');
  }
  function typeNextCharacter() {
    typed.textContent = letters.slice(0, ++character).join('');
    typingTimer = setTimeout(character < letters.length ? typeNextCharacter : finishTyping,
      character < letters.length ? 90 : 500);
  }
  if (reducedMotion.matches || document.hidden) finishTyping();
  else {
    typed.classList.add('is-typing');
    typingTimer = setTimeout(typeNextCharacter, 180);
  }
  reducedMotion.addEventListener('change', () => { if (reducedMotion.matches) finishTyping(); });
  document.addEventListener('visibilitychange', () => { if (document.hidden) finishTyping(); });

  // Accessible tabs: arrows move between jobs; Tab moves into the selected panel.
  const tabs = [...document.querySelectorAll('[role="tab"]')];
  function selectTab(selected) {
    tabs.forEach(tab => {
      const active = tab === selected;
      tab.setAttribute('aria-selected', String(active));
      tab.tabIndex = active ? 0 : -1;
      document.getElementById(tab.getAttribute('aria-controls')).hidden = !active;
    });
  }
  tabs.forEach((tab, index) => {
    tab.addEventListener('click', () => selectTab(tab));
    tab.addEventListener('keydown', event => {
      let next;
      if (event.key === 'ArrowRight') next = (index + 1) % tabs.length;
      if (event.key === 'ArrowLeft') next = (index - 1 + tabs.length) % tabs.length;
      if (event.key === 'Home') next = 0;
      if (event.key === 'End') next = tabs.length - 1;
      if (next === undefined) return;
      event.preventDefault();
      selectTab(tabs[next]);
      tabs[next].focus();
    });
  });

  // Kathir's original hand-built key arrangement, with the same staggered
  // two-turn motion. Native animation replaces the external animation library.
  const keyboard = document.getElementById('boxes');
  const motionToggle = document.getElementById('motion-toggle');
  let manuallyPaused = false;
  let inView = false;
  let animations = [];
  function updateMotion() {
    const paused = manuallyPaused || reducedMotion.matches;
    motionToggle.textContent = reducedMotion.matches ? 'Reduced motion on' : paused ? 'Play animation' : 'Pause animation';
    motionToggle.setAttribute('aria-pressed', String(paused));
    motionToggle.disabled = reducedMotion.matches;
    if (reducedMotion.matches) {
      animations.forEach(animation => animation.cancel());
      animations = [];
      return;
    }
    if (!animations.length) {
      animations = [...keyboard.querySelectorAll('.key')].map((key, index) => {
        const animation = key.animate([
          { transform: 'translateY(0) rotate(0deg)' },
          { transform: 'translateY(42px) rotate(360deg)', offset: 0.5 },
          { transform: 'translateY(0) rotate(720deg)' }
        ], { duration: 20000, delay: index * 100, iterations: Infinity, easing: 'ease-in-out' });
        animation.pause();
        return animation;
      });
    }
    animations.forEach(animation => {
      if (paused || !inView || document.hidden) animation.pause();
      else animation.play();
    });
  }
  new IntersectionObserver(entries => {
    inView = entries[0].isIntersecting;
    updateMotion();
  }).observe(keyboard);
  motionToggle.addEventListener('click', () => { manuallyPaused = !manuallyPaused; updateMotion(); });
  reducedMotion.addEventListener('change', updateMotion);
  document.addEventListener('visibilitychange', updateMotion);
  updateMotion();

  // Check the numbered files once on load. Only available photographs appear.
  // Six clearly labeled placeholders let the initial layout be reviewed.
  const gallery = document.getElementById('gallery');
  function showPlaceholders() {
    for (let index = 0; index < 6; index++) {
      const placeholder = document.createElement('div');
      placeholder.className = `gallery-item photo-placeholder${[1,2,5].includes(index) ? ' tall' : ''}`;
      const number = document.createElement('span');
      number.className = 'placeholder-number';
      number.textContent = String(index + 1).padStart(2, '0');
      const label = document.createElement('span');
      label.className = 'placeholder-label';
      label.textContent = 'Photo placeholder';
      placeholder.append(number, label);
      gallery.append(placeholder);
    }
  }
  showPlaceholders();
  const viewer = document.getElementById('photo-viewer');
  const viewerImage = document.getElementById('viewer-image');
  const viewerCaption = document.getElementById('viewer-caption');
  const viewerCount = document.getElementById('viewer-count');
  const previous = document.getElementById('viewer-prev');
  const next = document.getElementById('viewer-next');
  let photographs = [];
  let selectedPhoto = 0;
  let opener;
  function displayPhoto(index) {
    selectedPhoto = (index + photographs.length) % photographs.length;
    const photo = photographs[selectedPhoto];
    viewerImage.src = photo.src;
    viewerImage.alt = photo.alt || photo.caption || `Photograph ${selectedPhoto + 1}`;
    viewerCaption.textContent = photo.caption || photo.alt || `Photograph ${selectedPhoto + 1}`;
    viewerCount.textContent = `${selectedPhoto + 1} / ${photographs.length}`;
    previous.disabled = next.disabled = photographs.length < 2;
  }
  function openPhoto(index, button) {
    opener = button;
    displayPhoto(index);
    viewer.showModal();
    document.body.classList.add('viewer-open');
  }
  document.getElementById('viewer-close').addEventListener('click', () => viewer.close());
  viewer.addEventListener('close', () => {
    document.body.classList.remove('viewer-open');
    opener?.focus({ preventScroll: true });
  });
  viewer.addEventListener('click', event => {
    const bounds = viewer.getBoundingClientRect();
    if (event.target === viewer && (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom)) viewer.close();
  });
  previous.addEventListener('click', () => displayPhoto(selectedPhoto - 1));
  next.addEventListener('click', () => displayPhoto(selectedPhoto + 1));
  viewer.addEventListener('keydown', event => {
    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
      event.preventDefault();
      displayPhoto(selectedPhoto + (event.key === 'ArrowLeft' ? -1 : 1));
    }
  });
  Promise.all(window.siteContent.gallery.filter(photo => photo.src).map(photo => new Promise(resolve => {
    const image = new Image();
    image.onload = () => resolve({ ...photo, image });
    image.onerror = () => resolve(null);
    image.src = photo.src;
  }))).then(results => {
    photographs = results.filter(Boolean);
    if (!photographs.length) return;
    gallery.replaceChildren();
    const figures = photographs.map((photo, index) => {
      const figure = document.createElement('figure');
      figure.className = 'gallery-item';
      figure.style.setProperty('--photo-ratio', photo.image.naturalWidth / photo.image.naturalHeight);
      const button = document.createElement('button');
      button.type = 'button';
      button.setAttribute('aria-label', `Enlarge ${photo.alt || photo.caption || `photograph ${index + 1}`}`);
      photo.image.alt = photo.alt || photo.caption || `Photograph ${index + 1}`;
      photo.image.width = photo.image.naturalWidth;
      photo.image.height = photo.image.naturalHeight;
      button.append(photo.image);
      button.addEventListener('click', () => openPhoto(index, button));
      figure.append(button);
      if (photo.caption) {
        const caption = document.createElement('figcaption');
        caption.textContent = photo.caption;
        figure.append(caption);
      }
      return figure;
    });
    // Equal-height rows preserve every photo's full composition. On phones,
    // regroup the same figures into pairs; viewer order follows reading order.
    const phoneLayout = matchMedia('(max-width: 700px)');
    function arrangeRows() {
      const perRow = phoneLayout.matches ? 2 : 3;
      const rows = [];
      for (let index = 0; index < figures.length; index += perRow) {
        const row = document.createElement('div');
        row.className = 'gallery-row';
        row.append(...figures.slice(index, index + perRow));
        rows.push(row);
      }
      gallery.classList.add('gallery-loaded');
      gallery.replaceChildren(...rows);
    }
    phoneLayout.addEventListener('change', arrangeRows);
    arrangeRows();
  });
})();
