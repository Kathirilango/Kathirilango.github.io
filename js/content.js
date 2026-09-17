// Apply content before the original interactions initialize.
(() => {
  const content = window.siteContent;
  document.querySelectorAll('[data-content]').forEach(element => {
    const key = element.dataset.content;
    if (Object.prototype.hasOwnProperty.call(content.text, key)) {
      element.textContent = content.text[key];
    }
  });
  document.querySelectorAll('[data-link]').forEach(element => {
    element.href = content.links[element.dataset.link];
  });
  document.querySelectorAll('[data-portrait]').forEach(element => {
    element.src = content.portraits[Number(element.dataset.portrait)];
  });
  document.querySelectorAll('[data-email]').forEach(element => {
    element.setAttribute('data-content', content.email);
  });
})();
