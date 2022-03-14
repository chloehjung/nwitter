import { getAuth, signOut } from "firebase/auth";
import { query, where, onSnapshot, collection, getFirestore, orderBy } from "firebase/firestore";
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Profile =  ({userObj}) => {
    let navigate = useNavigate();

    const onLogoutClick = () => {
        signOut(getAuth());
        navigate("/", { replace: true });
    }

    useEffect(() => {
        return onSnapshot(query(collection(getFirestore(), "nweets"), where("creatorId", "==", userObj.uid), orderBy("createdAt", "desc") ), (snapshot) => {
            console.log(snapshot.docs.map(doc => ({id: doc.id, ...doc.data()})));
        })
    }, [userObj.uid]);
    return (
        <>
            <button onClick={onLogoutClick}>Logout</button>
        </>
    );
}  
export default Profile;