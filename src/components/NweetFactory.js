import React, {useState, useRef} from "react";
import { storageService } from "fBase";
import { uploadString, getDownloadURL, ref } from "firebase/storage";
import { addDoc, collection } from "firebase/firestore";
import {v4} from "uuid";
import { dbService } from "fBase";

const NweetFactory = ({userObj}) => {
    const [nweet, setNweet] = useState("");
    const [attachment, setAttchment] = useState("");
    const fileInput = useRef();
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
    )
};

export default NweetFactory;