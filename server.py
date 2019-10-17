from flask import Flask, escape, request, render_template, redirect
import os

app = Flask(__name__)
app.config["IMAGE_UPLOADS"] = "static/uploads"
app.config["ALLOWED_IMAGE_EXTENSIONS"] = ["JPEG", "JPG", "PNG", "GIF"]

def allowed_image(filename):

    if not "." in filename:
        return False

    ext = filename.rsplit(".", 1)[1]

    if ext.upper() in app.config["ALLOWED_IMAGE_EXTENSIONS"]:
        return True
    else:
        return False


@app.route('/')
def index():
    return render_template("index.html")

@app.route('/upload-image', methods=["GET", "POST"])
def upload():
    if request.method == "POST":

        if request.files:

            image = request.files["image"]

            if image.filename == "":
                print("No filename")
                return redirect(request.url)

            if allowed_image(image.filename):

                image.save(os.path.join(app.config["IMAGE_UPLOADS"], image.filename))

                print("Image saved")

                return redirect(request.url)

            else:
                print("That file extension is not allowed")
                return redirect(request.url)
            
    return render_template("loading.html")
    
def main():
	app.run()
	
if __name__ == "__main__":
	main()