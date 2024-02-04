import React, { useState } from "react";
import ImageUploading from "react-images-uploading";

export default function App() {
  const [images, setImages] = useState([]);
  const maxNumber = 1;

  const onChange = (imageList, addUpdateIndex) => {
    setImages(imageList);
  };

  return (
    <div className="app-container">
      <ImageUploading
        multiple={false}
        value={images}
        onChange={onChange}
        maxNumber={maxNumber}
        dataURLKey="data_url"
      >
        {({
          imageList,
          onImageUpload,
          onImageRemoveAll,
          onImageUpdate,
          onImageRemove,
          isDragging,
          dragProps,
        }) => (
          <div className="upload-container">
            <button
              className={`upload-btn ${isDragging ? "dragging" : ""}`}
              onClick={onImageUpload}
              {...dragProps}
            >
              {isDragging ? "Drop Image Here" : "Click or Drop Image Here"}
            </button>
            <button className="remove-all-btn" onClick={onImageRemoveAll}>
              Remove All Images
            </button>
            <div className="image-list">
              {imageList.map((image, index) => (
                <div key={index} className="image-item">
                  <img
                    src={image["data_url"]}
                    alt=""
                    className="uploaded-image"
                  />
                  <div className="image-btn-wrapper">
                    <button onClick={() => onImageUpdate(index)}>Update</button>
                    <button onClick={() => onImageRemove(index)}>Remove</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </ImageUploading>
    </div>
  );
}
