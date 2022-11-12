import React from "react";
import { useState } from "react";

function Postform(props) {
  const [isIMG, setIsIMG] = useState(false);
  const [imgSrc, setImgSrc] = useState("");
  const [isPost, setIsPost] = useState(false);
  const [about, setAbout] = useState(true);

  function handleImage() {
    setIsIMG(true);
    const input = document.querySelector(".choosed-img");
    // const input = event.target.value;
    // console.log(input);
    // setImgSrc(input.files[0].name);
    setImgSrc("image/" + input.files[0].name);
    // console.log(imgSrc);
  }

  function hitPost() {
    setIsPost(true);
    setAbout(false);
  }

  return (
    <div className="post-form">
      <h1>Post Your Creativity</h1>
      {isPost && (
        <div className="post-form-container">
          <form action="/postUpload" method="post">
            <p className="post-form-info">Post Content</p>
            <textarea
              cols="50"
              rows="12"
              className="post-content-input"
              placeholder="Your post content...."
              name="postContent"
            ></textarea>
            <p className="post-form-info">Choose Photo</p>
            {isIMG && (
              <div className="preViewImg">
                <img src={imgSrc} alt="Posting Img" />
              </div>
            )}
            <input
              type="file"
              name="choosedImg"
              className="choosed-img"
              onChange={handleImage}
            />
            <button
              type="submit"
              className="post-btn"
              onClick={() => {
                props.account();
              }}
            >
              Upload
            </button>
          </form>
        </div>
      )}
      {about && (
        <div>
          <img
            className="founder-image"
            src="image/logo2.png"
            alt="Founder's image"
          />
          <h2>Gagan Saini</h2>
          <p className="founder-info">Founder & CEO</p>
          <p className="about-content">
            Impact is a socail media website where you can connect to other
            people and post your activities to create impact in your industry.
          </p>
          <button className="make-post-btn" onClick={hitPost}>
            MAKE POST
          </button>
        </div>
      )}
    </div>
  );
}

export default Postform;
