import React, { useState, useEffect } from "react";
import User from "./User";
import Post from "./Post";

function Dashboard(props) {
  const [allPosts, setAllPosts] = useState([{}]);
  const [allConnections, setConnections] = useState([{}]);
  const [status, setStatus] = useState("");
  const [contentEdit, setContentEdit] = useState(false);
  const [about, setAbout] = useState(false);
  const [aboutContent, setAboutContent] = useState("");
  const [editSkill, setEditSkill] = useState(false);
  const [allSkills, setAllSkills] = useState([]);
  const [numberOfConnections, setNumberOfConnections] = useState(0);

  useEffect(() => {
    fetch("/accessActivities")
      .then((response) => response.json())
      .then((data) => {
        setAllPosts(data);
      });
  }, []);

  useEffect(() => {
    fetch("/accessConnections")
      .then((response) => response.json())
      .then((data) => {
        // console.log(data);
        setConnections(data.currentUserConnections);
      });
  }, []);

  useEffect(() => {
    fetch("/accessAboutContent")
      .then((response) => response.json())
      .then((data) => {
        // console.log(data);
        setAboutContent(data.userAboutContent);
      });
  }, []);

  useEffect(() => {
    fetch("/accessSkills")
      .then((response) => response.json())
      .then((data) => {
        // console.log(data);
        setAllSkills(data.currentUserSkills);
      });
  }, []);

  useEffect(() => {
    fetch("/accessNumOfConnections")
      .then((response) => response.json())
      .then((data) => {
        setNumberOfConnections(data.numConnections);
      });
  }, []);

  function updateAboutContent() {
    const aboutContent = document.querySelector(".about-input").value;

    fetch("/updateAboutContent", {
      method: "POST",
      body: JSON.stringify({
        userAboutContent: aboutContent,
      }),

      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setAboutContent(data.ans);
      })
      .catch((err) => {
        console.log(err);
      });

    // setAboutContent(aboutContent);
    setAbout(false);
  }

  function addSkill() {
    const skillInput = document.querySelector(".skill-input").value;
    fetch("/addSkill", {
      method: "POST",
      body: JSON.stringify({
        skill: skillInput,
      }),

      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setAllSkills(data.skills);
      })
      .catch((err) => {
        console.log(err);
      });
    setEditSkill(false);
  }

  return (
    <div className="dashboard-container">
      <div className="user-profile-container dashboard-item">
        <div className="user-profile-img">
          <img
            src={props.userDetails.userProfileImage}
            alt="User-Profile-Image"
          />
        </div>
        <div className="user-details">
          <h4>{props.userDetails.userName}</h4>
          <h4>{props.userDetails.userIntro}</h4>
          {/* <h4>{props.userDetails.userEmail}</h4> */}
        </div>
        <div className="followers">
          <h4>Connections</h4>
          <p>{numberOfConnections}</p>
        </div>
        <div
          className="edit-icon"
          onClick={() => {
            setContentEdit(true);
          }}
        >
          <i className="fas fa-pen"></i>
        </div>

        {contentEdit && (
          <div className="edit-section">
            <h1>Edit your profile</h1>
            <textarea
              name="userIntro"
              cols="90"
              rows="12"
              placeholder="User Intro"
              className="user-intro"
            ></textarea>
            <input
              type="file"
              name="userProfileImage"
              className="user-profile-image"
            />
            <button
              className="save-btn"
              onClick={() => {
                const userIntro = document.querySelector(".user-intro").value;
                const userImg = document.querySelector(".user-profile-image")
                  .files[0].name;

                // console.log(userIntro);
                // console.log(userImg);

                fetch("/updateInformation", {
                  method: "POST",
                  body: JSON.stringify({
                    userIntro: userIntro,
                    userImg: userImg,
                  }),

                  headers: {
                    "Content-type": "application/json; charset=UTF-8",
                  },
                })
                  .then((response) => response.json())
                  .then((data) => {
                    setStatus(data.status);
                  })
                  .catch((err) => {
                    console.log(err);
                  });
                setContentEdit(false);
              }}
            >
              Save
            </button>
          </div>
        )}
      </div>
      <section className="dashboard-detail">
        <div className="connections-container dashboard-item">
          <h1>Connections</h1>
          {typeof allConnections !== "undefined" &&
            allConnections.map((item, index) => {
              return (
                <User
                  key={index}
                  src={item.userProfileImage}
                  username={item.userName}
                  userintro={item.userIntro}
                />
              );
            })}
        </div>
        <div className="activity-container dashboard-item">
          <h1>Activities</h1>
          {typeof allPosts.currentUserAllPosts !== "undefined" &&
            allPosts.currentUserAllPosts.map((post, postIndex) => {
              return (
                <Post
                  key={postIndex}
                  src={post.postImgSrc}
                  postContent={post.postContent}
                />
              );
            })}
        </div>
      </section>
      <section className="dashboard-detail">
        <div className="skill-container dashboard-item">
          <h1>Skills</h1>
          <div className="skill-section">
            {allSkills.map((skill, index) => {
              return (
                <p key={index} className="skill-item">
                  {skill}
                </p>
              );
            })}
          </div>
          <div className="add-skill-btn-section">
            {editSkill && (
              <div>
                <input
                  type="text"
                  placeholder="Skill"
                  className="skill-input"
                />
                <button onClick={addSkill}>Add Skill</button>
              </div>
            )}
            <button
              className="add-skill-btn-2"
              onClick={() => {
                setEditSkill(true);
              }}
            >
              +
            </button>
            {/* <button className="add-skill-btn">Add Skill</button> */}
          </div>
        </div>
        <div className="about-container dashboard-item">
          <h1>
            About
            <div
              className="edit-icon"
              onClick={() => {
                setAbout(true);
              }}
            >
              <i className="fas fa-pen"></i>
            </div>
          </h1>
          <div className="about-user">
            <div className="about-section">{aboutContent}</div>
          </div>
          {about && (
            <div className="about-edit-section">
              {/* <input type="text" className="about-input" /> */}
              <textarea
                cols="30"
                rows="10"
                className="about-input"
                placeholder="Your about section."
              ></textarea>
              <button onClick={updateAboutContent} className="about-save-btn">
                Save
              </button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

export default Dashboard;
