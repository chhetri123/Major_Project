from flask import Flask, request, jsonify
import cv2
from keras.models import load_model
import numpy as np
from keras.applications import ResNet152
from keras.optimizers import Adam
from keras.models import Sequential, Model
from keras.utils import to_categorical
from keras.preprocessing import image, sequence
import cv2
from keras_preprocessing.sequence import pad_sequences
from tqdm import tqdm
import pickle
import tensorflow as tf
# from keras.applications.Resnet50 import preprocess_input
from flask_cors import CORS

from keras.applications import ResNet50
# 

incept_model = ResNet152(weights='imagenet', include_top=True)
last = incept_model.layers[-2].output
ResNet152Model= Model(inputs = incept_model.input,outputs = last)

with open("pickle_files/words_dict.pkl","rb") as f:
    words_dict=pickle.load(f)


vocab_size = len(words_dict)+1
MAX_LEN = 192
inv_dict = {v:k for k, v in words_dict.items()}


model = tf.keras.models.load_model('models/LSTM/lstm_model.h5')
print("model loaded")


app = Flask(__name__)
app.config['SEND_FILE_MAX_AGE_DEFAULT'] = 1
cors = CORS(app, resources={r"/*": {"origins": "*"}})
# @app.route('/')
# def index(): 
#     return render_template('index.html')

@app.route('/after', methods=['POST'])
def after():

    if 'file' not in request.files:
        return 'No file part'

    file = request.files['file']

    if file.filename == '':
        return 'No selected file'

    # Save the file
   
    file.save('static/file.jpg')

    # Read the saved file
    img = cv2.imread('static/file.jpg')
    img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
    img = cv2.resize(img, (224,224))
    img = img.reshape(1,224,224,3)
    test_img_resized=ResNet152Model.predict(img).reshape(2048,)

    text_inp = ['startofseq']
    count = 0
    caption = ''
    while count < MAX_LEN:
        count += 1
        encoded = []
        encoded = [words_dict.get(word, len(words_dict) - 1) for word in text_inp]  # Convert words to indices, using index for '<end>' for unknown words
        encoded = pad_sequences([encoded], padding='post', truncating='post', maxlen=MAX_LEN)[0]  # Pad sequences

        data_list = [test_img_resized.reshape(1, -1), encoded.reshape(1, -1)]  # Reshape encoded
        prediction = np.argmax(model.predict(data_list))
        prediction = np.argmax(model.predict(data_list))
        sampled_word = inv_dict[prediction]
        caption = caption + ' ' + sampled_word

        if sampled_word == 'endofseq':
            break
        text_inp.append(sampled_word)

    caption= caption.replace('endofseq','')
    print(caption.replace(' .','.'))

    return jsonify({'caption': caption.replace(' .','.')})


if __name__ == "__main__":
    app.run(debug=True) 