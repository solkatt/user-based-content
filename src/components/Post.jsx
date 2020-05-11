import React from "react";
import "../css/post.css";

let date = new Date()

function Post(props) {
  return (
    <div className="post">
      <div>
          <img className="postImg" src={props.imageSource} />
      </div>
      <div className="postInfo">
        <h3>{props.title}</h3>
        <h6>Datum: {date.getMonth() + 1}/{date.getDate()} - {date.getFullYear()}</h6>
        <p>{props.description} </p>
      </div>
    </div>
  );
}

export default Post;
