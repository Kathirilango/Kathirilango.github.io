# Kathir Ilango

Personal website at www.kathirilango.com, hosted on GitHub Pages. Plain HTML, CSS, and JavaScript. No framework, package installation, external script libraries, or build step.

## Edit text and links

Open **content.js**. All personal copy, jobs, contact links, portrait paths, and gallery entries live here. Keep quotation marks and commas intact. Use plain text, not HTML. The reviewed site copy is stored here.

- `intro`: your main heading.
- `text`: biography, section introductions, captions, and footer copy.
- `links` / `email`: contact destinations.
- `portraits` / `portraitAlt`: About portrait first, hiking photo second, with image descriptions.
- `jobs`: one object per company, in tab order. Keep every `id` unique and use lowercase letters and hyphens. Each company has a `positions` list, newest first; each position has `role`, `period`, `description`, and `note`. Add another position by copying an entry inside that company’s list.
- `note`: the optional italic personal anecdote under a position. Edit the note in your own words, or set it to `""` to hide it. Workato’s existing note is preserved.
- `gallery`: image paths, descriptions (`alt`), and optional captions. Array order is gallery order, left-to-right across aligned rows (three photos per row on desktop, two on phones).

Structure lives in **index.html**, appearance in **styles.css**, content rendering in **js/content.js**, and interactions in **js/main.js**. The keyboard retains the original hand-built key arrangement; its animation now uses browser-native APIs. The opening landscape is an original vector illustration in **assets/ridgelines.svg**. The name types once per page load without shifting the layout; reduced-motion visitors see it immediately.

## Add your favorite photographs

1. Put actual JPEG files in **assets/gallery/** named **01.jpg** through **09.jpg** (lowercase).
2. Refresh the page. Photos appear individually as they load; missing slots are hidden.
3. Add a short description to each photograph's `alt` in **content.js**. A caption is optional and appears only in the enlarged photo viewer; the gallery stays image-only.

You can use another filename or format by changing `src` in the matching gallery entry. Don't rename a HEIC file to `.jpg`; export it as JPEG first. Original image proportions are preserved. Aim for roughly 2000 pixels on the long edge and under 1 MB per image. The current gallery copies are optimized at 2000 pixels, and the two portraits at 1200 pixels. Originals remain in Documents/candidates and in the checkpoint 2 commit. Replacing a cached photo may require a hard refresh.

The `width` and `height` values in gallery entries reserve the right amount of space before images arrive. When replacing a photo, update these if convenient; its actual proportions are corrected automatically when it loads. Slots 07–09 are optional and checked when visitors approach the gallery, so absent files may appear as expected 404s in developer tools. You can remove unused entries if you prefer.

The `?v=3` suffix on current image paths refreshes previously cached copies; it is not part of the filename. Change the version when publishing a replacement if you want returning visitors to get it immediately.

Click any photo to enlarge it. Escape closes the viewer, and arrow keys move between images. Job tabs also support arrow keys. The keyboard animation pauses when offscreen or when the page is hidden, respects reduced-motion settings, and has a manual pause button.

## Local preview

From this repository folder:

```sh
python3 -m http.server 8000 --bind 127.0.0.1
```

Open http://localhost:8000 and refresh after saving files. Stop the server with Control-C. Opening index.html directly also works: there are no fetched JSON files or module imports. JavaScript is required for the editable text, gallery, and job tabs.

Local CSS and script URLs include a version query to avoid stale files during the redesign. If a browser shows older content, use a hard refresh (Command-Shift-R on Mac).

## Review checkpoints

1. **Content separation:** reviewed and committed. Original appearance preserved while editable content was extracted.
2. **Layout:** draft personal introduction, compact favorites gallery, streamlined career tabs, original keyboard, responsive layout. Review overall character, section order, spacing, and phone usability.
3. **Polish:** optimized all eight photographs from 17.4 MB to 4.2 MB, added independent lazy gallery loading with reserved dimensions, and checked responsive layout and keyboard interactions in the Codex browser. Final review and commit remain with Kathir.

For feedback, name the section, describe what feels wrong and the desired result, and mention the browser or screen size. Screenshots help with layout issues. Review and commit each checkpoint before starting the next if you want three separate commits. All commits, merges, and pushes remain under your control.
