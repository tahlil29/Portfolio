"""Generate resume/Tahlil_Shaikh_Resume.pdf aligned with the live portfolio."""
from pathlib import Path

from fpdf import FPDF

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "resume" / "Tahlil_Shaikh_Resume.pdf"


class ResumePDF(FPDF):
    def footer(self):
        self.set_y(-11)
        self.set_font("Helvetica", "", 8)
        self.set_text_color(120, 113, 108)
        self.cell(0, 8, f"Page {self.page_no()} | Tahlil Ullah Shaikh", align="C")


def reset_x(pdf: FPDF):
    pdf.set_x(pdf.l_margin)


def section(pdf: ResumePDF, title: str):
    pdf.ln(2.5)
    reset_x(pdf)
    pdf.set_font("Helvetica", "B", 10.5)
    pdf.set_text_color(28, 25, 23)
    pdf.cell(0, 6, title.upper(), new_x="LMARGIN", new_y="NEXT")
    pdf.set_draw_color(125, 143, 111)
    pdf.set_line_width(0.35)
    y = pdf.get_y()
    pdf.line(pdf.l_margin, y, pdf.w - pdf.r_margin, y)
    pdf.ln(2)


def job(pdf: ResumePDF, role: str, company: str, dates: str):
    reset_x(pdf)
    pdf.set_font("Helvetica", "B", 9.5)
    pdf.set_text_color(28, 25, 23)
    pdf.cell(0, 4.5, role, new_x="LMARGIN", new_y="NEXT")
    reset_x(pdf)
    pdf.set_font("Helvetica", "", 8.5)
    pdf.set_text_color(68, 64, 60)
    pdf.cell(0, 4.2, f"{company}  |  {dates}", new_x="LMARGIN", new_y="NEXT")


def bullets(pdf: ResumePDF, items: list[str]):
    pdf.set_font("Helvetica", "", 8.5)
    pdf.set_text_color(68, 64, 60)
    for item in items:
        reset_x(pdf)
        pdf.multi_cell(0, 4, f"- {item}", new_x="LMARGIN", new_y="NEXT")


def body(pdf: ResumePDF, text: str):
    reset_x(pdf)
    pdf.set_font("Helvetica", "", 8.5)
    pdf.set_text_color(68, 64, 60)
    pdf.multi_cell(0, 4, text, new_x="LMARGIN", new_y="NEXT")


def project(pdf: ResumePDF, title: str, blurb: str):
    reset_x(pdf)
    pdf.set_font("Helvetica", "B", 8.5)
    pdf.set_text_color(28, 25, 23)
    pdf.cell(0, 4.2, title, new_x="LMARGIN", new_y="NEXT")
    body(pdf, blurb)


def main():
    OUT.parent.mkdir(parents=True, exist_ok=True)
    pdf = ResumePDF(format="Letter")
    pdf.set_auto_page_break(auto=True, margin=16)
    pdf.add_page()
    pdf.set_margins(15, 12, 15)
    pdf.set_y(12)

    pdf.set_font("Helvetica", "B", 17)
    pdf.set_text_color(28, 25, 23)
    pdf.cell(0, 7.5, "TAHLIL ULLAH SHAIKH", new_x="LMARGIN", new_y="NEXT")
    pdf.set_font("Helvetica", "", 8.5)
    pdf.set_text_color(120, 113, 108)
    body(
        pdf,
        "Udaipur, Rajasthan  |  tahlil.shaikh2004@gmail.com  |  7023968871\n"
        "Product Manager Intern  |  Python Developer  |  Visual Designer\n"
        "portfolio-x8op.onrender.com  |  github.com/tahlil29  |  linkedin.com/in/tahlil-shaikh-223993268",
    )

    section(pdf, "Professional Summary")
    body(
        pdf,
        "Product Manager Intern at ToBa Tech Solutions supporting AI Agents & Workflow "
        "Automation releases for the US market. Bridges product planning, engineering, and "
        "design - writing requirement notes and acceptance criteria, prioritizing sprint goals, "
        "and shipping live Python products that recruiters can click.",
    )

    section(pdf, "Work Experience")
    job(pdf, "Product Manager Intern", "ToBa Tech Solutions, Udaipur", "April 2026 - Present")
    bullets(
        pdf,
        [
            "Support planning and prioritization for AI Agents & Workflow Automation releases (US market).",
            "Write requirement notes, workflow docs, and sprint-ready acceptance criteria.",
            "Coordinate with engineering, design, and QA to track delivery and clarify done criteria.",
            "Use a CS / Python background to write buildable tickets and catch gaps early.",
        ],
    )
    pdf.ln(1)
    job(pdf, "Graphic Designer Intern", "Websenor", "Jan 2025 - Mar 2026")
    bullets(
        pdf,
        [
            "Built brand-consistent logos, banners, posters, and social creatives for digital and print.",
            "Delivered under campaign deadlines while keeping visuals aligned to brand guidelines.",
        ],
    )
    pdf.ln(1)
    job(pdf, "Web Content Writer Intern", "InAmigos Foundation", "February 2023")
    bullets(
        pdf,
        ["Wrote and edited web content and documentation to support foundation outreach."],
    )
    pdf.ln(1)
    job(
        pdf,
        "Non-Technical Member",
        "Google Developer Group (GDG) - Institute for Plasma Research",
        "2024",
    )
    bullets(
        pdf,
        ["Supported event coordination and community engagement for the developer group."],
    )

    section(pdf, "Featured Projects")
    project(
        pdf,
        "ByteMind News  |  Python, Flask  |  bytemind-news.onrender.com",
        "AI news aggregator with search and categories. Product MVP: fast scan + categories, not a heavy social feed.",
    )
    project(
        pdf,
        "Online Voting System  |  Python, Flask, SQLite  |  voting-site-1.onrender.com",
        "Digital voting with candidate listing and live results. Product choice: persistent, auditable results.",
    )
    project(
        pdf,
        "Flowera - Online Flower Shop  |  HTML, CSS, JavaScript  |  flowera.onrender.com",
        "Shopping-style storefront focused on clear browsing. MVP: collections first, not payments.",
    )
    project(
        pdf,
        "Personal Portfolio  |  HTML, CSS, JavaScript  |  portfolio-x8op.onrender.com",
        "Notice-board portfolio with case studies, dark mode, and resume download.",
    )

    section(pdf, "Education")
    reset_x(pdf)
    pdf.set_font("Helvetica", "B", 8.5)
    pdf.set_text_color(28, 25, 23)
    pdf.cell(0, 4.2, "B.Tech, Computer Science Engineering", new_x="LMARGIN", new_y="NEXT")
    body(
        pdf,
        "Geetanjali Institute of Technical Studies  |  Currently pursuing  |  CGPA: 7.63/10\n"
        "Class XII (CBSE) - A-One Sr. Sec. School, 2023 - 60.61%\n"
        "Class X (CBSE) - St. Teresa Sr. Sec. School, Udaipur, 2021 - 55.00%",
    )

    section(pdf, "Skills")
    body(
        pdf,
        "Product: Jira, Leantime, Notion, Slack, GitHub Projects, user stories, acceptance criteria, sprint planning\n"
        "Technical: Python, Flask, HTML, CSS, JavaScript, GitHub, Firebase, SQLite\n"
        "Design: Figma, Canva, branding, social media design",
    )

    section(pdf, "Certifications & Achievements")
    bullets(
        pdf,
        [
            "Prompt Design in Vertex AI - Skill Badge, Google Cloud",
            "Google GenAI Study Jams - Generative AI and Google Cloud Computing Foundations",
            "Digital Productivity with AI - Passport to Earning (P2E) Skills",
            "NPTEL: Database Management System - 56%, IIT Kharagpur",
            "NPTEL: Fundamentals of Object Oriented Programming - 77%, IIT Roorkee",
            "Presented at the 4th International Conference on Multi-Disciplinary Application & Research Technologies",
        ],
    )

    pdf.output(str(OUT))
    print(f"Wrote {OUT} ({OUT.stat().st_size} bytes)")


if __name__ == "__main__":
    main()
