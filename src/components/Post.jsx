import React from "react";
import "../css/post.css";

function Post(props) {
  return (
    <div className="post">
      <div>
          <img className="postImg" src={props.imageSource} />
      </div>
      <div>
        <h3>{props.title}</h3>
        <h6>{props.date}</h6>
        <h4>{props.description} </h4>
      </div>
    </div>
  );
}

export default Post;
