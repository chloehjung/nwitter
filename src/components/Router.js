import React from "react";
import { HashRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import Profile from "routes/Profile";
import Auth from "../routes/Auth";
import Home from "../routes/Home";
import Navigation from "./Navigation";

const AppRouter = ({isLoggedIn, userObj, refreshUser}) => {

    return (
        <Router>
            {isLoggedIn && <Navigation userObj={userObj} />}
            <Routes>
                
                {isLoggedIn ? 
                    <>
                        <Route exact path="/" element={<Home userObj={userObj} />}  />
                        <Route exact path="/profile" element={<Profile userObj={userObj} refreshUser={refreshUser} />} />
                    </>
                    : <>
                        <Route exact path="/" element={<Auth />} />
                        <Route path="*" element={<Navigate replace to="/" />} />
                    </>}
            </Routes>
        </Router>
    );
}

export default AppRouter;