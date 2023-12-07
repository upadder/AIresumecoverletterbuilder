import React, { useEffect, useState } from "react";
import NavBar from "./NavBar";
import "./App.css";
import "./index.css";
import { RadioButton } from "primereact/radiobutton";
// import { getDocument } from 'pdfjs-dist';
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { InputNumber } from "primereact/inputnumber";
import { Calendar } from "primereact/calendar";
import { InputTextarea } from "primereact/inputtextarea";
import { Card } from "primereact/card";
import "primereact/resources/primereact.min.css";
import "primereact/resources/themes/saga-blue/theme.css";
import "primeicons/primeicons.css";
import { getDocument, GlobalWorkerOptions } from "pdfjs-dist/legacy/build/pdf";
import "pdfjs-dist/legacy/build/pdf.worker";
import * as pdfjsLib from "pdfjs-dist";
import axios from "axios";
import { OPENAI_API_KEY } from "./constants";
import { ProgressSpinner } from "primereact/progressspinner";
import { Document, Paragraph, TextRun, Packer } from "docx";
import { saveAs } from "file-saver";
import { Document as PDFDocument } from "react-pdf";
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.js`;

function App() {
  const [generatedPDF, setGeneratedPDF] = useState(
    ""
    // "/Users/aman/sbu/fall2023/ams691.02/JustApply.ai/result/Resume.pdf"
  );
  // "/Users/aman/Documents/Aman Agrawal Resume Software Engineer.pdf";

  const [jobDescription, setJobDescription] = useState("");
  const [coverLetter, setCoverLetter] = useState("");
  const [progressVisible, setProgressVisible] = useState(false);
  const [progressMessage, setProgressMessage] = useState("");
  const [isEducationModalOpen, setEducationModalOpen] = useState(false);
  const [isProjectModalOpen, setProjectModalOpen] = useState(false);
  const [isExperienceModalOpen, setExperienceModalOpen] = useState(false);
  const [experienceDetails, setExperienceDetails] = useState([]);
  const [extractedText, setExtractedText] = useState("");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [linkedInURL, setLinkedInURL] = useState("");
  const [githubURL, setGithubURL] = useState("");
  const [projectDetails, setProjectDetails] = useState([]);
  const [educationDetails, setEducationDetails] = useState([]);
  const [languages, setLanguages] = useState([]);
  const [frameworks, setFrameworks] = useState([]);
  const [tools, setTools] = useState([]);
  const [template, setTemplate] = useState("1");
  const [editEdu, setEditEdu] = useState({});
  const [editExp, setEditExp] = useState({});
  const [editProj, setEditProj] = useState({});
  const openExperienceModal = () => {
    setExperienceModalOpen(true);
  };

  const closeExperienceModal = () => {
    setExperienceModalOpen(false);
  };
  useEffect(() => {
    if (JSON.stringify(editEdu) !== JSON.stringify({})) {
      openEducationModal();
    }
  }, [editEdu]);
  useEffect(() => {
    if (JSON.stringify(editExp) !== JSON.stringify({})) {
      openExperienceModal();
    }
  }, [editExp]);
  useEffect(() => {
    if (JSON.stringify(editProj) !== JSON.stringify({})) {
      openProjectModal();
    }
  }, [editProj]);
  //handle cover letter
  const handleCoverLetter = async (e) => {
    e.preventDefault();
    // Call to GPT-3 to generate a cover letter
    console.log(extractedText, jobDescription);
    const promptcoverletter = `Create a cover letter based on the resume provided and job description. strictly use data present in resume and put names and other fields from the resume as needed, don't add anything outside of the resume, also take points from job description and connect with the resume but also be sure not to add anything thats not on the resume: Resume Text:\n${extractedText}\nJob Description:\n${jobDescription}`;

    // Call your function to send prompt to GPT-3 and get the response
    setProgressVisible(true); // Show the progress bar modal
    setProgressMessage("Generating Cover Letter...");

    const systemMessageCoverLetter = {
      role: "system",
      content: promptcoverletter,
    };
    const apiRequestBodyCoverLetter = {
      model: "gpt-3.5-turbo",
      messages: [systemMessageCoverLetter],
    };
    await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: "Bearer " + OPENAI_API_KEY,
        "content-type": "application/json",
      },
      body: JSON.stringify(apiRequestBodyCoverLetter),
    })
      .then((data) => {
        return data.json();
      })
      .then((data) => {
        setCoverLetter(data);
        console.log(data);
        handleCoverLetterResponse(data);
        setProgressMessage("");
        setProgressVisible(false);
      });
  };
  const handleCoverLetterResponse = (apiResponse) => {
    if (apiResponse.choices && apiResponse.choices.length > 0) {
      const contentString = apiResponse.choices[0].message.content;
      let doc = new Document();
      const lines = contentString.split("\n");
      lines.forEach((line, index) => {
        doc.createParagraph(line);
      });
      saveCoverLetterToFile(doc, "CoverLetter.docx");
    }
  };

  function saveCoverLetterToFile(doc, fileName) {
    const packer = new Packer();
    const mimeType =
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
    packer.toBlob(doc).then((blob) => {
      const docblob = blob.slice(0, blob.size, mimeType);
      saveAs(docblob, fileName);
    });
  }

  //convert cover letter to word
  const handleExperienceSubmit = (details, isEdit) => {
    console.log("Experience Details:", experienceDetails);
    setExperienceDetails(function (prev) {
      if (isEdit) {
        prev[details.index] = details;
      } else {
        prev.push(details);
      }

      return prev;
    });
    setEditExp({});
    closeExperienceModal();
  };
  const openEducationModal = () => {
    setEducationModalOpen(true);
  };

  const closeEducationModal = () => {
    setEducationModalOpen(false);
  };

  const openProjectModal = () => {
    setProjectModalOpen(true);
  };

  const closeProjectModal = () => {
    setProjectModalOpen(false);
  };
  const handleEducationSubmit = (details, isEdit) => {
    console.log("Education Details:", educationDetails);
    setEducationDetails(function (prev) {
      if (isEdit) {
        prev[details.index] = details;
      } else {
        prev.push(details);
      }

      return prev;
    });
    setEditEdu({});
    closeEducationModal();
  };
  const handleProjectSubmit = (details, isEdit) => {
    // Handle the submission of project details here
    console.log("Project Details:", projectDetails);
    // You can save the details to state or perform any other necessary actions.
    setProjectDetails(function (prev) {
      if (isEdit) {
        prev[details.index] = details;
      } else {
        prev.push(details);
      }

      return prev;
    });
    setEditProj({});
    closeProjectModal();
  };
  // function to handle extract pdf

  const handlePdfUpload = async (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const typedarray = new Uint8Array(e.target.result);

        const pdf = await getDocument(typedarray).promise;
        let extractedText = "";

        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const textContent = await page.getTextContent();
          const strings = textContent.items.map((item) => item.str).join(" ");
          extractedText += strings + " ";
        }

        // Once you have the text, you can send it to your server to call GPT-4
        // and then parse the information to set the state
        setExtractedText(extractedText);
        firstCallApi(extractedText);
        console.log(extractedText); // For demonstration, just log it for now
      };
      reader.readAsArrayBuffer(file);
    }
  };
  // configuration for openAI

  const firstCallApi = async (extractedText) => {
    await callApiForResume(extractedText);
  };

  async function callApiForResume(extractedText) {
    setProgressVisible(true); // Show the progress bar modal
    setExperienceDetails([]);
    setProjectDetails([]);
    setEducationDetails([]);
    setLanguages([]);
    setFrameworks([]);
    setTools([]);
    setProgressMessage(
      "Fetching data from resume and extracting key information for autofilling..."
    );
    const prompt = `Extract the following details from the resume text and format it and return only JSON in {}: Full Name, Email, Phone Number, LinkedIn URL, Github URL, Skills and subskills fields like Languages, Frameworks, Tools, then Education and subeducaion fields like University Name
  Location
  Degree
  GPA
  Relevant Coursework
  Start Date
  End Date(mind that there might be multiple education in resume), Experience and subfields like Company Name
  Location
  Role
  Start Date
  End Date
  Job Description, 
  Projects and subfields like Project Title
  Role
  GitHub Link
  Start Date
  End Date
  Job Description.\n\nResume Text:\n${extractedText}`;

    const systemMessage = {
      role: "system",
      content: prompt,
    };
    const apiRequestBody = {
      model: "gpt-3.5-turbo",
      messages: [systemMessage],
    };
    await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: "Bearer " + OPENAI_API_KEY,
        "content-type": "application/json",
      },
      body: JSON.stringify(apiRequestBody),
    })
      .then((data) => {
        return data.json();
      })
      .then((data) => {
        processApiResponse(data);
      });
    setProgressVisible(false);
    setProgressMessage("");
  }

  const processApiResponse = (apiResponse) => {
    if (apiResponse.choices.length > 0) {
      const contentString = apiResponse.choices[0].message.content;
      try {
        const contentJson = JSON.parse(contentString);
        console.log(contentJson);
        setFullName(contentJson["Full Name"]);
        setEmail(contentJson["Email"]);
        setPhoneNumber(contentJson["Phone Number"]);
        setLinkedInURL(contentJson["LinkedIn URL"]);
        setGithubURL(contentJson["Github URL"]);
        // Normalize the Education details to always be an array
        const normalizedEducation = Array.isArray(contentJson.Education)
          ? contentJson.Education
          : [contentJson.Education];
        console.log(normalizedEducation);
        setEducationDetails((prevEducation) => [
          ...prevEducation,
          ...normalizedEducation.map((edu) => ({
            universityName: edu["University Name"],
            location: edu.Location,
            degree: edu.Degree,
            gpa: edu.GPA || "N/A", // Assuming GPA might be null or undefined
            relevantCoursework: edu["Relevant Coursework"],
            startDate: edu["Start Date"],
            endDate: edu["End Date"] || "Present", // Assuming End Date might be 'Present'
          })),
        ]);

        // Normalize the Experience details to always be an array
        const normalizedExperience = Array.isArray(contentJson.Experience)
          ? contentJson.Experience
          : [contentJson.Experience];
        setExperienceDetails((prevExperience) => [
          ...prevExperience,
          ...normalizedExperience.map((exp) => ({
            companyName: exp["Company Name"],
            location: exp.Location,
            role: exp.Role,
            startDate: exp["Start Date"],
            endDate: exp["End Date"] || "Present",
            jobDescription: exp["Job Description"],
          })),
        ]);

        // Normalize the Projects details to always be an array
        const normalizedProjects = Array.isArray(contentJson.Projects)
          ? contentJson.Projects
          : [contentJson.Projects];
        setProjectDetails((prevProjects) => [
          ...prevProjects,
          ...normalizedProjects.map((proj) => ({
            projectTitle: proj["Project Title"],
            role: proj.Role || "N/A", // Assuming Role might not be provided
            githubLink: proj["GitHub Link"] || "N/A", // Assuming GitHub Link might not be provided
            startDate: proj["Start Date"],
            endDate: proj["End Date"] || "Present",
            jobDescription: proj["Job Description"] || "N/A", // Assuming Job Description might not be provided
          })),
        ]);

        // Assuming Skills contains Languages, Frameworks, and Tools as comma-separated strings
        const skills = contentJson.Skills || {}; // Assuming there is a Skills object in the response
        const processSkillData = (data) => {
          if (Array.isArray(data)) {
            // If it's already an array, return it as is
            return data;
          } else if (typeof data === "string") {
            // If it's a string, split it into an array
            return data.split(",").map((s) => s.trim());
          } else {
            // If it's neither (or undefined), return an empty array
            return [];
          }
        };

        // Process each skill field
        const languages = processSkillData(skills.Languages);
        const frameworks = processSkillData(skills.Frameworks);
        const tools = processSkillData(skills.Tools);

        // Update the state for languages, frameworks, and tools
        setLanguages(languages);
        setFrameworks(frameworks);
        setTools(tools);
      } catch (error) {
        console.error("Failed to parse content string to JSON", error);
      }
    } else {
      console.error("No choices available in the API response");
    }
  };

  const EducationDialog = function ({ initalDetails = {} }) {
    const [currentDetails, setCurrentDetails] = useState(initalDetails);
    let isEdit = false;
    if (JSON.stringify(initalDetails) !== JSON.stringify({})) {
      isEdit = true;
    }
    return (
      <Dialog
        visible={isEducationModalOpen}
        onHide={closeEducationModal}
        header="Add Education"
        icon="pi pi-times"
        style={{ width: "70vw" }}
        draggable={false}
        footer={
          <Button
            label={isEdit ? "Update" : "Add Education"}
            icon="pi pi-save"
            onClick={() => handleEducationSubmit(currentDetails, isEdit)}
            className="p-button-text"
          />
        }
      >
        <div className="p-fluid">
          <div className="p-field">
            <label htmlFor="universityName">University Name</label>
            <InputText
              id="universityName"
              value={currentDetails.universityName}
              onChange={(e) =>
                setCurrentDetails((prev) => ({
                  ...prev,
                  universityName: e.target.value,
                }))
              }
            />
          </div>
          <div className="p-field">
            <label htmlFor="location">Location</label>
            <InputText
              id="location"
              value={currentDetails.location}
              onChange={(e) =>
                setCurrentDetails({
                  ...currentDetails,
                  location: e.target.value,
                })
              }
            />
          </div>
          <div className="p-field">
            <label htmlFor="degree">Degree</label>
            <InputText
              id="degree"
              value={currentDetails.degree}
              onChange={(e) =>
                setCurrentDetails({
                  ...currentDetails,
                  degree: e.target.value,
                })
              }
            />
          </div>
          <div className="p-field">
            <label htmlFor="gpa">GPA</label>
            <InputNumber
              id="gpa"
              value={currentDetails.gpa}
              onChange={(e) =>
                setCurrentDetails({
                  ...currentDetails,
                  gpa: e.value,
                })
              }
              mode="decimal"
            />
          </div>
          <div className="p-field">
            <label htmlFor="relevantCoursework">Relevant Coursework</label>
            <InputText
              id="relevantCoursework"
              value={currentDetails.relevantCoursework}
              onChange={(e) =>
                setCurrentDetails({
                  ...currentDetails,
                  relevantCoursework: e.target.value,
                })
              }
            />
          </div>
          <div className="p-field">
            <label htmlFor="startDate">Start Date</label>
            <Calendar
              id="startDate"
              value={currentDetails.startDate}
              onChange={(e) =>
                setCurrentDetails({
                  ...currentDetails,
                  startDate: e.value,
                })
              }
              showIcon
            />
          </div>
          <div className="p-field">
            <label htmlFor="endDate">End Date</label>
            <Calendar
              id="endDate"
              value={currentDetails.endDate}
              onChange={(e) =>
                setCurrentDetails({
                  ...currentDetails,
                  endDate: e.value,
                })
              }
              showIcon
            />
          </div>
        </div>
      </Dialog>
    );
  };
  const ProjectDialog = function ({ initalDetails = {} }) {
    const [currentDetails, setCurrentDetails] = useState(initalDetails);
    let isEdit = false;
    if (JSON.stringify(initalDetails) !== JSON.stringify({})) {
      isEdit = true;
    }
    return (
      <Dialog
        visible={isProjectModalOpen}
        onHide={closeProjectModal}
        header="Add Project"
        icon="pi pi-times"
        style={{ width: "70vw" }}
        draggable={false}
        footer={
          <Button
            label={isEdit ? "Update" : "Add Project"}
            icon="pi pi-save"
            onClick={() => handleProjectSubmit(currentDetails, isEdit)}
            className="p-button-text"
          />
        }
      >
        <div className="p-fluid">
          <div className="p-field">
            <label htmlFor="projectTitle">Project Title</label>
            <InputText
              id="projectTitle"
              value={currentDetails.projectTitle}
              onChange={(e) =>
                setCurrentDetails({
                  ...currentDetails,
                  projectTitle: e.target.value,
                })
              }
            />
          </div>
          <div className="p-field">
            <label htmlFor="role">Role</label>
            <InputText
              id="role"
              value={currentDetails.role}
              onChange={(e) =>
                setCurrentDetails({ ...currentDetails, role: e.target.value })
              }
            />
          </div>
          <div className="p-field">
            <label htmlFor="githubLink">GitHub Link</label>
            <InputText
              id="githubLink"
              value={currentDetails.githubLink}
              onChange={(e) =>
                setCurrentDetails({
                  ...currentDetails,
                  githubLink: e.target.value,
                })
              }
            />
          </div>
          <div className="p-field">
            <label htmlFor="startDate">Start Date</label>
            <Calendar
              id="startDate"
              value={currentDetails.startDate}
              onChange={(e) =>
                setCurrentDetails({ ...currentDetails, startDate: e.value })
              }
              showIcon
            />
          </div>
          <div className="p-field">
            <label htmlFor="endDate">End Date</label>
            <Calendar
              id="endDate"
              value={currentDetails.endDate}
              onChange={(e) =>
                setCurrentDetails({ ...currentDetails, endDate: e.value })
              }
              showIcon
            />
          </div>
          <div className="p-field">
            <label htmlFor="jobDescription">Job Description</label>
            <InputTextarea
              id="jobDescription"
              value={currentDetails.jobDescription}
              onChange={(e) =>
                setCurrentDetails({
                  ...currentDetails,
                  jobDescription: e.target.value,
                })
              }
              rows={5} // Set the number of rows for the textarea
            />
          </div>
        </div>
      </Dialog>
    );
  };
  const ExperienceDialog = function ({ initalDetails = {} }) {
    const [currentDetails, setCurrentDetails] = useState(initalDetails);
    let isEdit = false;
    if (JSON.stringify(initalDetails) !== JSON.stringify({})) {
      isEdit = true;
    }
    return (
      <Dialog
        visible={isExperienceModalOpen}
        onHide={closeExperienceModal}
        header="Add Experience"
        icon="pi pi-times"
        style={{ width: "70vw" }}
        draggable={false}
        footer={
          <Button
            label={isEdit ? "Update" : "Add Experience"}
            icon="pi pi-save"
            onClick={() => handleExperienceSubmit(currentDetails, isEdit)}
            className="p-button-text"
          />
        }
      >
        <div className="p-fluid">
          <div className="p-field">
            <label htmlFor="companyName">Company Name</label>
            <InputText
              id="companyName"
              value={currentDetails.companyName}
              onChange={(e) =>
                setCurrentDetails((prev) => ({
                  ...prev,
                  companyName: e.target.value,
                }))
              }
            />
          </div>
          <div className="p-field">
            <label htmlFor="location">Location</label>
            <InputText
              id="location"
              value={currentDetails.location}
              onChange={(e) =>
                setCurrentDetails({
                  ...currentDetails,
                  location: e.target.value,
                })
              }
            />
          </div>
          <div className="p-field">
            <label htmlFor="role">Role</label>
            <InputText
              id="role"
              value={currentDetails.role}
              onChange={(e) =>
                setCurrentDetails({
                  ...currentDetails,
                  role: e.target.value,
                })
              }
            />
          </div>
          <div className="p-field">
            <label htmlFor="startDate">Start Date</label>
            <Calendar
              id="startDate"
              value={currentDetails.startDate}
              onChange={(e) =>
                setCurrentDetails({
                  ...currentDetails,
                  startDate: e.value,
                })
              }
              showIcon
            />
          </div>
          <div className="p-field">
            <label htmlFor="endDate">End Date</label>
            <Calendar
              id="endDate"
              value={currentDetails.endDate}
              onChange={(e) =>
                setCurrentDetails({ ...currentDetails, endDate: e.value })
              }
              showIcon
            />
          </div>
          <div className="p-field">
            <label htmlFor="jobDescription">Job Description</label>
            <InputTextarea
              id="jobDescription"
              value={currentDetails.jobDescription}
              onChange={(e) =>
                setCurrentDetails({
                  ...currentDetails,
                  jobDescription: e.target.value,
                })
              }
              rows={5} // Set the number of rows for the textarea
            />
          </div>
        </div>
      </Dialog>
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent the default form submit action
    const parsed_resume = {
      Name: fullName,
      Email: email,
      Phone: phoneNumber,
      LinkedIn: linkedInURL,
      GitHub: githubURL,
      Languages: languages.join(", "), // Assuming languages is an array of strings
      Frameworks: frameworks.join(", "), // Assuming frameworks is an array of strings
      Tools: tools.join(", "), // Assuming tools is an array of strings
      Education: educationDetails, // Assuming educationDetails is an array of education objects
      Experiences: experienceDetails, // Assuming experienceDetails is an array of experience objects
      Projects: projectDetails, // Assuming projectDetails is an array of project objects
      JobDescription: jobDescription,
      template: template,
    };
    console.log(parsed_resume);
    // Here, replace 'your_backend_endpoint' with the actual URL of your backend API endpoint
    try {
      const response = await axios.post(
        "http://localhost:5000/generate-resume-latex",
        parsed_resume,
        {
          responseType: "arraybuffer",
        }
      );
      // console.log(response.data);
      const blob = new Blob([response.data], {
        type: response.headers["content-type"],
      });
      const url = URL.createObjectURL(blob);
      setGeneratedPDF(url);
      // Handle the response as needed, maybe set some state to show success or downloaded file
      //console.log(response.data); // Log or handle the response from the backend
    } catch (error) {
      // Handle any errors here
      console.error("Error submitting the resume data to the backend:", error);
    }
  };
  return (
    <div>
      <NavBar />
      <Dialog
        visible={progressVisible}
        style={{ width: "30vw" }}
        onHide={() => setProgressVisible(false)}
        modal
      >
        <div
          // className=""
          style={{ height: "300px" }}
        >
          <ProgressSpinner
            style={{ width: "200px", height: "200px", display: "flex" }}
            strokeWidth="2"
          />
          <p className="p-mt-2" style={{ textAlign: "center" }}>
            <b>{progressMessage}</b>
          </p>
        </div>
      </Dialog>

      {/* <div className="resume-builder"></div> */}
      {/* upload pdf for extraction */}
      <div className="main">
        <div className="choose-output">
          <label htmlFor="upload-pdf" className="upload-pdf-button">
            Upload PDF
            <input
              id="upload-pdf"
              type="file"
              accept="application/pdf"
              style={{ display: "none" }}
              onChange={handlePdfUpload}
            />
          </label>
        </div>
        <div className="full-page">
          <div className="input-section">
            <form>
              <section className="personal-info">
                <h2>Personal Information</h2>
                <div className="input-group">
                  <label for="name">Full Name</label>
                  <InputText
                    id="name"
                    type="text"
                    placeholder="Full Name"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                  />
                </div>
                <div className="input-group">
                  <label htmlFor="email">Email</label>
                  <input
                    id="email"
                    type="email"
                    placeholder="Email"
                    value={email} // Bind input to state variable
                    onChange={(e) => setEmail(e.target.value)} // Update state on change
                  />
                </div>
                <div className="input-group">
                  <label htmlFor="phone">Phone Number</label>
                  <input
                    id="phone"
                    type="text"
                    placeholder="Phone Number"
                    value={phoneNumber} // Bind input to state variable
                    onChange={(e) => setPhoneNumber(e.target.value)} // Update state on change
                  />
                </div>
                <div className="input-group">
                  <label htmlFor="linkedin">LinkedIn URL</label>
                  <input
                    id="linkedin"
                    type="text"
                    placeholder="LinkedIn URL"
                    value={linkedInURL} // Bind input to state variable
                    onChange={(e) => setLinkedInURL(e.target.value)} // Update state on change
                  />
                </div>
                <div className="input-group">
                  <label htmlFor="github">Github Link</label>
                  <input
                    id="github"
                    type="text"
                    placeholder="Github URL"
                    value={githubURL} // Bind input to state variable
                    onChange={(e) => setGithubURL(e.target.value)} // Update state on change
                  />
                </div>
              </section>
              <section className="skills">
                <h2>Skills</h2>
                <div className="input-group">
                  <label htmlFor="languages">Languages</label>
                  <InputText
                    id="languages"
                    value={languages.join(", ")}
                    onChange={(e) =>
                      setLanguages(
                        e.target.value.split(",").map((s) => s.trim())
                      )
                    }
                    placeholder="Languages"
                  />
                </div>
                <div className="input-group">
                  <label htmlFor="frameworks">Frameworks</label>
                  <InputText
                    id="frameworks"
                    value={frameworks.join(", ")}
                    onChange={(e) =>
                      setFrameworks(
                        e.target.value.split(",").map((s) => s.trim())
                      )
                    }
                    placeholder="Frameworks"
                  />
                </div>
                <div className="input-group">
                  <label htmlFor="tools">Tools</label>
                  <InputText
                    id="tools"
                    value={tools.join(", ")}
                    onChange={(e) =>
                      setTools(e.target.value.split(",").map((s) => s.trim()))
                    }
                    placeholder="Tools"
                  />
                </div>
              </section>

              <section className="education">
                <h2>Education</h2>
                {educationDetails.map(function (element, idx) {
                  const startDate = new Date(
                    element.startDate
                  ).toLocaleDateString();
                  const endDate = new Date(
                    element.endDate
                  ).toLocaleDateString();
                  return (
                    <Card>
                      <div className="cardContent">
                        <div className="education-card">
                          <h3>{element.universityName}</h3>
                          <p>{element.location}</p>
                          <p>{element.degree}</p>
                          <p>GPA: {element.gpa}</p>
                          <p>
                            Relevant Coursework: {element.relevantCoursework}
                          </p>
                          <p>
                            {startDate} - {endDate}
                          </p>
                        </div>
                        <div
                          style={{ display: "flex", flexDirection: "column" }}
                        >
                          <button
                            className="p-button p-button-text"
                            onClick={(e) => {
                              e.preventDefault();
                              element["index"] = idx;
                              setEditEdu(element);
                            }}
                          >
                            Edit
                          </button>
                          <button
                            className="p-button p-button-text"
                            onClick={(e) => {
                              e.preventDefault();
                              setEducationDetails((currentDetails) =>
                                currentDetails.filter(
                                  (_, filterIdx) => filterIdx !== idx
                                )
                              );
                            }}
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    </Card>
                  );
                })}
                <Button
                  label="Add Education"
                  onClick={openEducationModal}
                  type="button"
                />
              </section>

              <section className="experience">
                <h2>Experience</h2>
                {experienceDetails.map(function (element, idx) {
                  const startDate = new Date(
                    element.startDate
                  ).toLocaleDateString();
                  const endDate = new Date(
                    element.endDate
                  ).toLocaleDateString();
                  return (
                    <Card>
                      <div className="cardContent">
                        <div className="education-card">
                          <h3>{element.companyName}</h3>
                          <p>{element.location}</p>
                          <p>Role: {element.role}</p>

                          <p>
                            {startDate} - {endDate}
                          </p>
                          <p>Job Description: {element.jobDescription}</p>
                        </div>
                        <div
                          style={{ display: "flex", flexDirection: "column" }}
                        >
                          <button
                            className="p-button p-button-text"
                            onClick={(e) => {
                              e.preventDefault();
                              element["index"] = idx;
                              setEditExp(element);
                            }}
                          >
                            Edit
                          </button>
                          <button
                            className="p-button p-button-text"
                            onClick={(e) => {
                              e.preventDefault();
                              setExperienceDetails((currentDetails) =>
                                currentDetails.filter(
                                  (_, filterIdx) => filterIdx !== idx
                                )
                              );
                            }}
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    </Card>
                  );
                })}
                <Button
                  label="Add Experience"
                  onClick={openExperienceModal}
                  type="button"
                />
              </section>
              <section className="projects">
                <h2>Projects</h2>
                {projectDetails.map(function (element, idx) {
                  const startDate = new Date(
                    element.startDate
                  ).toLocaleDateString();
                  const endDate = new Date(
                    element.endDate
                  ).toLocaleDateString();
                  return (
                    <Card>
                      <div className="cardContent">
                        <div className="project-card">
                          <h3>{element.projectTitle}</h3>
                          <p>Role: {element.role}</p>
                          <p>GitHub: {element.githubLink}</p>

                          <p>
                            {startDate} - {endDate}
                          </p>
                          <p>Job Description: {element.jobDescription}</p>
                        </div>
                        <div
                          style={{ display: "flex", flexDirection: "column" }}
                        >
                          <button
                            className="p-button p-button-text"
                            onClick={(e) => {
                              e.preventDefault();
                              element["index"] = idx;
                              setEditProj(element);
                            }}
                          >
                            Edit
                          </button>
                          <button
                            className="p-button p-button-text"
                            onClick={(e) => {
                              e.preventDefault();
                              setProjectDetails((currentDetails) =>
                                currentDetails.filter(
                                  (_, filterIdx) => filterIdx !== idx
                                )
                              );
                            }}
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    </Card>
                  );
                })}
                <Button
                  label="Add Project"
                  onClick={openProjectModal}
                  type="button"
                />
              </section>
              {/* <section className="projects">
                <h2>Projects</h2>
                <Button
                  label="Add Project"
                  onClick={openProjectModal}
                  type="button"
                />
              </section> */}
              <div className="input-group" style={{ marginTop: "20px" }}>
                <h2>Job Description</h2>
                <textarea
                  id="jobDescription"
                  className="textarea-job-description"
                  placeholder="Enter job description here..."
                  rows="20"
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                ></textarea>
              </div>

              <div className="input-group" style={{ marginTop: "20px" }}>
                <h2>Resume Template</h2>
                <div className="flex flex-wrap gap-3">
                  <div className="flex align-items-center">
                    <RadioButton
                      inputId="template1"
                      name="temp1"
                      value="1"
                      onChange={(e) => setTemplate(e.value)}
                      checked={template === "1"}
                    />
                    <label htmlFor="template1" className="ml-2">
                      Resume Template 1
                    </label>
                  </div>
                  <div className="flex align-items-center">
                    <RadioButton
                      inputId="template2"
                      name="temp2"
                      value="2"
                      onChange={(e) => setTemplate(e.value)}
                      checked={template === "2"}
                    />
                    <label htmlFor="template2" className="ml-2">
                      Resume Template 2
                    </label>
                  </div>
                </div>
              </div>

              <div className="button-group">
                <Button
                  label="Generate Resume"
                  className="p-button-success"
                  onClick={(e) => {
                    handleSubmit(e);
                  }}
                  style={{ marginRight: "10px" }}
                />
                <Button
                  label="Generate Cover Letter"
                  className="p-button-info"
                  onClick={(e) => {
                    handleCoverLetter(e);
                  }}
                />
              </div>
            </form>
          </div>
          <div className="output-section">
            <h2> Output</h2>
            {generatedPDF ? (
              <div>
                {/* <PDFDocument file={generatedPDF}></PDFDocument> */}
                <iframe src={generatedPDF} width="100%" height="1000px" />
              </div>
            ) : (
              <p>PDF will be displayed here after submission.</p>
            )}
          </div>
        </div>
      </div>
      <EducationDialog initalDetails={editEdu} />
      <ProjectDialog initalDetails={editProj} />
      <ExperienceDialog initalDetails={editExp} />
    </div>
  );
}

export default App;
