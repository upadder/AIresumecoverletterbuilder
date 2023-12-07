from latex_template_1 import get_latex_text as get_latex_text1
from latex_template_2 import get_latex_text as get_latex_text2
from gpt_summary import get_improved_exp, get_improved_projects
import os


# 'Education': [[university_name_text, location_name_text, degree_name_text, gpa_text, time_period, relevent_courses_text]]
# 'Experiences: [[company_name_text, location_text, role_text, time_period, jd_text]]
# 'Projects: [[project_name_text, time_period, role_text, github_text, jd_text]]
parsed_resume = {
    'Name' : 'VIRAL DOSHI',
    'Email' : 'viral.doshi@stonybrook.edu',
    'Phone' : '+15163485402',
    'LinkedIn' : 'https://www.linkedin.com/in/doshi-viral',
    'GitHub' : 'https://github.com/Viral-Doshi',
    'Languages' : 'Languages: Python, C++, Java, C, HTML, CSS, JavaScript, Go',
    'Frameworks': 'SpringBoot, MySQL, MongoDB, PostgreSQL, Docker, CI/CD, Kibanna',
    'Tools': 'MatLab, Tableau, JUnit, Selenium',
    'Education': [
        ['Stony Brook University',
         'NY, USA',
         'Master of Science (MS)',
         '4',
         'Recent Advancements in AI, Data Science, Theory of Databases',
         'Aug 2023 - May 2025'],
         ['IIIT Jabalpur',
         'MP, India',
         'Bachelor of Technology (B. Tech)',
         '3.8',
         'DBMS, OS, Computer Networks, OOPS in Java',
         'May 2019 - May 2023']
         ],
    'Experiences': [
        ['AlphaTech Solutions',
         'CA, USA',
         'Software Developer Intern',
         'Jan 2023 - Mar 2023',
         "At AlphaTech, I was part of the mobile application development team, where I contributed to the design and implementation of new features for the company's flagship e-commerce app. I collaborated closely with UX/UI designers to ensure smooth user experiences and worked with senior developers to optimize the app's performance. Using agile methodologies, I participated in daily stand-ups, sprint planning, and retrospectives. My most significant achievement was implementing a dynamic product recommendation system, which increased user engagement by 15%."],
         ['Nexa Networks',
         'WA, USA',
         'Data Science Intern',
         'Jan 2022 - Aug 2022',
         "At Nexa, I delved into the world of big data and machine learning. I was responsible for preprocessing and analyzing vast datasets to derive actionable insights for the company's network optimization team. Using Python and tools like Pandas and Scikit-learn, I developed predictive models to forecast network traffic and identify potential bottlenecks. I also collaborated with the infrastructure team to deploy these models in a cloud environment, ensuring real-time analytics for the operations team. My efforts led to a significant improvement in network efficiency."]    
    ],
    'Projects': [
        ['Smart Home Automation System',
        'Jan 2023 - Mar 2023',
        'Research Assistant',
        'https://github.com/xenon-19/Gesture-Controlled-Virtual-Mouse',
        "I spearheaded a team project to design and implement a Smart Home Automation System using Raspberry Pi and IoT devices. The system allowed users to control home appliances, monitor energy consumption, and ensure security through a custom-built mobile application. We integrated various sensors, such as temperature, motion, and light sensors, to automate tasks like adjusting room temperature or turning off lights when no one is present. The backend was developed using Python and Flask, while the frontend."],
        ['Virtual Library Assistant',
        'Jul 2023 - Oct 2023',
        'Project Member',
        'https://github.com/Viral-Doshi/DSA',
        "I conceptualized and developed a Virtual Library Assistant using Natural Language Processing (NLP) and chatbot technologies. The assistant aids users in finding books, scheduling study rooms, and answering frequently asked questions about the library's resources and policies. Built on the Rasa framework, the chatbot was trained using a dataset of over 10,000 user queries, ensuring robust and accurate responses. Additionally, I integrated the system with the library's database using a RESTful API, allowing real-time book availability checks. User feedback indicated a signifiacnt reduction in routine inquiries to library staff, streamlining operations and enhancing user experience."]
    ],
    'JobDescription' : "An ideal candidate: Will complete a Bachelor’s or Master’s degree in Computer Science or a related technical field between Fall/Winter 2024 - Summer 2025. Has built or worked on production applications \
    Enjoys understanding our users and what would make their day-to-day processes easier to manage \
    Loves shipping features that are immediately used by our customers \
    Seeks to iterate on new products based on customer feedback \
    Is available for 12 weeks in London starting in May/June \
    Will champion, role model, and embed Samsara’s cultural principles (Focus on Customer Success, Build for the Long Term, Adopt a Growth Mindset, Be Inclusive, Win as a Team) as we scale globally and across new offices."
}

def make_heading(parsed_resume):
    heading = []
    heading.extend([parsed_resume['Name'], parsed_resume['Email'], parsed_resume['Phone'], parsed_resume['LinkedIn'], parsed_resume['GitHub']])
    return heading

def make_skills(parsed_resume):
    skills = []
    skills.extend([parsed_resume['Languages'], parsed_resume['Frameworks'], parsed_resume['Tools']])
    return skills

def make_education(parsed_resume):
    education = parsed_resume['Education']
    for e in education:
        if 'relevantCoursework' not in e:
            e['relevantCoursework'] = []
        if e['relevantCoursework'] is None:
            e['relevantCoursework'] = []
    return education

def make_expereinces(parsed_resume):
    experiences = parsed_resume['Experiences']
    jd_text_combined = ''
    for idx, exp in enumerate(experiences):
        jd_text_combined += 'Experience ' + str(idx+1) + ' :\n' + str(exp['jobDescription']) + '\n\n'
    if jd_text_combined:
        seek_jd = parsed_resume['JobDescription']
        improved_experiences = get_improved_exp(jd_text_combined, seek_jd)
        print(improved_experiences)
        # if len(experiences) != len(improved_experiences):
            # raise Exception('Mismatch in imrpoved exp size: ', len(experiences), len(improved_experiences))
        for idx in range(len(experiences)):
            improved_exp_single = improved_experiences[idx].replace("%", "\\%")
            improved_exp_single = improved_exp_single.replace("$", "\\$")
            improved_exp_single = improved_exp_single.replace("&", "\\&")
            experiences[idx]['jobDescription'] = improved_exp_single.split("\n")

        print(experiences)
    return experiences

def make_projects(parsed_resume):
    projects = parsed_resume['Projects']
    projects_text_combined = ''
    for idx, project in enumerate(projects):
        projects_text_combined += 'Project ' + str(idx+1) + ' :\n' + project['jobDescription'] + '\n\n'
    if projects_text_combined:
        seek_jd = parsed_resume['JobDescription']
        print("-----")
        print(projects_text_combined)
        improved_projects = get_improved_projects(projects_text_combined, seek_jd)
        print(improved_projects)
        # if len(projects) != len(improved_projects):
            # raise Exception('Mismatch in imrpoved exp size: ', len(projects), len(improved_projects))
        for idx in range(len(projects)):
            improved_project = improved_projects[idx].replace("%", "\\%")
            improved_project = improved_project.replace("$", "\\$")
            improved_project = improved_project.replace("&", "\\&")
            projects[idx]['jobDescription'] = improved_project.split("\n")

        print(projects)
    return projects

def improve_resume(parsed_resume, result_dir):
    heading = make_heading(parsed_resume)
    skills = make_skills(parsed_resume)
    education = make_education(parsed_resume)
    experiences = make_expereinces(parsed_resume)
    projects = make_projects(parsed_resume)
    # print("------------------------")
    # print(experiences)
    # print("------------------------")
    # print(projects)
    if parsed_resume['template'] == '1':
        get_latex_text1(heading, skills, education, experiences, projects)
    elif parsed_resume['template'] == '2':
        get_latex_text2(heading, skills, education, experiences, projects)
    os.system(f"cd {result_dir} && pdflatex -interaction=nonstopmode {os.path.join(result_dir, 'Resume.tex')}")
    # os.system(f"cd C:\\Users\\viral\\OneDrive\\Desktop\\ChatGPT\\JustApply.ai\\backend\\result && pdflatex -interaction=nonstopmode {os.path.join(result_dir, 'Resume.tex')}")
 
# improve_resume(parsed_resume, os.path.join(os.getcwd(), 'result/'))