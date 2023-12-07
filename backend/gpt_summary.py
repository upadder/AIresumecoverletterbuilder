import openai

openai.api_key = "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"

def get_improved_exp(description_combined, seek_jd):
    print(description_combined)
    improve_exp_prompt = 'From Job Description:\n' + seek_jd + '\n\n'
    improve_exp_prompt += ' & My Experiences: \n' + description_combined
  
    improve_exp_prompt += (" Please enhance and expand on each of my professional experiences listed above to closely align with the job description. "
                       "For each experience, use bullet points, strictly represented by '-', to format each point. "
                       "Incorporate relevant skills and achievements, using non skill-related keywords from the job description but do not add any new skills, languages or tools which are not present in my experience. "
                       "Focus on elaborating with action words and quantifiable results where applicable, "
                       "while ensuring the descriptions remain true to my actual experiences. Do not add anything that is not in my professional experiences. "
                       "Aim to enrich each experience with detailed bullet points that reflect the job's requirements. "
                       "Provide 3-4 bullet points per experience to maintain detail. "
                       "Please ensure each experience is clearly separated and distinct from the others. each experience is given as Experience 1, Experience 2 & so on, so return the same number of experiences."
                       "It is crucial not to add new skills or experiences that are not already present in my background.")

    response = openai.ChatCompletion.create(
        model="gpt-3.5-turbo",
        messages=[
            {"role": "system", "content": "You are an interviewer and helping a candidate to target resumes based on job description."},
            {"role": "user", "content": improve_exp_prompt}
        ]
    )
    print(response)
    if len(response['choices'][0]) > 0:

        points = response['choices'][0]['message']['content'].split("\n")
        improve_exp = []
        idx = 0
        while idx < len(points):
            if points[idx] == '':
                idx +=1
                continue
            if points[idx][0] == '-':
                single_exp = ""
                while idx < len(points) and points[idx] != '' and points[idx][0] == '-':
                    single_exp += points[idx][2:]+"\n"
                    idx+=1
                improve_exp.append(single_exp)
            else:
                idx += 1
        return improve_exp
    return []


def get_improved_projects(description_combined, seek_jd):
    print(description_combined)
    improve_exp_prompt = 'Job Description:\n' + seek_jd + '\n\n'
    improve_exp_prompt += 'My Projects: \n' + description_combined
    improve_exp_prompt += ("\n\nPlease enhance and expand on each of my projects listed above to closely align with the job description.. "
                            "For each project, use bullet points, strictly represented by '-', to format each point. "
                           "Incorporate relevant skills and achievements, using non skill-related keywords from the job description but do not add any new skills which is not present in my experience. "
                           "while ensuring the descriptions remain true to my actual experiences. Do not add anything that is not in my professional experiences. "
                           "Aim to enrich each project with detailed bullet points that reflect the job's requirements. "
                           "Provide 3-4 bullet points per project for a detailed and enriched representation with '-' . "
                           "Please ensure each project is clearly separated and distinct from the other. projects are given as Project 1, Project 2 & so on, so return the same number of projects."
                           "It is crucial not to add new skills or experiences that are not already present in my background.")
   
    response = openai.ChatCompletion.create(
        model="gpt-3.5-turbo",
        messages=[
            {"role": "system", "content": "You are an interviewer and helping a candidate to target resumes based on job description."},
            {"role": "user", "content": improve_exp_prompt}
        ]
    )
    print(response)
    if len(response['choices'][0]) > 0:
        points = response['choices'][0]['message']['content'].split("\n")
        improved_projects = []
        idx = 0
        while idx < len(points):
            if points[idx] == '':
                idx +=1
                continue
            if points[idx][0] == '-':
                single_project = ""
                while idx < len(points) and points[idx] != '' and points[idx][0] == '-':
                    single_project+= points[idx][2:]+"\n"
                    idx+=1
                improved_projects.append(single_project)
            else:
                idx += 1
        return improved_projects
    return []