import os
from fpdf import FPDF

class ResumePDF(FPDF):
    def draw_layout(self):
        # A4 page dimensions are 210mm x 297mm
        # Draw background (#0F172A)
        self.set_fill_color(15, 23, 42)
        self.rect(0, 0, 210, 297, "F")
        
        # Draw sidebar background (#0A0F1D)
        self.set_fill_color(10, 15, 29)
        self.rect(0, 0, 70, 297, "F")

def generate():
    pdf = ResumePDF(orientation="P", unit="mm", format="A4")
    pdf.add_page()
    pdf.set_auto_page_break(auto=False)
    pdf.draw_layout()
    
    # 1. Draw Profile Image with border
    pdf.image("assets/profile.jpg", x=22, y=12, w=26)
    pdf.set_draw_color(0, 200, 150) # #00C896
    pdf.set_line_width(0.5)
    pdf.rect(22, 12, 26, 32.5, "D")
    
    # Name & Title
    pdf.set_text_color(255, 255, 255)
    pdf.set_font("helvetica", "B", 11)
    pdf.text(15, 47, "Abdelrahman Salah")
    
    pdf.set_text_color(0, 200, 150)
    pdf.set_font("courier", "B", 8)
    pdf.text(14, 52, "FLUTTER DEVELOPER")
    
    # Sidebar Section builder
    y = 64
    def add_sidebar_section(title, items):
        nonlocal y
        pdf.set_draw_color(34, 211, 238) # #22D3EE Accent
        pdf.set_line_width(0.5)
        pdf.line(8, y, 62, y)
        
        pdf.set_text_color(255, 255, 255)
        pdf.set_font("helvetica", "B", 8)
        pdf.text(8, y - 2, title.upper())
        
        y += 5
        for label, val in items:
            pdf.set_text_color(255, 255, 255)
            pdf.set_font("helvetica", "B", 7)
            pdf.text(8, y, label.upper())
            y += 3.5
            
            pdf.set_text_color(148, 163, 184) # #94A3B8 Slate
            pdf.set_font("helvetica", "", 7.5)
            
            # Wrap values that are long
            if len(val) > 34:
                pdf.set_xy(8, y - 1)
                pdf.multi_cell(54, 3, val)
                y += 6.5
            else:
                pdf.text(8, y, val)
                y += 4.5
        y += 3
        
    add_sidebar_section("Contact", [
        ("Location", "Zagazig, Egypt"),
        ("Email", "abdosalah112233444@gmail.com"),
        ("Phone", "+20 1024713596"),
        ("GitHub", "github.com/Abdosalah4"),
        ("LinkedIn", "linkedin.com/in/abdelrahman-salah-829b8325a"),
        ("Kafiil", "kafiil.com/u/abdo_salah7"),
        ("Nafezly", "nafezly.com/u/abdo_salah_")
    ])
    
    # Core Skills on Sidebar
    skills = ["Flutter", "Dart", "Cubit", "MVVM", "Clean Arch", "REST APIs", "Dio", "Firebase", "Git & GitHub", "Material Design", "Responsive UI", "Local Alerts"]
    
    pdf.set_draw_color(34, 211, 238)
    pdf.line(8, y, 62, y)
    pdf.set_text_color(255, 255, 255)
    pdf.set_font("helvetica", "B", 8)
    pdf.text(8, y - 2, "CORE SKILLS")
    y += 4
    
    pdf.set_text_color(148, 163, 184)
    pdf.set_font("helvetica", "", 7.5)
    
    # Render two columns of skills
    col1 = skills[:6]
    col2 = skills[6:]
    sy = y
    for s in col1:
        pdf.text(8, y, "- " + s)
        y += 4
    
    y = sy
    for s in col2:
        pdf.text(36, y, "- " + s)
        y += 4
    
    y += 6
    
    # Education Box
    pdf.set_draw_color(34, 211, 238)
    pdf.line(8, y, 62, y)
    pdf.set_text_color(255, 255, 255)
    pdf.set_font("helvetica", "B", 8)
    pdf.text(8, y - 2, "EDUCATION")
    y += 5
    
    pdf.set_text_color(255, 255, 255)
    pdf.set_font("helvetica", "B", 7.5)
    pdf.text(8, y, "B.Sc. Computers & Information")
    y += 4
    pdf.set_text_color(148, 163, 184)
    pdf.set_font("helvetica", "", 7.5)
    pdf.text(8, y, "Zagazig University")
    y += 4
    pdf.text(8, y, "2022 - 2026")
    
    # --- MAIN CONTENT COLUMN (x=76) ---
    # Header Info
    pdf.set_text_color(255, 255, 255)
    pdf.set_font("helvetica", "B", 18)
    pdf.text(76, 20, "Abdelrahman Mohamed Salah")
    pdf.set_text_color(0, 200, 150)
    pdf.set_font("courier", "B", 11)
    pdf.text(76, 26, "FLUTTER DEVELOPER")
    
    my = 34
    def add_main_section(title):
        nonlocal my
        pdf.set_draw_color(255, 255, 255)
        pdf.set_line_width(0.1)
        pdf.line(76, my, 202, my)
        
        pdf.set_text_color(255, 255, 255)
        pdf.set_font("helvetica", "B", 10)
        pdf.text(76, my - 2, title.upper())
        my += 5
        
    add_main_section("Summary")
    pdf.set_text_color(148, 163, 184)
    pdf.set_font("helvetica", "", 8.5)
    pdf.set_xy(76, my - 2)
    summary_text = (
        "Dedicated and results-oriented Flutter Developer with practical experience in building clean, "
        "responsive, and high-performance cross-platform mobile applications. Specialized in structuring clean "
        "architectures (MVVM, Clean Architecture) and reactive state management (Cubit). Experienced in "
        "integrating third-party REST APIs and Google Firebase services. Adaptable team player comfortable "
        "working inside collaborative sprints or delivering standalone freelance solutions."
    )
    pdf.multi_cell(126, 4, summary_text)
    my += 24
    
    add_main_section("Experience")
    
    # Experience 1: Graduation Project
    pdf.set_text_color(255, 255, 255)
    pdf.set_font("helvetica", "B", 9)
    pdf.text(76, my, "Graduation Project -- MediMate")
    pdf.set_text_color(0, 200, 150)
    pdf.set_font("courier", "B", 8)
    pdf.text(194, my, "2026")
    my += 4
    pdf.set_text_color(34, 211, 238)
    pdf.set_font("helvetica", "I", 8)
    pdf.text(76, my, "Lead Flutter Developer | Firebase")
    my += 4
    pdf.set_text_color(148, 163, 184)
    pdf.set_font("helvetica", "", 8)
    pdf.set_xy(76, my - 1)
    exp1_text = (
        "Developed MediMate, a smart medication management application featuring scheduled alarms with local "
        "offline notifications, Firebase Cloud Firestore/Auth integration, family profiles, inventory tracking, "
        "and clean MVVM & Cubit architecture."
    )
    pdf.multi_cell(126, 3.8, exp1_text)
    my += 16
    
    # Experience 2: NTI Program
    pdf.set_text_color(255, 255, 255)
    pdf.set_font("helvetica", "B", 9)
    pdf.text(76, my, "Flutter Mobile App Development Program (120 Hours)")
    pdf.set_text_color(0, 200, 150)
    pdf.set_font("courier", "B", 8)
    pdf.text(194, my, "2026")
    my += 4
    pdf.set_text_color(34, 211, 238)
    pdf.set_font("helvetica", "I", 8)
    pdf.text(76, my, "National Telecommunication Institute (NTI)")
    my += 4
    pdf.set_text_color(148, 163, 184)
    pdf.set_font("helvetica", "", 8)
    pdf.set_xy(76, my - 1)
    exp2_text = (
        "Completed intensive training focusing on Flutter/Dart, Firebase backend systems, REST APIs integration, "
        "Cubit state management, MVVM, Clean Architecture, Git/GitHub, and responsive UI development."
    )
    pdf.multi_cell(126, 3.8, exp2_text)
    my += 16
    
    # Experience 3: Personal Projects
    pdf.set_text_color(255, 255, 255)
    pdf.set_font("helvetica", "B", 9)
    pdf.text(76, my, "Personal Flutter Projects")
    pdf.set_text_color(0, 200, 150)
    pdf.set_font("courier", "B", 8)
    pdf.text(180, my, "2025 - PRESENT")
    my += 4
    pdf.set_text_color(34, 211, 238)
    pdf.set_font("helvetica", "I", 8)
    pdf.text(76, my, "Flutter Developer")
    my += 4
    pdf.set_text_color(148, 163, 184)
    pdf.set_font("helvetica", "", 8)
    pdf.set_xy(76, my - 1)
    exp3_text = (
        "Designed and built multiple mobile apps (MediMate, E-Commerce, Weather forecast clients, ToDo organizers) "
        "to master offline database caching, reactive state flows, API connections, and performance optimization."
    )
    pdf.multi_cell(126, 3.8, exp3_text)
    my += 16
    
    # Experience 4: Freelance Experience
    pdf.set_text_color(255, 255, 255)
    pdf.set_font("helvetica", "B", 9)
    pdf.text(76, my, "Freelance Experience")
    pdf.set_text_color(0, 200, 150)
    pdf.set_font("courier", "B", 8)
    pdf.text(194, my, "2026")
    my += 4
    pdf.set_text_color(34, 211, 238)
    pdf.set_font("helvetica", "I", 8)
    pdf.text(76, my, "Kafiil & Nafezly Platforms")
    my += 4
    pdf.set_text_color(148, 163, 184)
    pdf.set_font("helvetica", "", 8)
    pdf.set_xy(76, my - 1)
    exp4_text = (
        "Completed custom paid Flutter tasks for remote clients, including UI improvements, bug fixing, "
        "feature enhancements, responsive layout adjustments, and code maintenance."
    )
    pdf.multi_cell(126, 3.8, exp4_text)
    my += 16
    
    # Experience 5: Continuous Learning
    pdf.set_text_color(255, 255, 255)
    pdf.set_font("helvetica", "B", 9)
    pdf.text(76, my, "Continuous Learning")
    pdf.set_text_color(0, 200, 150)
    pdf.set_font("courier", "B", 8)
    pdf.text(180, my, "2024 - PRESENT")
    my += 4
    pdf.set_text_color(34, 211, 238)
    pdf.set_font("helvetica", "I", 8)
    pdf.text(76, my, "Flutter & Dart Ecosystems")
    my += 4
    pdf.set_text_color(148, 163, 184)
    pdf.set_font("helvetica", "", 8)
    pdf.set_xy(76, my - 1)
    exp5_text = (
        "Consistently upgrading technical skills through documentation research, articles, and courses "
        "covering mobile performance optimization, design patterns, and clean code."
    )
    pdf.multi_cell(126, 3.8, exp5_text)

    
    os.makedirs("assets", exist_ok=True)
    pdf.output("assets/resume.pdf")
    print("PDF Resume generated successfully at assets/resume.pdf")

if __name__ == "__main__":
    generate()
