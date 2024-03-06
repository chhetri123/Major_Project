# Image Captioning in Nepali Language.

This project aims to develop a deep learning-based system mainly focus for image captioning in Nepali languages. The system will take an input image and generate paragraph caption in Nepali Language. The project leverages state-of-the-art deep learning models and techniques to achieve accurate and meaningful results.

## Abstract

The advent of deep neural networks has made the image captioning task more feasible. It is a method of generating text by analyzing the different parts of an image. A lot of tasks related to this have been done in the English language while very little effort is put into this task in other languages, particularly in Nepali language. It is an even harder task to carry out research in the Nepali language because of its difficult grammatical structure and vast language domain. Further, the little work done in the Nepali language is done to generate only a single sentence but we emphasize to generate the paragraph long (3-4) coherent sentences. We used the Stanford human-genome dataset which was translated into Nepali language using the Google Translate API. Along with this, we manually curated a dataset consisting of 800 images of the cultural sites of Nepal along with their Nepali captions. These two datasets were combined to train the deep learning model. The work was carried out on encoder-decoder architecture, with pre-trained CNN (Inception-V3)acting as an encoder that extracts the features from the images, and for the decoder purpose, we have used two architectures LSTM and Transformers to see which architecture works better. We used the BLEU score as an evaluation metric for this research. Experiments showed the transformer works better than LSTM in the case of Nepali language for this captioning task

## Overall Tech Used:

- Model ( `/jupyter notebook`)
  - LSTM
    - RESNET152 ( For Feature Extraction)
  - Transformer
    - Inception-V3 ( For encoder)
- Frontend ( `/Projet UI`)
  - React
  - axios
  - scss
- Backend ( `/Server` & `/Backend`)
  - Flask
  - Python
  - MongoDB
  - Node JS

## Setup Guide

1. Clone the repository.
   **`/Data Collection` folder is heavy**: Be very careful here!

   ```
   git clone https://github.com/chhetri123/Major_Project.git
   ```

2. Once cloned successfully, open this project in your IDE

### Backend ( Trained Model Setup)

1. Once the above steps are done, open the terminal of your IDE and head over to the `\Server`:

   ```
   Cd Server
   ```

2. Then Create the `virutalenv`.

   ```
   # For windows
   python -m venv venv

   <!-- OR -->

   # For macos
   python3 -m venv venv
   ```

3. Activate `virutalenv` using the below command :
   ```
   source venv/bin/activate
   ```
4. Install Require packages

   ```
   # For windows
   pip install -r requirements.txt

   <!-- OR -->

   # For macos
   pip3 install -r requirements.txt
   ```

5. As everything is ready now, we can run the Model as

   ```
   # For windows
   python app.py

   <!-- OR -->

   # For macos
   python3 app.py

   ```

### Frontend Setup

1. Open another terminal and head over into the `\Project UI `:
   ```
   cd  Project UI
   ```
2. Install the require packages:

   ```
   yarn install
   ```

3. And run server:

```
  yarn run dev
```

4. And you can view the page with the url `http://localhost:3000`

## Team Members

<table>
  <tr>
    <td valign="top" align="center">
        <div>
          <img src="https://github.com/chhetri123.png" width="150px;"/><br /><sub><a href="https://github.com/chhetri123">Manish  Chhetri</a>
        </div>
    </td>
    <td valign="top" align="center">
        <div>
          <img src="https://github.com/subedinab.png" width="150px;"/><br /><sub><a href="https://github.com/subedinab">Nabraj Subedi</a>
        </div>
    </td>
    <td valign="top" align="center">
        <div>
          <img src="https://github.com/Nirajan17.png" width="150px;"/><br /><sub><a href="https://github.com/SDPhoton">Nirajan Paudel</a>
        </div>
    </td>
    <!-- <td valign="top" align="center">
        <div>
          <img src="https://github.com/" width="150px;"/><br /><sub><a href="https://github.com/"></a>
        </div>
    </td> -->
</table>

## Contributions and License

Contributions to the project are welcome! If you encounter any issues or have suggestions for improvements, please open an issue or submit a pull request. The project is licensed under the [MIT License](LICENSE).
