import React from "react";
import "./post.css";

class Post extends React.Component {
  render() {
    return (
      <div className="post">
        {Object.keys(this.props.data).map((key) => {
          if (key === 'image') {
            return <img
              className={`_${key}`}
              key={`_${key}`}
              src={`http://localhost:3001/api/post/image/${this.props.data[key].filename}`} />

          } else {
            return <p className={`_${key}`} key={`_${key}`}>{JSON.stringify(key).replace(/\"/g, "")}: {JSON.stringify(this.props.data[key]).replace(/\"/g, "")}</p>
          }
        })}
      </div>
    );
  }
}

export default Post;
