import React, { useState } from "react";
import test from "../background/test1.jpg";
import test2 from "../background/test2.jpg";
import test3 from "../background/test3.jpg";
import test4 from "../background/test4.jpg";
const LeftBar = ({ onDataFromUser }) => {
  const imageSources = [test, test2, test3, test4];
  const [selectedImage, setSelectedImage] = useState(null);

  const handleImageClick = (index) => {
    setSelectedImage(index);
    onDataFromUser(imageSources[index]);
  };

  return (
    <div className="leftbar">
      <h1 style={{ color: "#008CBA" }}>Testing Image</h1>
      <div className="image-container">
        {imageSources.map((src, index) => (
          <div
            key={index}
            className={`image-wrapper`}
            onClick={() => handleImageClick(index)}
          >
            <img
              src={src}
              alt={`p ${index + 1}`}
              className={`image  ${selectedImage === index ? "selected" : ""}`}
            />
            {selectedImage === index && <div className="tick">&#10004;</div>}
          </div>
        ))}
      </div>
    </div>
  );
};

export default LeftBar;
