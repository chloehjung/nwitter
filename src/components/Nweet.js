import React, { useState } from "react";
import { deleteDoc, doc, getFirestore, updateDoc } from "firebase/firestore";
import { getStorage, ref, deleteObject } from "firebase/storage";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faPencilAlt } from "@fortawesome/free-solid-svg-icons";

const Nweet = ({nweet, isOwner}) => {
    const [editing, setEditing] = useState(false);
    const [newNweet, setNewNweet] = useState(nweet.nweet);
    const onDeleteClick = async () => {
        const ok = window.confirm("Are you sure you want to delete this nweet?");
        if(ok) {
            //delete
            await deleteDoc(doc(getFirestore(), "nweets", nweet.id));
            if(nweet.attachmentUrl) {
                await deleteObject(ref(getStorage(), nweet.attachmentUrl))
            }
        }
    }
    const toggleEditing = () => setEditing(prev => !prev);
    const onSubmit = (e) => {
        e.preventDefault();
        console.log(nweet, newNweet);
        updateDoc(doc(getFirestore(), "nweets", nweet.id), {
            nweet: newNweet
        });
        setEditing(false);
    }
    const onCancel = () => {
        toggleEditing();
        setNewNweet(nweet.nweet);
    }
    return (
        <div className="nweet">
            {
                editing ? (
                    <>
                        <form onSubmit={onSubmit} className="container nweetEdit">
                            <input 
                                type="text" 
                                placeholder="Edit your Nweet" 
                                onChange={({target: {value}}) => setNewNweet(value)}
                                value={newNweet} 
                                autoFocus
                                className="formInput"
                                required />
                            <input type="submit" value="Update Nweet" className="formBtn" />
                        </form>
                        <button onClick={onCancel} className="formBtn cancelBTn">Cancel</button>
                    </>
                ) : (
                    <>
                        <h4>{nweet.nweet}</h4>
                        {nweet.attachmentUrl && <img src={nweet.attachmentUrl} />}
                        {isOwner && 
                            <div className="nweet__actions">
                                <button onClick={onDeleteClick}><FontAwesomeIcon icon={faTrash} /></button>
                                <button onClick={toggleEditing}><FontAwesomeIcon icon={faPencilAlt} /></button>
                            </div>
                        
                        }
                    </>
                )
            }
            
        </div>
    );

}

export default Nweet;