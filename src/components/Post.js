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
} from "firebase/firestore";
import { db, auth } from "../firebase-config";

import "../css/Post.css";
import { Avatar, IconButton } from "@mui/material";

const Post = ({ username, caption, imageUrl, name, postId, user }) => {
  const [comments, setComments] = useState([]);
  const [comment, setComment] = useState("");

  useEffect(() => {
    // let unsubscribe;
    /*  if (postId) {
      unsubscribe = db
        .collection("posts")
        .doc(postId)
        .collection("comments")
        .onSnapshot((snapshot) => {
          setComments(snapshot.docs.map((doc) => doc.data()));
        });
    }*/

    return () => {
      // unsubscribe();
    };
  }, [postId]);

  const postComment = (e) => {
    e.preventDefault();
    if (comment === "") {
      alert("Please Write Someting to post as comments..!!");
      return;
    }

    db.collection("posts").doc(postId).collection("comments").add({
      text: comment,
      username: user.displayName,
      timestamp: new Date(),
    });
    setComment("");
  };

  return (
    <div className="post">
      <div className="post__header">
        <Avatar className="post__avatar" alt={username} src={imageUrl} />
        <h3>{name}</h3>
      </div>
      <img className="post__image" src={imageUrl} alt="" />
      <h4 className="post__text">
        <strong>{username}</strong> : {caption}
      </h4>

      <div className="post__comments">
        {comments.map((comment) => (
          <p>
            <b>{comment.username}</b> {comment.text}
          </p>
        ))}
      </div>

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
    </div>
  );
};

export default Post;
