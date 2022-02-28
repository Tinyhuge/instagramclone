import React, { useState, useEffect } from "react";

import "../css/App.css";
import { db, auth } from "../firebase-config";
import Post from "./Post";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import {
  getAuth,
  createUserWithEmailAndPassword,
  updateProfile,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
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
import { Input } from "@mui/material";
import { Avatar, IconButton } from "@mui/material";
import { sendSignInLinkToEmail } from "firebase/auth";
import CloseIcon from "@mui/icons-material/Close";
import ArrowCircleUpIcon from "@mui/icons-material/ArrowCircleUp";
import ImageUpload from "./ImageUpload";
import Footer from "./Footer";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

function App() {
  const [posts, setPosts] = useState([]);
  const [open, setOpen] = useState(false);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(null);
  const [openSignIn, setOpenSignIn] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const moveToTop = () => {
    //Scrolling Page to Top after uploading image..
    document.body.scrollTop = document.documentElement.scrollTop = 0;
  };
  const fetchData = async () => {
    const postDoc = collection(db, "posts");
    const postSnapshot = await getDocs(postDoc);

    const querySnapshot = await QuerySnapshot(postDoc);
    querySnapshot.docs.map((doc) => {
      console.log(doc.data());
    });

    setPosts(
      postSnapshot.docs.map((doc) => ({ id: doc.id, post: doc.data() }))
    );
  };
  const auth = getAuth();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (authUser) => {
      if (authUser) {
        //console.log(authUser);
        setUser(authUser);
      } else {
        setUser(null);
      }
    });
    return () => {
      unsubscribe();
    };
  }, [user, username]);

  useEffect(async () => {
    const q = query(collection(db, "posts"), orderBy("timestamp", "desc"));
    const subscribe = onSnapshot(q, (querySnapshot) => {
      querySnapshot.docs.map((doc) => {
        setPosts(
          querySnapshot.docs.map((doc) => ({ id: doc.id, post: doc.data() }))
        );
      });
    });

    //Every Time You have to refresh to get changes
    /* const postDoc = collection(db, "posts");
    const postSnapshot = await getDocs(postDoc);
    setPosts(
      postSnapshot.docs.map((doc) => ({ id: doc.id, post: doc.data() }))
    );*/
  }, []);

  const handleLogin = (event) => {
    event.preventDefault();
    if (username === "" || email === "" || password === "") {
      alert("All Fields are Manadotary..!!");
      return;
    }
    createUserWithEmailAndPassword(auth, email, password)
      .then((authUser) => {
        return updateProfile(auth.currentUser, {
          displayName: username,
        }); /*authUser.user.updateProfile({
          displayName: username,
        });*/
      })
      .catch((error) => alert(error.message));
    setOpen(false);
  };

  const signIn = (event) => {
    event.preventDefault();
    if (email === "" || password === "") {
      alert("All Fields are Manadotary..!!");
      return;
    }
    signInWithEmailAndPassword(auth, email, password).catch((error) =>
      alert(error.message)
    );
    setOpenSignIn(false);
  };

  return (
    <div className="app">
      <Modal open={open} onClose={() => setOpen(false)}>
        <Box sx={style}>
          <div className="app__cancelBtn">
            <CloseIcon
              className="app__closeIcon"
              onClick={() => setOpen(false)}
              fontSize="large"
            />
          </div>
          <form className="app__signup">
            <center>
              <img
                className="app__headerImage"
                src="https://www.instagram.com/static/images/web/mobile_nav_type_logo-2x.png/1b47f9d0e595.png"
                alt=""
              />
            </center>
            <Input
              className="app__input"
              placeholder="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <Input
              className="app__input"
              placeholder="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Input
              className="app__input"
              placeholder="password"
              type="text"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button type="submit" onClick={handleLogin}>
              Sign Up
            </Button>
          </form>
        </Box>
      </Modal>
      <Modal open={openSignIn} onClose={() => setOpenSignIn(false)}>
        <Box sx={style}>
          <div className="app__cancelBtn">
            <CloseIcon
              className="app__closeIcon"
              onClick={() => setOpenSignIn(false)}
              fontSize="large"
            />
          </div>
          <form className="app__signup">
            <center>
              <img
                className="app__headerImage"
                src="https://www.instagram.com/static/images/web/mobile_nav_type_logo-2x.png/1b47f9d0e595.png"
                alt=""
              />
            </center>

            <Input
              className="app__input"
              placeholder="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Input
              className="app__input"
              placeholder="password"
              type="text"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button type="submit" onClick={signIn}>
              Log In
            </Button>
          </form>
        </Box>
      </Modal>
      <div className="app__header">
        <img
          className="app__headerImage"
          src="https://www.instagram.com/static/images/web/mobile_nav_type_logo-2x.png/1b47f9d0e595.png"
          alt=""
        />
        {user ? (
          <Button className="app__headerImageBtn" onClick={() => signOut(auth)}>
            Logout
          </Button>
        ) : (
          <div>
            <Button
              className="app__headerImageBtn"
              onClick={() => setOpen(true)}
            >
              Sign Up
            </Button>
            <Button
              className="app__headerImageBtn"
              onClick={() => setOpenSignIn(true)}
            >
              Login
            </Button>
          </div>
        )}
      </div>
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      {user?.displayName ? (
        <div>
          <h4 className="app__uploadInst">Post Image Here:</h4>
          <ImageUpload username={user.displayName} />
        </div>
      ) : (
        <div className="app__uploadInst">
          <h3>Sorry you need to Login to Upload...&#9989;</h3>
          <p>
            To comment on images in realtime and to upload your photos you need
            to create account, if you don't have with us. Just click on signup
            button and give your details.. &#9996; &#9996; &#9996;
          </p>
          <br />
        </div>
      )}
      <br />
      <br />
      <div className="app__top">
        <IconButton style={{ color: "blue" }}>
          <ArrowCircleUpIcon onClick={moveToTop} fontSize="large" />
        </IconButton>
      </div>

      <div className="app__posts">
        {posts.map(({ id, post }) => (
          <Post
            key={id}
            postId={id}
            user={user}
            name={post.username}
            username={post.username}
            caption={post.caption}
            imageUrl={post.imageUrl}
          />
        ))}
      </div>
      {/* <InstagramEmbed
        url="https://www.instagram.com/p/B_uf9dmAGPw"
        //clientAccessToken="123|456"
        maxWidth={320}
        hideCaption={false}
        containerTagName="div"
        protocol=""
        injectScript
        // onLoading={() => {}}
        // onSuccess={() => {}}
        // onAfterRender={() => {}}
        // onFailure={() => {}}
      /> */}
      {/* {user?.displayName ? (
        <div>
          <h4 className="app__uploadInst">Post Image Here:</h4>
          <ImageUpload username={user.displayName} />
        </div>
      ) : (
        <div style={{ marginLeft: "20px", marginRight: "20px" }}>
          <h3>Sorry you need to Login to Upload...&#9989;</h3>
          <p>
            To comment on images in realtime and to upload your photos you need
            to create account, if you don't have with us. Just click on signup
            button and give your details.. &#9996; &#9996; &#9996;
          </p>
          <br />
        </div>
      )}
      <br /> */}
      <Footer />
    </div>
  );
}

export default App;
