import React, { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  setDoc,
  orderBy,
  OrderByDirection,
  doc,
  QuerySnapshot,
  getDocsFromServer,
  query,
  onSnapshot,
  serverTimestamp,
} from "firebase/firestore";
import { db, auth } from "../firebase-config";

import "../css/Post.css";
import { Avatar, IconButton } from "@mui/material";

const Post = ({ username, caption, imageUrl, name, postId, user }) => {
  const [comments, setComments] = useState([]);
  const [comment, setComment] = useState("");

  useEffect(async () => {
    //Fully working code with real-time updates
    const q2 = query(
      collection(db, "posts", postId + "/comments"),
      orderBy("timestamp", "desc")
    );
    const subscribe = onSnapshot(q2, (querySnapshot) => {
      querySnapshot.docs.map((doc) => {
        setComments(querySnapshot.docs.map((doc) => doc.data()));
        console.log("Real-time Data : ", doc.data());
      });
    });

    //Fully working code on refresh..
    /* const querySnapshot = await getDocs(q2);
    setComments(querySnapshot.docs.map((doc) => doc.data()));
    querySnapshot.forEach((doc) => {
      console.log(doc.data());
    });*/

    return () => {
      subscribe();
    };
  }, [postId]);

  const postComment = (e) => {
    e.preventDefault();
    if (comment === "") {
      alert("Please Write Someting to post as comments..!!");
      return;
    }

    const docRef = addDoc(collection(db, "posts", postId + "/comments"), {
      text: comment,
      username: user.displayName,
      timestamp: serverTimestamp(),
    });

    setComment("");
  };

  return (
    <div className="post">
      <div className="post__header">
        <Avatar className="post__avatar" alt={username} src={imageUrl} />
        <h3>{"@" + name}</h3>
      </div>
      <img className="post__image" src={imageUrl} alt="" />
      <h4 className="post__text">
        <strong>{"@" + username}</strong> : {caption}
      </h4>

      <div className="post__comments">
        {comments.map((comment) => (
          <p>
            <b>{comment.username}</b> {comment.text}
          </p>
        ))}
      </div>

      {user && (
        <form className="post__commentBox">
          <input
            className="post__input"
            type="text"
            placeholder="Add a comment.."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
          <button
            className="post__button"
            disabled={!comment}
            type="submit"
            onClick={postComment}
          >
            Post
          </button>
        </form>
      )}
    </div>
  );
};

export default Post;
