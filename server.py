from flask import Flask, escape, request, render_template, redirect, jsonify
import os
import threading
from datetime import datetime
import RetrievePhotos

app = Flask(__name__)
app.config["IMAGE_UPLOADS"] = r"C:\Users\razsa\PycharmProjects\WhoRU\static\resources"
app.config["ALLOWED_IMAGE_EXTENSIONS"] = ["JPEG", "JPG"]
STATUS_PATH = r"C:\Users\razsa\PycharmProjects\WhoRU\static\resources\status.txt"

ALLOWED_EXTENSIONS = ['txt', 'pdf', 'png', 'jpg', 'jpeg', 'gif']


def allowed_image(filename):
    if "." not in filename:
        return False
    ext = filename.rsplit(".", 1)[1]
    if ext.upper() in app.config["ALLOWED_IMAGE_EXTENSIONS"]:
        return True
    else:
        return False


@app.route('/status')
def status():
    with open(STATUS_PATH, "r") as f:
        return f.readline()


@app.route('/')
def start_animation():
    with open(STATUS_PATH, "w") as f:
        f.write("")
    return render_template("screen.html")


@app.route('/upload', methods=["GET", "POST"])
def upload():
    print(request.files)
    if request.method == 'POST':
        file = request.files['file']
        if file and allowed_file(file.filename):
            now = datetime.now()
            filename = os.path.join(app.config["IMAGE_UPLOADS"], "check_pic.jpg")
            file.save(filename)
            threading.Thread(target=RetrievePhotos.main(), args=()).start()
            return jsonify({"success": True})


def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1] in ALLOWED_EXTENSIONS


def main():
    app.run()


if __name__ == "__main__":
    main()