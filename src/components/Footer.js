import React from "react";
import "../css/Footer.css";

const Footer = () => {
  const handleParentClick = () => {
    window.open("http://www.techieaid.in", "_blank");
    // document.body.scrollTop = document.documentElement.scrollTop = 0;
  };

  return (
    <div className="footer">
      <h2>I am Footer</h2>
      <div className="footer__col1">
        <p>Designed & Developed By Rahul K.S</p>
        <p>Made With ❤️ in India</p>
        <br />
        <p className="footer__parent" onClick={handleParentClick}>
          © 2022 TechieAid Technologies Pvt Ltd
        </p>
      </div>
    </div>
  );
};

export default Footer;
