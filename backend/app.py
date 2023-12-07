from flask import Flask, send_file
from flask import request
from improve_resume import improve_resume
from flask_cors import CORS
import os
app = Flask(__name__)
CORS(app)
@app.route("/")
def hello_world():
    return "<p>Hello, World!</p>"

@app.post("/generate-resume-latex")
def generate_resume_latex():
    # print(request.json)
    payload = request.json
    result_path = os.path.join(app.root_path, 'result/')
    improve_resume(payload, result_path)
    print("################################")
    return send_file(os.path.join(result_path, "Resume.pdf"), as_attachment=True)

if __name__ == "__main__":
    app.run(debug=True)