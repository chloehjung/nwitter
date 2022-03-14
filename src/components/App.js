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
      } else {
        setIsLoggedIn(false);
      }
      setUserObj(user);
      setInit(true);
    });
  }, []);

  return (
    <>
     {init ? <AppRouter isLoggedIn={isLoggedIn} userObj={userObj} /> : "Initializing"}
     {/* <footer>&copy; {new Date().getFullYear()} Nwitter</footer> */}
    </>
    
  );
}

export default App;
