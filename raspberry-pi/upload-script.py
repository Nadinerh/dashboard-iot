import requests
import os
import time
from watchdog.observers import Observer
from watchdog.events import FileSystemEventHandler

BACKEND_URL = 'http://192.168.137.1:5000/api/upload/upload'  # Replace x with your backend IP
FILE_PATH = '/home/moncompteiot/secure_iot/encrypted_sensor_data.enc'  # Update with your file path

def upload_file():
    try:
        with open(FILE_PATH, 'rb') as f:
            files = {'file': f}
            response = requests.post(BACKEND_URL, files=files)
            print(f'Upload response: {response.json()}')
    except Exception as e:
        print(f'Upload error: {e}')

class FileHandler(FileSystemEventHandler):
    def on_modified(self, event):
        if event.src_path == FILE_PATH:
            print('File modified, uploading...')
            upload_file()

if __name__ == "__main__":
    # Initial upload if file exists
    if os.path.exists(FILE_PATH):
        upload_file()

    # Watch for file changes
    event_handler = FileHandler()
    observer = Observer()
    observer.schedule(event_handler, os.path.dirname(FILE_PATH), recursive=False)
    observer.start()

    try:
        while True:
            time.sleep(1)
    except KeyboardInterrupt:
        observer.stop()
    observer.join()
