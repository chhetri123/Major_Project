from flask import Flask, request, jsonify
import cv2
import numpy as np
from keras.applications import ResNet152
from keras.optimizers import Adam
from keras.models import Sequential, Model,load_model
from keras.layers import Input
from keras.layers import Dense
from keras.layers import LSTM
from keras.layers import Embedding
from keras.layers import Dropout
from keras.layers import add
from keras.utils import to_categorical

from tensorflow.keras.applications.resnet import preprocess_input
from keras.preprocessing import image, sequence
import cv2
from keras_preprocessing.sequence import pad_sequences
from tqdm import tqdm
import pickle
import tensorflow as tf
# from keras.applications.Resnet50 import preprocess_input
from flask_cors import CORS
# 
# Transformer 
from library.prediction import evaluate_single_image
from  library.transformer import Transformer
from library.customSchedule import learning_rate

top_k = 25000
num_layer = 4
d_model = 512
dff = 2048
num_heads = 8
row_size = 8
col_size = 8
target_vocab_size = top_k + 1
dropout_rate = 0.1


loaded_transformer = Transformer(num_layer, d_model, num_heads, dff, row_size, col_size,
                                 target_vocab_size, max_pos_encoding=target_vocab_size,
                                 rate=dropout_rate)

# Load the weights into the model
loaded_transformer.load_weights('models/Transformer/model')
# Use the loaded custom objects
loaded_transformer.compile(optimizer=tf.keras.optimizers.Adam(learning_rate))
print("Trasformer model loaded successfully")
# loaded_transformer.compile(optimizer=tf.keras.optimizers.Adam(learning_rate), loss=train_loss.result(), metrics=[train_accuracy])
global tokenizer
with open('pickle_files/transformer/tokenizer.pickle', 'rb') as handle:
    tokenizer = pickle.load(handle)
    tokenizer.word_index['<pad>'] = 0
    tokenizer.index_word[0] = '<pad>'


print("Tokenizer  loaded successfully")

# 

ResNet152Model=ResNet152(include_top=False, weights='imagenet',input_shape=(224,224,3), pooling='avg')
with open("pickle_files/lstm/words_dict_nepali_sc.pkl","rb") as f:
    words_dict=pickle.load(f)


# vocab_size = len(words_dict)+1
vocab_size = 5521
# MAX_LEN = 192
MAX_LEN=210
inv_dict = {v:k for k, v in words_dict.items()}


# model = tf.keras.models.load_model('models/LSTM/cultural_nepali_50.h5')

inputs1 = Input(shape=(2048,))
fe1 = Dropout(0.5)(inputs1)
fe2 = Dense(256, activation='relu')(fe1)

# language sequence model
inputs2 = Input(shape=(MAX_LEN,))
se1 = Embedding(vocab_size, MAX_LEN, mask_zero=True)(inputs2)
se2 = Dropout(0.4)(se1)
se3 = LSTM(256)(se2)

# decoder model
decoder1 = add([fe2, se3])
decoder2 = Dense(256, activation='relu')(decoder1)
outputs = Dense(vocab_size, activation='softmax')(decoder2)

# tie it together [image, seq] [word]
model = Model(inputs=[inputs1, inputs2], outputs=outputs)
# compile model
model.compile(loss='categorical_crossentropy', optimizer='adam',metrics=['accuracy'])
model.load_weights("models/LSTM/resnet152_lstm_model_weights_50epoch.h5")
#
print("LSTM model  loaded successfully")


app = Flask(__name__)
app.config['SEND_FILE_MAX_AGE_DEFAULT'] = 1
cors = CORS(app, resources={r"/*": {"origins": "*"}})
# @app.route('/')
# def index(): 
#     return render_template('index.html')


@app.route('/tranformer',methods=['POST'])
def tranformer():
    if 'file' not in request.files:
        return 'No file part'

    file = request.files['file']

    if file.filename == '':
        return 'No selected file'

    # Save the file
   
    file.save('static/file.jpg')
    caption=evaluate_single_image("static/file.jpg",tokenizer,loaded_transformer)
    print(caption)
    return jsonify({'caption': caption})


@app.route('/lstm', methods=['POST'])
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
    # img = cv2.resize(img, (224,224))
    img = cv2.resize(img, (224, 224))
    img = np.expand_dims(img, axis=0)  # Add batch dimension
    img = preprocess_input(img) 
    # img = img.reshape(1,224,224,3)
    test_img_resized=ResNet152Model.predict(img).reshape(1,2048)
    # test_img_resized=test_img_resized.reshape(test_img_resized.shape[0], -1)

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