# Visit: www.kathirilango.com

Source code for my personal website. Hosted on [GitHub Pages](https://pages.github.com). Built with Bootstrap 4. Text typing and card interaction done with JavaScript. Keyboard animation fully designed and written using Anime.js.

## Editing content

Edit **content.js** for the greeting, introduction, biography, experience, social links, email, portrait paths, and gallery settings. It is a plain JavaScript data file so it also works when opening index.html directly—no build step or framework required. Keep the quotation marks and commas intact. Text is displayed literally; don't add HTML tags.

The text keys identify the existing section and purpose (for example, stripe_paragraph_1 is Stripe's first paragraph). Older project descriptions remain in index.html until that section is removed in checkpoint 2.

Put favorite photographs in **assets/gallery/** as **01.jpg** through **09.jpg**. Gallery settings are prepared now; the gallery itself arrives with checkpoint 2. Unused image slots will be hidden. You can use other filenames by changing their src in content.js. Each image has an alt description and optional caption.

## Local preview

From this repository folder, run:

```sh
python3 -m http.server 8000 --bind 127.0.0.1
```

Open http://localhost:8000 and refresh after saving files. Stop the server with Control-C. Opening index.html directly also works; the current fonts, Bootstrap, icons, and animation library still require an internet connection.

## Review checkpoints

1. **Content separation:** existing appearance and keyboard preserved; editable content and gallery settings extracted. Check the greeting, biography, every job tab, social links, and email popover. Try changing one sentence in content.js and refresh.
2. **Layout:** review hierarchy, photography placement, overall character, and the refined career/keyboard section. Older projects are removed here.
3. **Polish:** review final photographs and wording, narrow screens, keyboard navigation, image viewer, and reduced motion.

For feedback, name the section, describe what feels wrong and the desired result, and mention the browser/screen size. Screenshots are useful for layout issues. Review and commit each checkpoint before starting the next if you want three separate commits. All commits, merges, and pushes remain under your control.
