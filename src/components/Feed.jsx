import React, { useState, useEffect } from "react";
import CreatePost from "./CreatePost";

function Feed(props) {
  useEffect(() => {
    fetch("/getAllPosts")
      .then((response) => response.json())
      .then((data) => {
        // console.log(data);
        props.setPosts(data);
      });
  }, []);

  // console.log(props.allPosts);

  return (
    <div className="feed-container">
      {typeof props.allPosts.posts !== "undefined" &&
        props.allPosts.posts.map((post, postIndex) => {
          // console.log(post.postContent);
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
    </div>
  );
}

export default Feed;
