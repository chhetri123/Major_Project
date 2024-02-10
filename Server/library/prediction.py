from nltk.translate.bleu_score import sentence_bleu, corpus_bleu
import tensorflow as tf
import numpy as np
import pickle
# 
from  library.transformer import Transformer
from library.imageLoad import image_features_extract_model,load_image
from library.self_attention import create_masks_decoder,scaled_dot_product_attention




def evaluate(image,tokenizer,loaded_transformer):
    temp_input = tf.expand_dims(load_image(image)[0], 0)
    img_tensor_val = image_features_extract_model(temp_input)
    img_tensor_val = tf.reshape(img_tensor_val, (img_tensor_val.shape[0], -1, img_tensor_val.shape[3]))

    start_token = tokenizer.word_index['<start>']
    end_token = tokenizer.word_index['<end>']

    #decoder input is start token.
    decoder_input = [start_token]
    output = tf.expand_dims(decoder_input, 0) #tokens
    result = [] #word list

    for i in range(100):
        dec_mask = create_masks_decoder(output)

        # predictions.shape == (batch_size, seq_len, vocab_size)
        predictions, attention_weights = loaded_transformer(img_tensor_val,output,False,dec_mask)

        # select the last word from the seq_len dimension
        predictions = predictions[: ,-1:, :]  # (batch_size, 1, vocab_size)

        predicted_id = tf.cast(tf.argmax(predictions, axis=-1), tf.int32)
        # return the result if the predicted_id is equal to the end token
        if predicted_id == end_token:
            return result,tf.squeeze(output, axis=0), attention_weights
        # concatentate the predicted_id to the output which is given to the decoder
        # as its input.
        result.append(tokenizer.index_word[int(predicted_id)])
        output = tf.concat([output, predicted_id], axis=-1)

    return result,tf.squeeze(output, axis=0), attention_weights


  
# Assuming evaluate function is defined to generate captions
def evaluate_single_image(image_path,tokenizer,loaded_transformer):
    start_token = tokenizer.word_index['<start>']
    end_token = tokenizer.word_index['<end>']
    
    # Evaluate the caption for the given image
    caption, _, _ = evaluate(image_path,tokenizer,loaded_transformer);

    # Remove "<unk>" from the result
    caption = [word for word in caption if word != "<unk>"]

    # Remove <end> from the result
    result_join = ' '.join(caption)
    result_final = result_join.rsplit(' ', 1)[0]

    return result_final
