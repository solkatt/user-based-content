import React from "react";
import "./post.css";

let date = new Date()

function Post(props) {
  return (
    <div className="post">
      <div>
          <img alt="chicken" className="postImg" src={props.imageSource} />
      </div>
      <div className="postInfo">
        <h3>{props.title}</h3>
        <h6>Date: {date.getDate()}/{date.getMonth() + 1} - {date.getFullYear()}</h6>
        <p>{props.description} </p>
      </div>
    </div>
  );
}

export default Post;
