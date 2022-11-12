import React, { useState } from "react";
import Post from "./Post";
import User from "./User";
import Postuser from "./Postuser";
import postDetails from "../postDetails";

function CreatePost(props) {
  const [isLiked, setLike] = useState(false);
  const [countLikes, setCountLikes] = useState(props.likes);
  const [showComments, setShowComments] = useState(false);
  const [addComment, setAddComments] = useState([{}]);

  function postComment(commentValue) {
    fetch("/addComment", {
      method: "POST",
      body: JSON.stringify({
        postSrc: props.postSrc,
        valueOfComment: commentValue,
      }),

      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        // console.log(data.allComments);
        setAddComments(data.allComments);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  return (
    <div className="created-post">
      <Postuser
        src={props.src}
        username={props.username}
        userintro={props.userintro}
        postContent={props.postContent}
        postSrc={props.postSrc}
      />
      <div className="response-container">
        {isLiked ? (
          <div>
            <i
              onClick={(event) => {
                setLike(!isLiked);
                event.target.style.color = "#fffaff";

                fetch("/getLikes", {
                  // Adding method type
                  method: "POST",

                  // Adding body or contents to send
                  body: JSON.stringify({
                    postSrc: props.postSrc,
                    isLike: true,
                  }),

                  // Adding headers to the request
                  headers: {
                    "Content-type": "application/json; charset=UTF-8",
                  },
                })
                  .then((response) => response.json())
                  .then((data) => {
                    // console.log(data.totalLikes);
                    console.log(countLikes);
                    setCountLikes(data.totalLikes);
                    console.log(countLikes);
                  })
                  .catch((err) => {
                    console.log(err);
                  });
              }}
              className="fas fa-heart"
            ></i>
            <span className="like-count">
              {countLikes > 0 ? countLikes : null}
            </span>
          </div>
        ) : (
          <div>
            <i
              onClick={(event) => {
                // console.log(props.postSrc);
                setLike(!isLiked);
                event.target.style.color = "red";

                fetch("/getLikes", {
                  // Adding method type
                  method: "POST",

                  // Adding body or contents to send
                  body: JSON.stringify({
                    postSrc: props.postSrc,
                    isLike: false,
                  }),

                  // Adding headers to the request
                  headers: {
                    "Content-type": "application/json; charset=UTF-8",
                  },
                })
                  .then((response) => response.json())
                  .then((data) => {
                    // console.log(data.totalLikes);
                    console.log(countLikes);
                    setCountLikes(data.totalLikes);
                    console.log(countLikes);
                  })
                  .catch((err) => {
                    console.log(err);
                  });
              }}
              className="far fa-heart"
            ></i>
            <span className="like-count">
              {countLikes > 0 ? countLikes : null}
            </span>
          </div>
        )}

        <div className="comment-section">
          <input type="text" placeholder="Comment" className="comment-input" />
          <button
            type="submit"
            onClick={() => {
              // console.log(props.id);
              const commentValue =
                document.querySelectorAll(".comment-input")[props.id - 1].value;
              postComment(commentValue);
              document.querySelectorAll(".comment-input")[props.id - 1].value =
                "";
            }}
            className="post-comment-btn"
          >
            Post
          </button>
          <p
            onClick={() => {
              console.log(showComments);
              fetch("/getAllComments", {
                method: "POST",
                body: JSON.stringify({
                  postSrc: props.postSrc,
                }),

                headers: {
                  "Content-type": "application/json; charset=UTF-8",
                },
              })
                .then((response) => response.json())
                .then((data) => {
                  console.log(data.allComments);
                  setAddComments(data.allComments);
                  console.log(addComment);
                })
                .catch((err) => {
                  console.log(err);
                });
              setShowComments(!showComments);
            }}
            className="comments-logo"
          >
            C
          </p>
        </div>
      </div>
      <div className="show-comment-section">
        {showComments &&
          addComment.map((item, index) => {
            return (
              <div className="posted-comment" key={index}>
                <h4>{item.postingUserName}</h4>
                {item.commentValue}
              </div>
            );
          })}
      </div>
      <p className="border-line"></p>
    </div>
  );
}

export default CreatePost;
