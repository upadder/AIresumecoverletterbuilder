- [Create virtual env](https://docs.python.org/3/library/venv.html#creating-virtual-environments)
  ```bash
  python3 -m venv /path/to/new/virtual/environment
  ```
- Activate the env.\
   Mac
  ```bash
  source <venv>/bin/activate
  ```
  Windows
  ```
  <venv>\Scripts\activate.bat
  ```
- Install pdflatex (https://www.tug.org/applications/pdftex/).\
  Mac
  ```bash
  brew install --cask mactex
  ```
- Create an [OpenAI API Token](https://beta.openai.com/account/api-keys)
- Replace the API Token in `gpt_summary.py`
- Install requirements
  ```
  pip install -r requirements.txt
  ```
- Run the project
  ```
  python app.py
  ```
- After running, for checking the result, go to `result/Resume.pdf`
- For further fine-tuning, edit `resume/Resume.tex`.
- To export to pdf run `pdflatex -interaction=nonstopmode result/Resume.tex`
