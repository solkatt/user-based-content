import React, { component } from "react";
import "../css/startpage.css";

import Post from './Post'
import ProfileSidebar from './ProfileSidebar'


function Startpage() {
  return (
        <div className="startpageContainer">
            <h1 className="startpageTitle">Coop Forum!</h1>
            <Post
            imageSource="https://images.unsplash.com/photo-1515542743364-f002238fe5f8?ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80"
            title={'Mitt nya husdjur'}
            // date={Date.toDateString()} 
            description={'Hej alla glada! Här är en bild på mitt nya husdjur. Jag tycker han är fin, alltså inte ful.'} />
           <ProfileSidebar />
        </div>
    )
}

export default Startpage