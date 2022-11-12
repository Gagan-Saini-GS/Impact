import React, { useState, useEffect } from "react";
import CreatePost from "./CreatePost";
import Postform from "./Postform";

function Feed(props) {
  const [allPosts, setAllPosts] = useState([{}]);

  useEffect(() => {
    fetch("/getAllPosts")
      .then((response) => response.json())
      .then((data) => {
        // console.log(data);
        setAllPosts(data);
      });
  }, []);

  function getPosts() {
    fetch("/getAllPosts")
      .then((response) => response.json())
      .then((data) => {
        // console.log(data);
        setAllPosts(data);
      })
      .then(() => {
        props.account();
      })
      .catch((err) => {
        console.log(err);
      });
  }
  // I remove [] from "},[]);" last line to fetch every time when its updated..

  return (
    <div className="feed-container">
      {typeof allPosts.posts !== "undefined" &&
        allPosts.posts.map((post, postIndex) => {
          return (
            <CreatePost
              key={postIndex}
              id={postIndex + 1}
              src={post.profileImage}
              username={post.userName}
              userintro={post.userIntro}
              postContent={post.postContent}
              postSrc={post.postImgSrc}
              likes={post.likes}
            />
          );
        })}
      {/* {postDetails.map((item, index) => {
        return (
          <CreatePost
            key={index}
            id={item.id}
            src={item.src}
            username={item.username}
            userintro={item.userintro}
            postContent={item.postContent}
            postSrc={item.postSrc}
          />
        );
      })} */}
    </div>
  );
}

export default Feed;
