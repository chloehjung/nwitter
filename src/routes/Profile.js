import { authService } from "fBase";
import { getAuth, signOut, updateProfile } from "firebase/auth";
import { query, where, onSnapshot, collection, getFirestore, orderBy } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Profile =  ({userObj, refreshUser}) => {
    let navigate = useNavigate();
    const [newDisplayName, setNewDisplayName] = useState(userObj.displayName);
    const onLogoutClick = () => {
        signOut(getAuth());
        navigate("/", { replace: true });
    }

    useEffect(() => {
        return onSnapshot(query(collection(getFirestore(), "nweets"), where("creatorId", "==", userObj.uid), orderBy("createdAt", "desc") ), (snapshot) => {
            console.log(snapshot.docs.map(doc => ({id: doc.id, ...doc.data()})));
        })
    }, [userObj.uid]);
    const onChange = ({target: {value}}) => {
        setNewDisplayName(value);
    }
    const onSubmit = async (e) => {
        e.preventDefault();
        if(userObj.displayName !== newDisplayName) {
            await updateProfile(authService.currentUser, {displayName: newDisplayName});
            refreshUser();
        }
    }
    return (
        <div className="container"> 
            <form onSubmit={onSubmit} className="profileForm">
                <input type="text" placeholder="Display Name" value={newDisplayName} onChange={onChange} autoFocus className="formInput" />
                <input type="submit" value="Submit" style={{marginTop: 10,}} className="formBtn"/>
            </form>
            <button onClick={onLogoutClick} className="formBtn cancelBtn logOut">Logout</button>
        </div>
    );
}  
export default Profile;