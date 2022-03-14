import React, { useEffect, useState } from 'react';
import AppRouter from 'components/Router';
import { authService } from 'fBase';
import { onAuthStateChanged } from 'firebase/auth';

function App() {
  const [init, setInit] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(authService.currentUser);
  const [userObj, setUserObj] = useState(null);
  useEffect(() => {
    onAuthStateChanged(authService, function(user) {
      if(user) {
        setIsLoggedIn(true);
        setUserObj({
          displayName: user.displayName,
          uid: user.uid
        });
      } else {
        setIsLoggedIn(false);
        setUserObj(null);
      }
      setInit(true);
    });
  }, []);
  const refreshUser = () => {
    let user = authService.currentUser;
    setUserObj({
      displayName: user.displayName,
      uid: user.uid
    });
    console.log(authService.currentUser)
  }
  return (
    <>
     {init ? <AppRouter isLoggedIn={isLoggedIn} userObj={userObj} refreshUser={refreshUser} /> : "Initializing"}
     {/* <footer>&copy; {new Date().getFullYear()} Nwitter</footer> */}
    </>
    
  );
}

export default App;
