import { Button } from "@mui/material";
import { FirebaseError } from "firebase/app";
import {
  getFirestore,
  FieldValue,
  Timestamp,
  serverTimestamp,
  collection,
  addDoc,
  Firestore,
} from "firebase/firestore";
import React, { useState } from "react";
import { db, auth, storage } from "../firebase-config";
import {
  getStorage,
  ref,
  getBytes,
  getDownloadURL,
  uploadBytes,
  bytesTransferred,
  totalBytes,
  uploadBytesResumable,
} from "firebase/storage";
import "../css/ImageUpload.css";

const ImageUpload = ({ username }) => {
  const [image, setImage] = useState([]);
  const [url, setUrl] = useState("");
  const [progress, setProgress] = useState(0);
  const [caption, setCaption] = useState("");

  const handleChange = (e) => {
    if (e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const currentTime = () => {
    if (!Date.now) {
    }
  };

  const handleUpload = async () => {
    // const uploadTask = ref(storage, `images/${image.name}`).put(image);
    //uploadBytes(uploadTask, image[0]).then((snapshot) => {});

    if (caption === "" || image === null || image[0] === null) {
      alert("Please Write Caption and Choose Image to  Upload..!!");
      return;
    }

    const storageRef = ref(storage, `images/${image.name}`);
    const uploadTask = uploadBytesResumable(storageRef, image);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        //progress function
        const progress = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        );
        setProgress(progress);
      },
      (error) => {
        alert(error.message);
      },
      () => {
        //complete function
        getDownloadURL(uploadTask.snapshot.ref).then((url) => {
          const docRef = addDoc(collection(db, "posts"), {
            timestamp: serverTimestamp(),
            caption: caption,
            imageUrl: url,
            username: username,
          });

          setProgress(0);
          setCaption("");
          setImage(null);

          //Scrolling Page to Top after uploading image..
          document.body.scrollTop = document.documentElement.scrollTop = 0;
        });
      }
    );
  };

  return (
    <div className="imageupload">
      <progress className="imageupload__progress" value={progress} max="100" />
      <input
        type="text"
        onChange={(e) => setCaption(e.target.value)}
        value={caption}
        placeholder="Enter a caption"
      />
      <input type="file" onChange={handleChange} />
      <Button onClick={handleUpload}>Upload</Button>
    </div>
  );
};

export default ImageUpload;
