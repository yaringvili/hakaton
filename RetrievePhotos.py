import instaloader
import face_recognition
import queue
from time import sleep
from threading import Thread
from pickle import dump, load
from os import mkdir, path, listdir
from shutil import rmtree

# Constants:
PATH_DIC = "C:\\Users\\razsa\\PycharmProjects\\WhoRU\\static\\uploads\\"
PATH_KNOWN = r"C:\Users\razsa\PycharmProjects\WhoRU\static\resources\check_pic.jpg"
STATUS_FILE = r"C:\Users\razsa\PycharmProjects\WhoRU\static\resources\status.txt"
# Get from user:
OSH_LOCATION = 225737319
VALID_MIN = 3
VALID_OUT_OF = 5

# Globals:
pics_queue = queue.Queue()
loader = instaloader.Instaloader(quiet=True, download_videos=False, download_comments=False, download_geotags=False, download_video_thumbnails=False)
user = ""


def main():
    loader.login("whoru562", "ThisIsMyPassword")
    load_osh = Thread(target=handle_download_location, args=())
    eval_pics = Thread(target=handle_eval, args=())
    load_osh.start()
    eval_pics.start()
    eval_pics.join()


def handle_download_location():
    files = listdir(PATH_DIC)
    index = 0
    while index + 1 < len(files):
        pics_queue.put((PATH_DIC + files[index + 1], PATH_DIC + files[index]))
        print("Add to Queue: " + PATH_DIC + files[index])
        index += 2
    print("Starting download")
    osh_pics = loader.get_location_posts(OSH_LOCATION)
    for i, pic in enumerate(osh_pics):
        if loader.download_pic(PATH_DIC + str(i).zfill(5) + "-" + pic.owner_username, pic.url, pic.date):
            save_profile(pic.owner_profile, str(i).zfill(5))
            pics_queue.put((PATH_DIC + str(i).zfill(5) + "-" + pic.owner_username + ".jpg", pic.owner_profile))
            print("Download and add to Queue: " + PATH_DIC + str(i).zfill(5) + "-" + pic.owner_username)
        else:
            print("Did not add: " + PATH_DIC + str(i).zfill(5) + "-" + pic.owner_username)
        if not user == "":
            break


def handle_eval():
    counter = 0
    known_image = face_recognition.load_image_file(PATH_KNOWN)
    face_known = face_recognition.face_encodings(known_image)
    if len(face_known) == 0:
        return False
    face_known = face_known[0]
    while True:
        if pics_queue.empty():
            sleep(3)
        else:
            curr_pic = pics_queue.get()
            curr_profile = curr_pic[1]
            if isinstance(curr_profile, str):
                curr_profile = get_profile(curr_pic[1])
            counter += 1
            open(STATUS_FILE, "w").write("S " + str(counter) + " " + "static/uploads/" + path.basename(curr_pic[0]) + " " + curr_profile.username)
            curr_image = face_recognition.load_image_file(curr_pic[0])
            eval_image = face_recognition.face_encodings(curr_image)
            print("Eval: " + curr_pic[0] + " found " + str(len(eval_image)) + " faces")
            for face in eval_image:
                result = face_recognition.compare_faces([face_known], face)
                if result[0]:
                    print("Found possible match, username: " + curr_profile.username)
                    if validate_profile(curr_profile, face_known):
                        print(curr_profile.username + " is correct according to the user's specifications")
                        open(STATUS_FILE, "w").write("F " + curr_profile.username + " " + "static/uploads/" + path.basename(curr_pic[0]))
                        return True
                    else:
                        print(curr_profile.username + " is incorrect according to the user's specifications")


def validate_profile(profile, face_known):
    pro_pics = profile.get_posts()
    posts = []
    if not path.isdir(PATH_DIC + profile.username):
        mkdir(PATH_DIC + profile.username)
    for i, pic in enumerate(pro_pics):
        loader.download_pic(PATH_DIC + profile.username + "\\" + str(i).zfill(5), pic.url, pic.date)
        posts.append(PATH_DIC + profile.username + "\\" + str(i).zfill(5))
        if i == VALID_OUT_OF - 1:
            break
    found_count = 0
    for img in posts:
        curr_image = face_recognition.load_image_file(img + ".jpg")
        eval_image = face_recognition.face_encodings(curr_image)
        for face in eval_image:
            result = face_recognition.compare_faces([face_known], face)
            if result[0]:
                found_count += 1
                break
    rmtree(PATH_DIC + profile.username)
    if found_count >= VALID_MIN:
        return True
    return False


def save_profile(profile, id_p):
    with open(PATH_DIC + id_p + "-" + profile.username, "wb") as pro_f:
        dump(profile, pro_f)


def get_profile(path_f):
    with open(path_f, "rb") as pro_f:
        return load(pro_f)


if __name__ == "__main__":
    main()
