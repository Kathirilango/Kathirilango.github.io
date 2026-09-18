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
      const keys = [...keyboard.querySelectorAll('.key')];
      const movementDuration = 20000;
      const stagger = 100;
      const restDuration = 1000;
      // Every key shares one cycle. Earlier keys wait for the last key to
      // return, then the whole keyboard rests for one second before repeating.
      const cycleDuration = movementDuration + (keys.length - 1) * stagger + restDuration;
      animations = keys.map((key, index) => {
        const start = index * stagger / cycleDuration;
        const middle = (index * stagger + movementDuration / 2) / cycleDuration;
        const end = (index * stagger + movementDuration) / cycleDuration;
        const frames = [{ transform: 'translateY(0) rotate(0deg)', offset: 0 }];
        if (start > 0) frames.push({ transform: 'translateY(0) rotate(0deg)', offset: start });
        frames[frames.length - 1].easing = 'ease-in-out';
        frames.push(
          { transform: 'translateY(42px) rotate(360deg)', offset: middle, easing: 'ease-in-out' },
          { transform: 'translateY(0) rotate(720deg)', offset: end },
          { transform: 'translateY(0) rotate(720deg)', offset: 1 }
        );
        const animation = key.animate(frames, { duration: cycleDuration, iterations: Infinity });
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

  // Reserve known photo dimensions immediately and let each image load on its
  // own. Optional numbered slots are checked only near the gallery.
  const gallery = document.getElementById('gallery');
  const viewer = document.getElementById('photo-viewer');
  const viewerImage = document.getElementById('viewer-image');
  const viewerCaption = document.getElementById('viewer-caption');
  const viewerCount = document.getElementById('viewer-count');
  const previous = document.getElementById('viewer-prev');
  const next = document.getElementById('viewer-next');
  const phoneLayout = matchMedia('(max-width: 700px)');
  const photographs = window.siteContent.gallery.filter(photo => photo.src).map(photo => ({
    ...photo, loaded: false, failed: false, knownSize: photo.width > 0 && photo.height > 0
  }));
  let selectedPhoto;
  let opener;
  const availablePhotos = () => photographs.filter(photo => photo.loaded && !photo.failed);

  function updateViewerControls() {
    const available = availablePhotos();
    viewerCount.textContent = `${available.indexOf(selectedPhoto) + 1} / ${available.length}`;
    previous.disabled = next.disabled = available.length < 2;
  }
  function displayPhoto(photo) {
    selectedPhoto = photo;
    viewerImage.src = photo.src;
    viewerImage.alt = photo.image.alt;
    viewerCaption.textContent = photo.caption || photo.image.alt;
    updateViewerControls();
  }
  function navigatePhoto(direction) {
    const available = availablePhotos();
    if (!available.length) return;
    const index = (available.indexOf(selectedPhoto) + direction + available.length) % available.length;
    displayPhoto(available[index]);
  }
  function openPhoto(photo, button) {
    if (!photo.loaded) return;
    opener = button;
    displayPhoto(photo);
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
  previous.addEventListener('click', () => navigatePhoto(-1));
  next.addEventListener('click', () => navigatePhoto(1));
  viewer.addEventListener('keydown', event => {
    if (event.key === 'Tab') {
      const controls = [...viewer.querySelectorAll('button:not([disabled])')];
      const first = controls[0];
      const last = controls[controls.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }
    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
      event.preventDefault();
      navigatePhoto(event.key === 'ArrowLeft' ? -1 : 1);
    }
  });

  function arrangeRows() {
    const focused = document.activeElement;
    const figures = photographs.filter(photo => !photo.failed && (photo.knownSize || photo.loaded)).map(photo => photo.figure);
    const perRow = phoneLayout.matches ? 2 : 3;
    const rows = [];
    for (let index = 0; index < figures.length; index += perRow) {
      const row = document.createElement('div');
      row.className = 'gallery-row';
      row.append(...figures.slice(index, index + perRow));
      rows.push(row);
    }
    gallery.replaceChildren(...rows);
    if (!rows.length && photographs.every(photo => photo.failed)) {
      const empty = document.createElement('p');
      empty.textContent = 'Photos are unavailable right now. You can find more on Instagram.';
      gallery.append(empty);
    }
    if (focused?.matches('#gallery button') && focused.isConnected && !viewer.open) focused.focus({ preventScroll: true });
  }

  photographs.forEach((photo, index) => {
    const figure = document.createElement('figure');
    figure.className = 'gallery-item is-loading';
    const button = document.createElement('button');
    button.type = 'button';
    button.disabled = true;
    button.setAttribute('aria-label', `Enlarge ${photo.alt || photo.caption || `photograph ${index + 1}`}`);
    const image = new Image();
    image.alt = photo.alt || photo.caption || `Photograph ${index + 1}`;
    image.decoding = 'async';
    if (photo.knownSize) {
      image.width = photo.width;
      image.height = photo.height;
      image.loading = 'lazy';
      figure.style.setProperty('--photo-ratio', photo.width / photo.height);
    }
    photo.figure = figure;
    photo.image = image;
    button.append(image);
    button.addEventListener('click', () => openPhoto(photo, button));
    figure.append(button);
    image.onload = () => {
      photo.loaded = true;
      image.width = image.naturalWidth;
      image.height = image.naturalHeight;
      figure.style.setProperty('--photo-ratio', image.naturalWidth / image.naturalHeight);
      figure.classList.remove('is-loading');
      button.disabled = false;
      // Known slots are already laid out: no rebuild, flicker, or focus loss.
      if (!photo.knownSize) arrangeRows();
      if (viewer.open) updateViewerControls();
    };
    image.onerror = () => {
      photo.failed = true;
      arrangeRows();
    };
  });
  gallery.classList.add('gallery-loaded');
  arrangeRows();
  photographs.filter(photo => photo.knownSize).forEach(photo => { photo.image.src = photo.src; });
  const optionalSlots = photographs.filter(photo => !photo.knownSize);
  if (optionalSlots.length) {
    const optionalObserver = new IntersectionObserver(entries => {
      if (!entries.some(entry => entry.isIntersecting)) return;
      optionalObserver.disconnect();
      optionalSlots.forEach(photo => { photo.image.src = photo.src; });
    }, { rootMargin: '300px' });
    optionalObserver.observe(gallery);
  }
  phoneLayout.addEventListener('change', arrangeRows);
})();
