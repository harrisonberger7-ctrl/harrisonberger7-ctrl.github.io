# Harrison Berger — Portfolio (GitHub Pages)

This repository is scaffolded as a user site (harrisonberger7-ctrl.github.io) and is intended to be published via GitHub Pages from the main branch.

What I added
- A complete, editable site scaffold using HTML, CSS, and vanilla JavaScript.
- Pages: index.html, about.html, projects (machining, engineering, buckeye), and assets (CSS/JS/images).
- A simple JSON-based project data file at data/projects.json so you can add projects by editing structured data.
- Placeholder SVG images and a placeholder resume file (replace with your real resume PDF named `placeholder-resume.pdf` or update the link in the pages).
- README with setup and editing instructions (this file).

Quick start — publish the site
1. Go to the repository Settings &gt; Pages.
2. Under "Build and Deployment" choose "Deploy from a branch" (if not already). Select the `main` branch and root (/).
3. Save — GitHub Pages will build and serve the site at https://harrisonberger7-ctrl.github.io/

Editing instructions — overview
- Replace placeholder images in `assets/images/` with your finished-part photographs, CAD renderings, toolpath images, and a professional headshot. Keep filenames or update references in the HTML/JSON.
- Update `data/projects.json` to add or edit projects. Each project object supports fields used by the site (id, category, title, summary, material, processes, equipment, tolerances, role, images, notes).
- Replace `resume/placeholder-resume.pdf` with your real résumé file (same filename recommended).
- Edit `about.html` to update education, timeline, and experience details. The HTML is simple and commented for easy changes.

How to add a new project (JSON method)
1. Open `data/projects.json` and add a new object to the `projects` array. Example:

  {
    "id": "mach-003",
    "category": "machining",
    "title": "New Project Title",
    "summary": "Short description...",
    "material": "6061-T6 Aluminum",
    "processes": "Milling, finishing",
    "equipment": "HAAS VF-2",
    "tolerances": "+/- 0.005 in",
    "role": "CAM, machine work",
    "images": ["/assets/images/your-photo.jpg"],
    "notes": "Any notes or reminders"
  }

2. Commit the change. The site will show the new project automatically.

Replacing images and résumé
- Replace files in `assets/images/` with your images. For best results, use high-resolution photos (1600px+ wide) for hero images and 1200px for project photos.
- Replace `resume/placeholder-resume.pdf` with your résumé. If you upload a PDF with a different filename, update links in `index.html` and `about.html`.

Accessibility and privacy reminders
- Alt text: When adding images, include descriptive alt text. The site uses placeholders with alt attributes — replace them with accurate descriptions.
- Privacy: Remove identifying or proprietary information from drawings, part numbers, customer info, test data, or workplace-controlled documentation before publishing.

Contact form
- The template uses a mailto fallback. To add a contact form, consider Formspree, Netlify Forms, or a serverless function. See Formspree docs for simple integration.

Further customization ideas
- Replace the JSON + JS approach with a static-site generator (Jekyll, Eleventy) if you prefer templating and collections.
- Add project pages per project by creating new HTML or markdown files and linking them in the JSON.

If you want, I can now:
- Push updates (images or alternate copy) on your behalf.
- Convert the project entries to per-project pages (HTML) rather than modal dialogs.
- Hook up a contact form provider (Formspree) and wire a simple form.

