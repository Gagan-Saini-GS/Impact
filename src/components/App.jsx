import React, { useState, useEffect } from "react";
import Navbar from "./Navbar";
import Dashboard from "./Dashboard";
import Feed from "./Feed";
import Postform from "./Postform";
import Login from "./Login";
import User from "./User";
import Founduser from "./FoundUser";
import InviteCard from "./InviteCard";
import ReportBug from "./ReportBug";

function App() {
  const [showFeed, setShowFeed] = useState(true);
  const [isLogin, setLogin] = useState(false);
  const [foundUsers, setFoundUsers] = useState(false);
  const [checkConnections, setCheckConnections] = useState(false);
  const [checkInvitations, setCheckInvitations] = useState(false);
  const [checkPendingRequest, setCheckPendingRequest] = useState(false);
  const [currentUser, setCurrUser] = useState({});
  const [searchedUsers, setSearchedUsers] = useState([]);
  const [invitations, setInvitations] = useState([]);
  const [connections, setConnections] = useState([]);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [showBugPage, setShowBugPage] = useState(false);

  useEffect(() => {
    fetch("/isAccountActive")
      .then((response) => response.json())
      .then((data) => {
        setLogin(data.haveAccount);
      });
  }, []);

  function account() {
    fetch("/isAccountActive")
      .then((response) => response.json())
      .then((data) => {
        setLogin(data.haveAccount);
      });
  }

  function handleDashboard() {
    setShowFeed(false);
    setFoundUsers(false);
    setCheckConnections(false);
    setCheckInvitations(false);
    setCheckPendingRequest(false);
    setShowBugPage(false);
    getUserDetails();
  }

  function goToHome() {
    setShowFeed(true);
  }

  function login() {
    setLogin(!isLogin);
  }

  const [user, setUser] = useState({});
  // userName: "",
  // userEmail: "",
  // userIntro: "",
  // userProfileImage: "",

  function getUserDetails() {
    fetch("/currentUser")
      .then((response) => response.json())
      .then((data) => {
        // console.log(data.ans);
        setUser(data.ans);
      });
  }

  useEffect(() => {
    getUserDetails();
  }, []);

  function logout() {
    fetch("/logout")
      .then((response) => response.json())
      .then((data) => {
        setLogin(data.haveAccount);
      });
  }

  function foundConnections(arr) {
    setFoundUsers(true);
    setShowFeed(false);

    setSearchedUsers(arr);
    // console.log(arr);
  }

  function showUserDetails(curr) {
    // console.log(curr);
    setCurrUser(curr);
  }

  function showConnections(arr) {
    setShowFeed(false);
    setFoundUsers(false);
    setCheckConnections(true);
    setCheckInvitations(false);
    setCheckPendingRequest(false);
    setShowBugPage(false);
    // console.log(arr);
    setConnections(arr);
  }

  function showInvitations(arr) {
    // console.log(arr);
    setShowFeed(false);
    setFoundUsers(false);
    setCheckConnections(false);
    setCheckInvitations(true);
    setShowBugPage(false);
    setCheckPendingRequest(false);
    setInvitations(arr);
  }

  function showPendingRequest(arr) {
    // console.log(arr);
    setShowFeed(false);
    setFoundUsers(false);
    setCheckConnections(false);
    setCheckInvitations(false);
    setShowBugPage(false);
    setCheckPendingRequest(true);
    setPendingRequests(arr);

    // console.log(pendingRequests.length);
  }

  function reportBug() {
    console.log("Reporting bug in impact.");
    setShowFeed(false);
    setFoundUsers(false);
    setCheckConnections(false);
    setCheckInvitations(false);
    setCheckPendingRequest(false);
    setShowBugPage(true);
  }

  return (
    <div>
      {!isLogin ? (
        <Login login={login} account={account} />
      ) : (
        <div className="app-container">
          <Navbar
            handleDashboard={handleDashboard}
            goToHome={goToHome}
            logout={logout}
            foundConnections={foundConnections}
            showConnections={showConnections}
            showInvitations={showInvitations}
            showPendingRequest={showPendingRequest}
            reportBug={reportBug}
          />
          {showFeed ? (
            <Feed account={account} />
          ) : foundUsers ? (
            <div className="found-users-main-container">
              <div className="found-users-container">
                {searchedUsers.length !== 0 &&
                  searchedUsers.map((item, index) => {
                    return (
                      <div
                        onClick={() => {
                          const temp = {
                            imgSrc: item.userProfileImage,
                            name: item.userName,
                            intro: item.userIntro,
                            email: item.userEmail,
                          };
                          showUserDetails(temp);
                        }}
                        className="found-user"
                      >
                        <User
                          key={index}
                          src={item.userProfileImage}
                          username={item.userName}
                          userintro={item.userIntro}
                          // useremail={item.userEmail}
                        />
                      </div>
                    );
                  })}
              </div>
              <div className="user-details-container">
                {typeof currentUser !== "undefined" && (
                  <Founduser
                    userProfileImage={currentUser.imgSrc}
                    userName={currentUser.name}
                    userIntro={currentUser.intro}
                    userEmail={currentUser.email}
                  />
                )}
              </div>
            </div>
          ) : checkInvitations ? (
            <div className="box">
              {invitations.length !== 0 ? (
                invitations.map((item, index) => {
                  console.log(item);
                  return (
                    <InviteCard
                      key={index}
                      imgSrc={item.userProfileImage}
                      userName={item.userName}
                      userEmail={item.userEmail}
                      userIntro={item.userIntro}
                      type="invitation"
                    />
                  );
                })
              ) : (
                <h1>No Invitations !</h1>
              )}
            </div>
          ) : checkPendingRequest ? (
            <div className="box">
              {pendingRequests.length !== 0 ? (
                pendingRequests.map((item, index) => {
                  return (
                    <InviteCard
                      key={index}
                      imgSrc={item.userProfileImage}
                      userName={item.userName}
                      userEmail={item.userEmail}
                      userIntro={item.userIntro}
                      type="request"
                    />
                  );
                })
              ) : (
                <h1>No Pending Request !</h1>
              )}
            </div>
          ) : checkConnections ? (
            <div className="box">
              {connections.length !== 0 ? (
                connections.map((item, index) => {
                  return (
                    <InviteCard
                      key={index}
                      imgSrc={item.userProfileImage}
                      userName={item.userName}
                      userEmail={item.userEmail}
                      userIntro={item.userIntro}
                      type="connection"
                    />
                  );
                })
              ) : (
                <h1>No Connections !</h1>
              )}
            </div>
          ) : showBugPage ? (
            <ReportBug />
          ) : (
            <Dashboard userDetails={user} />
          )}
          {showFeed && <Postform account={account} />}
        </div>
      )}
    </div>
  );
}

export default App;
