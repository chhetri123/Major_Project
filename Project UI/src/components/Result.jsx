// eslint-disable-next-line

import React, { useEffect, useState, useRef } from "react";
import Loader from "./Loader";
import "../bgvid.mp4";
import { useSpeechSynthesis } from "react-speech-kit";
import TransButton from "./TransButton";
import Upload from "./Upload";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const Result = (props) => {
  const [preview, setPreview] = useState();
  const [caption, setCaption] = useState(); // Changing caption on UI
  const [cap, setCap] = useState(); // Constant caption
  const { speak } = useSpeechSynthesis();
  const [bool1, setBool] = useState(false);
  const [error, setError] = useState("");
  const textToCopyRef = useRef(null);
  const handleListen = () => {
    speak({ text: caption });
  };

  const copyToClipboard = () => {
    if (textToCopyRef.current) {
      textToCopyRef.current.select();
      document.execCommand("copy");
      window.getSelection().removeAllRanges(); // Clear the selection after copying
    }
  };

  const callback = (lang) => {
    setCaption(lang);
  };

  useEffect(() => {
    setPreview(URL.createObjectURL(props.img));
    async function fetchCaption() {
      const formData = new FormData();
      formData.append("file", props.img);

      // console.log("hi");
      try {
        const link = "http://localhost:5000/";
        const url =
          props.model === "LSTM" ? link + "lstm" : link + "tranformer";
        console.log(url);
        const response = await fetch(url, {
          method: "Post",
          body: formData,
        });
        setError("");
        const data = await response.json();
        setCaption(data.caption);
        setCap(data.caption);
      } catch (err) {
        setError(err.message);
      }
    }
    fetchCaption();
  }, [props.img]);
  const handleClick = () => {
    setBool(true);
  };

  let navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <>
      {!bool1 && (
        <div className="result-page">
          {localStorage.getItem("token") && (
            <button
              onClick={handleLogout}
              className="result-logout"
              style={{ position: "absolute", right: "118px", top: "27px" }}
            >
              Logout
            </button>
          )}
          {/* <video id="bg-video" src="../bgvid.mp4" autoplay loop muted></video> */}
          <div className="result-window" style={{ position: "reative" }}>
            <button
              style={{ color: "black", marginLeft: "-31rem" }}
              className="result-logout"
              onClick={handleClick}
            >
              Go back
            </button>
            <h1 className="result-heading">Predicting from {props.model}</h1>
            {preview && (
              <img
                className="result-image"
                style={{ border: "2px solid #2ecc71" }}
                src={preview}
                alt=""
              />
            )}
            <hr
              style={{
                height: "1px",
                width: "100%",
                // backgroundColor: "#2ecc71",
                color: "blue",
              }}
            />
            {error ? (
              <div className="result-caption error">{error}</div>
            ) : (
              <>
                {caption ? (
                  <p className="result-caption">{caption}</p>
                ) : (
                  <Loader />
                )}
              </>
            )}
            <div className="extra-button">
              {localStorage.getItem("token") && (
                <button className="text-to-speech-btn" onClick={handleListen}>
                  Convert text to speech
                </button>
              )}
              {localStorage.getItem("token") && (
                <TransButton callback={callback} cap={cap} />
              )}
            </div>
            {!localStorage.getItem("token") && (
              <Link to="/login">Sign in to translate and hear the caption</Link>
            )}
          </div>
        </div>
      )}

      {bool1 && <Upload />}
    </>
  );
};

export default Result;
