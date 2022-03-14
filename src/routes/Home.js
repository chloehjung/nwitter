import React, { useEffect, useState, useRef } from "react";
import { dbService, storageService } from "fBase";
import { addDoc, collection, onSnapshot, orderBy, query } from "firebase/firestore";
import Nweet from "components/Nweet";
import { getDownloadURL, ref, uploadString } from "firebase/storage";
import {v4} from "uuid";

const Home =  ({userObj}) => {
    const [nweet, setNweet] = useState("");
    const [nweets, setNweets] = useState([]);
    const [attachment, setAttchment] = useState("");
    const fileInput = useRef();
    useEffect(() => {
        return onSnapshot(query(collection(dbService, "nweets"), orderBy("createdAt", "desc")), (snapshot) => {
            const nweetArr = snapshot.docs.map(doc => ({id: doc.id, ...doc.data()}));
            setNweets(nweetArr);
        });
    }, []);
    const clearAttachment = () => {
        setAttchment("");
        if(fileInput.current) fileInput.current.value = null;
    }
    const onSubmit = async (event) => {
        event.preventDefault();
        let attachmentUrl = "";
        if(attachment != "") {
            const attachmentRef = ref(storageService, `${userObj.uid}/${v4()}`);
            const response = await uploadString(attachmentRef, attachment, "data_url");
            attachmentUrl = await getDownloadURL(response.ref);
        }
        const nweetData = {
            nweet,
            createdAt: Date.now(),
            creatorId: userObj.uid,
            attachmentUrl
        }
        await  addDoc(collection(dbService, "nweets"), nweetData);
        setNweet("");
        clearAttachment();
    }
    const onChange = (event) => {
        const { target: {value} } = event;
        setNweet(value);
    }
    const onFileChange = ({target: {files}}) => {
        const file = files[0];
        const reader = new FileReader();
        reader.onloadend = ({currentTarget: { result }}) => {
            setAttchment(result)
        }
        reader.readAsDataURL(file);
    }
    const onClearAttachment = () => {
        clearAttachment();
    }
    return (
        <div>
            <form onSubmit={onSubmit}>
                <input
                    value={nweet}
                    type="text"
                    placeholder="What's on your mind?"
                    maxLength={120}
                    onChange={onChange} />
                <input type="file" accept="image/*" onChange={onFileChange} ref={fileInput} />
                <input type="submit" value="Nweet" />
                {attachment && (
                    <>
                        <img src={attachment} width="50px" height="50px" />
                        <button onClick={onClearAttachment}>Clear</button>
                    </>
                )}
            </form>
            <div>
                {nweets.map(item => (
                    <Nweet key={item.id} nweet={item} isOwner={item.creatorId === userObj.uid}/>
                ))}
            </div>
        </div>
    );
}

export default Home;