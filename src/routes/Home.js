import Nweet from "components/Nweet";
import NweetFactory from "components/NweetFactory";
import { dbService } from "fBase";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import React, { useEffect, useState } from "react";

const Home =  ({userObj}) => {
    
    const [nweets, setNweets] = useState([]);
    
    useEffect(() => {
        return onSnapshot(query(collection(dbService, "nweets"), orderBy("createdAt", "desc")), (snapshot) => {
            const nweetArr = snapshot.docs.map(doc => ({id: doc.id, ...doc.data()}));
            setNweets(nweetArr);
        });
    }, []);
    
    
    return (
        <div className="container">
            <NweetFactory userObj={userObj} />
            <div style={{ marginTop: 30 }}>
                {nweets.map(item => (
                    <Nweet key={item.id} nweet={item} isOwner={item.creatorId === userObj.uid}/>
                ))}
            </div>
        </div>
    );
}

export default Home;