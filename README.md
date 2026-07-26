# Personal Portfolio Website

Personal developer portfolio for **Tahlil Ullah Shaikh** — Product Manager Intern, Python Developer, and Graphic Designer.

**Live site:** https://portfolio-x8op.onrender.com/

## Features

- Responsive modern layout with dark mode toggle
- Hero “currently working on” banner + resume download
- Education, skills (tags + proficiency bars), certifications
- Work experience (ToBa Tech + Websenor)
- Featured projects, case studies, blog teasers, testimonials
- Live GitHub repos via GitHub API
- Contact form + fixed social links
- Printable resume page (`resume.html`)

## Local preview

```bash
python -m http.server 8080
```

Open http://localhost:8080

## Custom domain (optional)

1. Buy a domain (e.g. `tahlilshaikh.dev`)
2. In Render → your static site → **Custom Domains**, add the domain
3. Point DNS:
   - `A` / `CNAME` records as Render instructs
4. Update Open Graph URLs in `index.html` to the new domain

## Google Analytics (optional)

1. Create a GA4 property at https://analytics.google.com
2. In `index.html`, uncomment the Analytics script block in `<head>`
3. Replace `G-XXXXXXXXXX` with your Measurement ID

## Resume PDF

1. Open `/resume.html`
2. Print → Save as PDF
3. Optionally save as `resume/Tahlil_Shaikh_Resume.pdf` and link that file from the hero CTA

## Tech stack

HTML · CSS · JavaScript · Font Awesome · Google Fonts · FormSubmit · GitHub API · Render

## Author

**Tahlil Ullah Shaikh**  
B.Tech Computer Science Engineering  
GitHub: https://github.com/tahlil29
