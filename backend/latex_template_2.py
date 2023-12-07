def get_modules():
    return'''

% Document class and font size
\\documentclass[a4paper,9pt]{extarticle}

% Packages
\\usepackage[utf8]{inputenc}
\\usepackage{geometry}
\\geometry{a4paper, margin=0.75in}
\\usepackage{titlesec}
\\usepackage{enumitem}
\\usepackage{hyperref}

% Formatting
\\setlist{noitemsep} % Removes item separation
\\titleformat{\\section}{\\large\\bfseries}{\\thesection}{1em}{}[\\titlerule] % Section title format
\\titlespacing*{\\section}{0pt}{\\baselineskip}{\\baselineskip} % Section title spacing

%-------------------------------------------
%%%%%%  CV STARTS HERE  %%%%%%%%%%%%%%%%%%%%%%%%%%%%


\\begin{document}
\\pagestyle{empty}
'''


def heading(name, email, phone, linkedin, github):
    return '''
\\begin{center}
\\textbf{\\Large '''+ str(name) + '''}\\\\[2pt]
\\href{mailto:'''+str(email)+'''}{'''+str(email)+'''} | '''+str(phone)+''' | \\href{'''+str(linkedin)+'''}{'''+str(linkedin)+'''} | \\href{'''+str(github)+'''}{'''+str(github)+'''}
\\end{center}
'''

# Education
def education_start():
    return "\\section*{EDUCATION}\\noindent"


def education(university, location, degree, gpa, time_period, relevent_courses):
    return '''
    \\noindent
    \\textbf{'''+str(university)+'''}, '''+str(location)+''' \\hfill '''+str(time_period)+'''\\\\
    '''+str(degree)+''' \\hfill Overall GPA: '''+str(gpa)+''' \\\\
    Courses: '''+str(relevent_courses)+'''
    \\\\
    \\\\
    '''

def education_end():
    return '''
    \\vspace{-1cm}
    '''

# Skills


def skills_summary(languages="", tools="", framework=""):
    if len(languages) == 0 and tools == "" and framework == "":
        return ""
    s = '''
    \\section*{SKILLS}
	\\begin{itemize}
    '''
    if len(languages) > 0:
        s += '''\\item \\textbf{Languages: }'''+languages
    if len(tools) > 0:
        s += '''\\item \\textbf{Tools: }'''+tools
    if len(framework) > 0:
        s += '''\\item \\textbf{Frameworks: }'''+framework
    s += "\\end{itemize}"
    return s

# Experience


def experience_start():
    return "\\section*{Experience}"

def experience(company_name, location, role, time_period, items):
    s = '''
    \\noindent
    \\textbf{'''+company_name+'''} \\hfill '''+location+'''\\\\
    \\textit{{'''+role+'''} \\hfill '''+time_period+'''}
    \\begin{itemize}
    '''
    for item in items:
        if len(item) == 0:
            continue
        s += "\\item {"+item+"}"
    s += "\\end{itemize}"
    return s


def experience_end():
    return '''
    '''

# Project

def project_start():
    return "\\section*{PROJECTS}"

# TODO: Projects
def projects(project_name, time_period, role, github, items):
    s = '''
        \\noindent
        \\textbf{'''+project_name+'''}\\\\
        \\textit{Project Link:} \\url{'''+github+'''} \\hfill '''+time_period+'''
        \\begin{itemize}
        '''
    for item in items:
        if len(item) == 0:
            continue
        s += "\\item {" + item + "}"

    s += "\\end{itemize}"
    return s


def project_end():
    return '''
    '''


def end():
    return '''

    \\end{document}
    '''


def get_latex_text(heading_list, skills_list, educations_list, experience_list, projects_list):
    latex = get_modules()

    latex += heading(heading_list[0], heading_list[1],
                     heading_list[2], heading_list[3], heading_list[4])

    latex += education_start()
    for e in educations_list:
        latex += education(e['universityName'], e['location'], e['degree'], e['gpa'], f"{e['endDate']}", e['relevantCoursework'])
    latex += education_end()

    latex += skills_summary(skills_list[0], skills_list[1], skills_list[2])

    latex += experience_start()
    for e in experience_list:
        latex += experience(e['companyName'], e['location'], e['role'], f"{e['startDate']} - {e['endDate']}", e['jobDescription'])

    latex += project_start()
    for e in projects_list:
        latex += projects(e['projectTitle'], f"{e['startDate']} - {e['endDate']}", e['role'], e['githubLink'], e['jobDescription'])

    latex += end()

    # Write the Latex code into a .tex file
    with open("result/Resume.tex", "w") as f:
        f.write(latex)
        f.close()
    return latex
