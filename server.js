#!/usr/bin/env python

import os
import sys
import time
import signal
import json
import requests
from requests.structures import CaseInsensitiveDict
from edge_impulse_linux.image import ImageImpulseRunner
from picamera2 import Picamera2
import cv2
import numpy as np
import getopt

runner = None
id_product = 1
list_label = []
count = 0
taken = 0

# Product labels
a = 'Comb'
b = 'Bhakarwadi'
l = 'Isolation Tape'
c = 'Hair cream'

def now():
    return round(time.time() * 1000)

def initialize_camera():
    try:
        picam2 = Picamera2()
        preview_config = picam2.create_preview_configuration(main={"size": (640, 480)})
        picam2.configure(preview_config)
        picam2.start()
        print("Camera initialized successfully.")
        return picam2
    except Exception as e:
        print(f"Error initializing camera: {e}")
        sys.exit(1)

def capture_frame(picam2):
    try:
        frame = picam2.capture_array()
        print("Frame captured successfully.")
        return cv2.cvtColor(frame, cv2.COLOR_RGB2BGR)
    except Exception as e:
        print(f"Error capturing frame: {e}")
        return None

def sigint_handler(sig, frame):
    print('Interrupted')
    if runner:
        runner.stop()
    sys.exit(0)

signal.signal(signal.SIGINT, sigint_handler)

def help():
    print('python classify.py <path_to_model.eim>')

def post(label, price, final_rate, taken):
    global id_product
    url = "http://your-server-url.com/product"  # Update with your actual server URL
    headers = CaseInsensitiveDict()
    headers["Content-Type"] = "application/json"
    data_dict = {
        "id": id_product,
        "name": label,
        "price": price,
        "units": "units",
        "taken": taken,
        "payable": final_rate
    }
    data = json.dumps(data_dict)

    try:
        resp = requests.post(url, headers=headers, data=data)
        if resp.status_code == 200:
            print(f"Product {label} added successfully.")
        else:
            print(f"Failed to add product: {resp.status_code} - {resp.text}")
    except requests.exceptions.RequestException as e:
        print(f"Error sending data: {e}")

    id_product += 1
    list_label.clear()

def rate(label, taken):
    print("Calculating rate")
    if label == a:
        price = 10
        final_rate = 10
    elif label == b:
        price = 20
        final_rate = 20
    elif label == l:
        price = 1
        final_rate = 1
    else:
        price = 2
        final_rate = 2

    post(label, price, final_rate, taken)

def list_com(label):
    global count
    global taken
    list_label.append(label)
    count += 1
    print('count is', count)
    time.sleep(1)
    if count > 1:
        if list_label[-1] != list_label[-2]:
            print("New Item detected")
            print("Label is", list_label[-1])
            rate(list_label[-2], taken)

def main(argv):
    try:
        opts, args = getopt.getopt(argv, "h", ["--help"])
    except getopt.GetoptError:
        help()
        sys.exit(2)

    for opt, arg in opts:
        if opt in ('-h', '--help'):
            help()
            sys.exit()

    if len(args) == 0:
        help()
        sys.exit(2)

    model = args[0]
    dir_path = os.path.dirname(os.path.realpath(__file__))
    modelfile = os.path.join(dir_path, model)

    print('MODEL: ' + modelfile)

    picam2 = initialize_camera()

    with ImageImpulseRunner(modelfile) as runner:
        try:
            model_info = runner.init()
            print('Loaded runner for "' + model_info['project']['owner'] + ' / ' + model_info['project']['name'] + '"')
            labels = model_info['model_parameters']['labels']

            next_frame = 0

            while True:
                if next_frame > now():
                    time.sleep((next_frame - now()) / 1000)

                frame = capture_frame(picam2)

                if frame is None:
                    print("No frame captured, skipping this iteration.")
                    continue

                try:
                    features, cropped = runner.get_features_from_image(frame)
                    print("Features extracted successfully.")
                    res = runner.classify(features)
                    print("Classification result:", res)

                    if "classification" in res["result"].keys():
                        print('Result (%d ms.) ' % (res['timing']['dsp'] + res['timing']['classification']), end='')
                        for label in labels:
                            score = res['result']['classification'][label]
                            if score > 0.9:
                                list_com(label)
                                print(f'{label} detected')
                        print('', flush=True)
                    next_frame = now() + 100
                except Exception as e:
                    print(f"Error during inference: {e}")
                    break
        finally:
            if runner:
                runner.stop()

if __name__ == "__main__":
    main(sys.argv[1:])
