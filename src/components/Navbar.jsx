import React, { useState } from "react";
// import SearchBox from "./Search";

function Navbar(props) {
  const [searchedUsers, setSearchedUsers] = useState([]);
  const [showInvitations, setShowInvitations] = useState([]);
  const [showPendingRequest, setPendingRequest] = useState([]);
  const [showConnections, setConnections] = useState([]);

  function findUsers() {
    const searchedUserName = document.querySelector(".searched-input").value;

    fetch("/findUser", {
      method: "POST",
      body: JSON.stringify({
        username: searchedUserName,
      }),

      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        // console.log(data.users);
        setSearchedUsers(data.users);
        // console.log(searchedUsers);
        props.foundConnections(searchedUsers);
      })
      .catch((err) => {
        console.log(err);
      });

    document.querySelector(".searched-input").value = "";
  }

  function getConnections() {
    fetch("/showConnections")
      .then((response) => response.json())
      .then((data) => {
        setConnections(data.x);
        props.showConnections(showConnections);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  function getPendingRequests() {
    fetch("/showPendingRequest")
      .then((response) => response.json())
      .then((data) => {
        // console.log(data.x);
        setPendingRequest(data.x);
        props.showPendingRequest(showPendingRequest);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  function getInvitations() {
    fetch("/showInvitations")
      .then((response) => response.json())
      .then((data) => {
        // console.log(data.x.length);
        setShowInvitations(data.x);

        // console.log(showInvitations.length);
        props.showInvitations(showInvitations);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  return (
    <div className="navbar-container">
      <div onClick={props.goToHome} className="nav-item logo nav-logo">
        <i className="fas fa-bolt"></i>Impact
      </div>
      <div onClick={props.handleDashboard} className="nav-item dashboard">
        <i className="fas fa-bars"></i>Dashboard
      </div>
      <div className="nav-item search-bar">
        <div className="search-bar-box">
          <input
            type="text"
            name="username"
            placeholder="Search..."
            className="searched-input"
          />
          <i className="fa fa-search" onClick={findUsers}></i>
        </div>
      </div>
      <div className="nav-item connections">
        <ul className="list connection-list">
          <li onClick={getConnections}>
            <i className="fas fa-user"></i>Connections
          </li>
          <li onClick={getPendingRequests}>
            <i className="far fa-clock"></i>Pending Request
          </li>
          <li onClick={getInvitations}>
            <i className="fas fa-envelope"></i>Invitations
          </li>
          <li>
            <i className="fas fa-users"></i>Groups
          </li>
        </ul>
      </div>
      <div className="nav-item streak">
        <ul className="list streak-list">
          <li>
            <i className="fas fa-fire"></i>Current Streak
          </li>
          <li>
            <i className="fas fa-brain"></i>Longest Streak
          </li>
        </ul>
      </div>
      <div className="nav-item social-media">
        <ul className="list social-media-list">
          <li>
            <i className="fab fa-linkedin"></i>Linkedin
          </li>
          <li>
            <i className="fab fa-instagram"></i>Instagram
          </li>
          <li
            onClick={() => {
              props.reportBug();
            }}
          >
            <i className="fas fa-bug"></i>Report Bug
          </li>
          <li
            onClick={() => {
              props.logout();
            }}
          >
            <i className="fas fa-arrow-left"></i>Logout
          </li>
        </ul>
      </div>
    </div>
  );
}

export default Navbar;
