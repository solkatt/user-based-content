import React from "react";
import "./post.css";

class Post extends React.Component {
  render() {
    return (
      <div className="postInfo">
        {
          Object.keys(this.props.data).map((key) => {
            if (key === 'image') {
              return <div><img
                className={`_${key} postImg`}
                key={`_${key}`}
                src={`http://localhost:3001/api/post/image/${this.props.data[key].filename}`} /></div>
            } else if (key === '__v') {
              return null
            } else { return null }
          })
        }
        <h3>{this.props.data.title}</h3>
        <h6>{this.props.data.createdAt}</h6>
        {
          Object.keys(this.props.data).map((key) => {
            if (key === 'text') {
              return <p className={`_${key}`} key={`_${key}`}>{JSON.stringify(this.props.data[key]).replace(/\"/g, "")}</p>
            } else { return null }
          })
        }
      </div>
    );
  }
}

export default Post;
