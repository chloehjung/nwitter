import React, {useState, useRef} from "react";
import { storageService } from "fBase";
import { uploadString, getDownloadURL, ref } from "firebase/storage";
import { addDoc, collection } from "firebase/firestore";
import {v4} from "uuid";
import { dbService } from "fBase";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faTimes } from "@fortawesome/free-solid-svg-icons";

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
        if (nweet === "") {
            return;
        }
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
        <form onSubmit={onSubmit} className="factoryForm">
            <div className="factoryInput__container">
                <input
                    className="factoryInput__input"
                    value={nweet}
                    type="text"
                    placeholder="What's on your mind?"
                    maxLength={120}
                    onChange={onChange} />
                <input type="submit" value="&rarr;" className="factoryInput__arrow" />
            </div>
            <label htmlFor="attach-file" className="factoryInput__label">
                <span>Add photos</span>
                <FontAwesomeIcon icon={faPlus} />
            </label>
            <input
                id="attach-file"
                type="file"
                accept="image/*"
                onChange={onFileChange}
                style={{
                    opacity: 0,
                }}
                ref={fileInput}
            />
            {attachment && (
                <div className="factoryForm__attachment">
                    <img
                    src={attachment}
                    style={{
                        backgroundImage: attachment,
                    }}
                    />
                    <div className="factoryForm__clear" onClick={onClearAttachment}>
                    <span>Remove</span>
                    <FontAwesomeIcon icon={faTimes} />
                    </div>
                </div>
            )}
        </form>
    )
};

export default NweetFactory;