const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const saltRounds = 10;

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));

// fetch se post kerte time use aaya h ye next line
app.use(express.json());
mongoose.connect("mongodb://localhost:27017/postDB");

const postSchema = new mongoose.Schema({
  userName: String,
  userIntro: String,
  postContent: String,
  postImgSrc: String,
  profileImage: String,
  likes: Number,
  comments: [{}],
});

const userSchema = new mongoose.Schema({
  userName: String,
  userEmail: String,
  userIntro: String,
  userProfileImage: String,
  userAboutContent: String,
  password: String,
  allPosts: [{}],
  pendingRequests: [{}],
  invitations: [{}],
  connections: [{}],
  skills: [],
});

const User = new mongoose.model("user", userSchema);
const Post = new mongoose.model("post", postSchema);

// let posts = [];
let currentUser = {
  userName: "",
  userEmail: "",
  userIntro: "",
  userProfileImage: "",
  pendingRequests: [{}],
  invitations: [{}],
  connections: [{}],
};
let haveAccount = false;

app.get("/", function (req, res) {
  res.send("Hello");
});

app.get("/getAllPosts", function (req, res) {
  Post.find({}, function (err, foundPosts) {
    if (err) {
      console.log(err);
    } else {
      // Question -> If I directly pass foundPost in json then its not working
      // but If I pass by using another variable then it's working but HOW ???

      let posts = foundPosts;
      // console.log(posts);
      // I reversed array because last post must be on top.
      posts.reverse();
      res.json({ posts });
    }
  });
});

app.post("/postUpload", function (req, res) {
  User.findOne({ userEmail: currentUser.userEmail }, function (err, foundUser) {
    if (!err) {
      const x = foundUser;

      if (req.body.postContent !== "") {
        const newPost = new Post({
          userName: x.userName,
          userIntro: x.userIntro,
          postContent: req.body.postContent,
          postImgSrc: "image/" + req.body.choosedImg,
          profileImage: x.userProfileImage,
          likes: 0,
        });

        newPost.save();

        // User.findOne(
        //   { userName: currentUser.userName },
        //   function (err, foundUser) {
        //     if (!err) {
        // const y = foundUser;
        x.allPosts.push({
          postImgSrc: newPost.postImgSrc,
          postContent: newPost.postContent,
        });

        x.save();
        //     }
        //   }
        // );
      }
    }
  });
  haveAccount = true;
  res.redirect("/getAllPosts");
});

// app.post("/postUpload", function (req, res) {
//   let x;
//   User.findOne({ userEmail: currentUser.userEmail }, function (err, foundUser) {
//     if (!err) {
//       x = foundUser;
//     }
//   });

//   if (req.body.postContent !== "") {
//     const newPost = new Post({
//       userName: x.userName,
//       userIntro: x.userIntro,
//       postContent: req.body.postContent,
//       postImgSrc: "image/" + req.body.choosedImg,
//       profileImage: x.userProfileImage,
//       likes: 0,
//     });

//     newPost.save();

//     User.findOne({ userName: currentUser.userName }, function (err, foundUser) {
//       if (!err) {
//         const y = foundUser;
//         y.allPosts.push({
//           postImgSrc: newPost.postImgSrc,
//           postContent: newPost.postContent,
//         });

//         y.save();
//       }
//     });
//   }

//   haveAccount = true;
//   res.redirect("/getAllPosts");
// });

app.post("/signIn", function (req, res) {
  bcrypt.hash(req.body.password, saltRounds, function (err, hash) {
    if (!err) {
      const newUser = new User({
        userName: req.body.userName,
        userEmail: req.body.userEmail,
        password: hash,
        // Add all feilds
      });

      // currentUser = newUser;
      currentUser.userName = newUser.userName;
      currentUser.userEmail = newUser.userEmail;
      currentUser.userIntro = "";
      currentUser.userProfileImage = "";
      newUser.save();

      haveAccount = true;
      res.redirect("/getAllPosts");
    } else {
      console.log(err);
    }
  });
});

app.post("/login", function (req, res) {
  // const userEmail = req.body.userEmail;
  // const password = req.body.password;

  User.findOne({ userEmail: req.body.userEmail }, function (err, foundUser) {
    // console.log("Login Requested");

    if (err) {
      console.log(err);
    } else {
      bcrypt.compare(
        req.body.password,
        foundUser.password,
        function (err, result) {
          if (result === true) {
            // console.log(foundUser.password);
            // if (hash === foundUser.password) {
            currentUser.userName = foundUser.userName;
            currentUser.userEmail = foundUser.userEmail;
            currentUser.userIntro = foundUser.userIntro;
            currentUser.userProfileImage = foundUser.userProfileImage;
            haveAccount = true;
            res.redirect("/getAllPosts");
            // }
          }
        }
      );
    }
  });
});

app.get("/isAccountActive", function (req, res) {
  // haveAccount = true;
  res.json({ haveAccount });
});

app.get("/logout", function (req, res) {
  haveAccount = false;
  res.json({ haveAccount });
});

app.get("/currentUser", function (req, res) {
  User.findOne({ userEmail: currentUser.userEmail }, function (err, foundUser) {
    if (!err) {
      const ans = foundUser;
      res.json({ ans });
    }
  });
});

app.get("/accessActivities", function (req, res) {
  // console.log("Access Activities");
  // console.log(currentUser);
  User.findOne({ userEmail: currentUser.userEmail }, function (err, foundUser) {
    console.log(foundUser);
    if (!err) {
      let currentUserAllPosts = foundUser.allPosts;
      currentUserAllPosts.reverse();
      res.json({ currentUserAllPosts });
    }
  });
});

app.get("/accessConnections", function (req, res) {
  User.findOne({ userEmail: currentUser.userEmail }, function (err, foundUser) {
    // console.log(foundUser);
    if (!err) {
      let currentUserConnections = foundUser.connections;
      res.json({ currentUserConnections });
    }
  });
});

app.get("/accessAboutContent", function (req, res) {
  User.findOne({ userEmail: currentUser.userEmail }, function (err, foundUser) {
    // console.log(foundUser);
    let userAboutContent = foundUser.userAboutContent;

    res.json({ userAboutContent });
  });
});

app.get("/accessSkills", function (req, res) {
  User.findOne({ userEmail: currentUser.userEmail }, function (err, foundUser) {
    // console.log(foundUser);
    let currentUserSkills = foundUser.skills;

    res.json({ currentUserSkills });
  });
});

app.post("/getLikes", function (req, res) {
  // console.log(req.body.postSrc);
  // res.json({});

  const clickedPostSrc = req.body.postSrc;
  const isLike = req.body.isLike;

  Post.findOne({ postImgSrc: clickedPostSrc }, function (err, foundPost) {
    if (!err) {
      // console.log(foundPost);
      let x = foundPost;

      if (isLike == true) {
        x.likes = x.likes - 1;
      } else {
        x.likes = x.likes + 1;
      }

      x.save();
      let totalLikes = x.likes;
      res.json({ totalLikes });
    }
  });
});

app.post("/addComment", function (req, res) {
  const clickedPostSrc = req.body.postSrc;
  const commentValue = req.body.valueOfComment;
  const postingUserName = currentUser.userName;
  // console.log(currentUser.userName);

  Post.findOne({ postImgSrc: clickedPostSrc }, function (err, foundPost) {
    if (!err) {
      let x = foundPost;
      // console.log(x);
      // console.log("Comments");
      // console.log(x.comments);
      x.comments.push({ postingUserName, commentValue });
      x.save();
      let allComments = x.comments;

      // console.log(x.comments);
      res.json({ allComments });
    }
  });
});

app.post("/getAllComments", function (req, res) {
  const clickedPostSrc = req.body.postSrc;

  Post.findOne({ postImgSrc: clickedPostSrc }, function (err, foundPost) {
    if (!err) {
      let x = foundPost;
      let allComments = x.comments;

      // console.log(allComments);
      res.json({ allComments });
    }
  });
});

app.post("/findUser", function (req, res) {
  const username = req.body.username;

  // console.log(req.body);

  User.find({ userName: username }, function (err, foundUsers) {
    if (!err) {
      // console.log(foundUsers);
      let users = [];
      for (let i = 0; i < foundUsers.length; i++) {
        const x = foundUsers[i];
        const user = {
          userName: x.userName,
          userEmail: x.userEmail,
          userIntro: x.userIntro,
          userProfileImage: x.userProfileImage,
        };

        users.push(user);
      }

      // console.log(users);
      res.json({ users });
    }
  });
});

app.post("/makeConnection", function (req, res) {
  const receiver = req.body.receiver;
  const sender = {
    userProfileImage: currentUser.userProfileImage,
    userName: currentUser.userName,
    userIntro: currentUser.userIntro,
    userEmail: currentUser.userEmail,
  };

  // console.log("Receiver");
  // console.log(receiver);
  // console.log("Sender");
  // console.log(sender);

  User.findOne({ userEmail: receiver.userEmail }, function (err, foundUser) {
    if (err) {
      console.log(err);
    } else {
      const x = foundUser;
      x.invitations.push(sender);
      x.save();
    }
  });

  User.findOne({ userEmail: sender.userEmail }, function (err, foundUser) {
    if (err) {
      console.log(err);
    } else {
      const x = foundUser;
      x.pendingRequests.push(receiver);
      x.save();
    }
  });
  // receiver.pendingRequests.push(sender);

  const status = "Pending";
  res.json({ status });

  // Recevier ke pending request array me sender ka {name,intro,email} ko push kerna h
  // And Sender ke bhi same pending connection me show kerdeta hu.
});

app.get("/showInvitations", function (req, res) {
  User.findOne({ userEmail: currentUser.userEmail }, function (err, foundUser) {
    if (!err) {
      const x = foundUser.invitations;
      res.json({ x });
    }
  });
});

app.get("/showPendingRequest", function (req, res) {
  User.findOne({ userEmail: currentUser.userEmail }, function (err, foundUser) {
    if (!err) {
      const x = foundUser.pendingRequests;
      // console.log("Pending Requests");
      // console.log(x);
      res.json({ x });
    }
  });
});

app.get("/showConnections", function (req, res) {
  User.findOne({ userEmail: currentUser.userEmail }, function (err, foundUser) {
    if (!err) {
      const x = foundUser.connections;
      res.json({ x });
    }
  });
});

app.post("/acceptConnectionRequest", function (req, res) {
  const user = req.body.user;
  // currentUser.connections.push(user);

  User.findOne({ userEmail: currentUser.userEmail }, function (err, foundUser) {
    if (!err) {
      const x = foundUser;
      x.connections.push(user);
      removeRequest(x.invitations, user);

      x.save();
    }
  });

  // I also have to update connections array of user (which is  got from post request)
  // Updating connection array of user.

  const currentUserDetails = {
    userProfileImage: currentUser.userProfileImage,
    userName: currentUser.userName,
    userEmail: currentUser.userEmail,
    userIntro: currentUser.userIntro,
  };

  User.findOne({ userEmail: user.userEmail }, function (err, foundUser) {
    if (err) {
      console.log(err);
    } else {
      const x = foundUser;
      x.connections.push(currentUserDetails);

      removeRequest(x.pendingRequests, currentUser);
      x.save();
    }
  });

  const status = "ADDED";
  res.json({ status });
});

app.post("/ignoreConnectionRequest", function (req, res) {
  const user = req.body.user;
  // currentUser.connections.push(user);

  User.findOne({ userEmail: currentUser.userEmail }, function (err, foundUser) {
    if (!err) {
      const x = foundUser;
      removeRequest(x.invitations, user);

      x.save();
    }
  });

  // I also have to update connections array of user (which is  got from post request)
  // Updating connection array of user

  User.findOne({ userEmail: user.userEmail }, function (err, foundUser) {
    if (err) {
      console.log(err);
    } else {
      const x = foundUser;
      // x.connections.push(currentUser);

      removeRequest(x.pendingRequests, currentUser);
      x.save();
    }
  });

  const status = "REMOVED";
  res.json({ status });
});

function removeRequest(arr, keyUser) {
  // Delete from pendingRequest array
  let pos = 0;
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] === keyUser) {
      pos = i;
      break;
    }
  }

  // moving object to one step towards left
  for (let i = pos; i < arr.length - 1; i++) {
    arr[i] = arr[i + 1];
  }

  // To remove last duplicate
  // console.log(arr);
  arr.pop();
}

app.post("/updateInformation", function (req, res) {
  const userIntro = req.body.userIntro;
  const userImg = "image/" + req.body.userImg;

  // Changes must held in currentUser.
  // currentUser.userProfileImage = userImg;
  // currentUser.userIntro = userIntro;

  User.findOne({ userEmail: currentUser.userEmail }, function (err, foundUser) {
    if (err) {
      console.log(err);
    } else {
      const newUser = foundUser;
      newUser.userIntro = userIntro;
      newUser.userProfileImage = userImg;

      newUser.save();
    }
  });

  const status = "Information updated";
  res.json({ status });
});

app.post("/updateAboutContent", function (req, res) {
  User.findOne({ userEmail: currentUser.userEmail }, function (err, foundUser) {
    if (!err) {
      const x = foundUser;
      x.userAboutContent = req.body.userAboutContent;
      x.save();

      const ans = x.userAboutContent;
      res.json({ ans });
    }
  });
});

app.post("/addSkill", function (req, res) {
  const currentSkill = req.body.skill;
  User.findOne({ userEmail: currentUser.userEmail }, function (err, foundUser) {
    if (!err) {
      const x = foundUser;
      x.skills.push(currentSkill);

      x.save();

      const skills = x.skills;
      res.json({ skills });
    }
  });
});

app.get("/accessNumOfConnections", function (req, res) {
  // let numConnetions;

  User.findOne({ userEmail: currentUser.userEmail }, function (err, foundUser) {
    if (!err) {
      const x = foundUser;
      const numConnections = x.connections.length;
      // console.log(numConnections);

      res.json({ numConnections });
    }
  });
});

app.listen(5000, () => {
  console.log("Server is running at port 5000");
});
