import React, { useState } from "react";
import { deleteDoc, doc, getFirestore, updateDoc } from "firebase/firestore";
import { getStorage, ref, deleteObject } from "firebase/storage";

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
        <div>
            {
                editing ? (
                    <>
                        <form onSubmit={onSubmit}>
                            <input 
                                type="text" 
                                placeholder="Edit your Nweet" 
                                onChange={({target: {value}}) => setNewNweet(value)}
                                value={newNweet} 
                                required />
                            <input type="submit" value="Update Nweet" />
                        </form>
                        <button onClick={onCancel}>Cancel</button>
                    </>
                ) : (
                    <>
                        <h4>{nweet.nweet}</h4>
                        {nweet.attachmentUrl && <img src={nweet.attachmentUrl} width="50px" height="50px" />}
                        {isOwner && 
                            <>
                                <button onClick={toggleEditing}>Edit</button>
                                <button onClick={onDeleteClick}>Delete</button>
                            </>
                        
                        }
                    </>
                )
            }
            
        </div>
    );

}

export default Nweet;