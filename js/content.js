// Content stays separate from the layout. User-editable strings are plain text.
(() => {
  const content = window.siteContent;
  document.getElementById('intro').textContent = content.intro;
  document.querySelectorAll('[data-content]').forEach(element => {
    const value = content.text[element.dataset.content];
    if (typeof value === 'string') element.textContent = value;
  });
  document.querySelectorAll('[data-link]').forEach(element => {
    element.href = content.links[element.dataset.link];
  });
  document.querySelectorAll('[data-portrait]').forEach(element => {
    const index = Number(element.dataset.portrait);
    element.src = content.portraits[index];
    element.alt = content.portraitAlt[index];
  });
  document.querySelectorAll('[data-email]').forEach(element => {
    element.href = `mailto:${content.email}`;
  });

  const tabs = document.getElementById('job-tabs');
  const panels = document.getElementById('job-panels');
  content.jobs.forEach((job, index) => {
    const tab = document.createElement('button');
    tab.type = 'button';
    tab.id = `tab-${job.id}`;
    tab.setAttribute('role', 'tab');
    tab.setAttribute('aria-controls', `job-${job.id}`);
    tab.setAttribute('aria-selected', String(index === 0));
    tab.tabIndex = index === 0 ? 0 : -1;
    tab.textContent = job.company;
    tabs.append(tab);

    const panel = document.createElement('div');
    panel.className = 'job-panel';
    panel.id = `job-${job.id}`;
    panel.setAttribute('role', 'tabpanel');
    panel.setAttribute('aria-labelledby', tab.id);
    panel.tabIndex = 0;
    panel.hidden = index !== 0;
    const heading = document.createElement('h3');
    heading.textContent = job.company;
    panel.append(heading);
    job.positions.forEach(position => {
      const entry = document.createElement('section');
      entry.className = 'job-position';
      const meta = document.createElement('div');
      meta.className = 'job-meta';
      const role = document.createElement('h4');
      role.textContent = position.role;
      const period = document.createElement('span');
      period.className = 'job-period';
      period.textContent = position.period;
      meta.append(role, period);
      const description = document.createElement('p');
      description.textContent = position.description;
      entry.append(meta, description);
      if (position.note && position.note.trim()) {
        const note = document.createElement('p');
        note.className = 'job-note';
        note.textContent = position.note;
        entry.append(note);
      }
      panel.append(entry);
    });
    panels.append(panel);
  });
})();
