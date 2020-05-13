import React, { component } from "react";
import "../css/startpage.css";

import Post from './Post'

function Startpage() {
  return (
        <div className="loginContainer">
            <h1 className="startpageTitle">Coop Forum!</h1>
            <Post title={'Logga in'} description={'Logga in här'} />
        </div>
    )
}

export default Startpage