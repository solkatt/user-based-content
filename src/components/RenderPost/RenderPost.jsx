import React from "react";
import "./RenderPost.css";
import { UserConsumer } from "../../contexts/UserContext";

class Post extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      isDeleted: false,
    }
    this.removePost = this.removePost.bind(this)
    this.abortController = new AbortController()
  }

  removePost() {
    fetch(`http://localhost:3001/api/post/remove/${this.props.data._id}`, {
       method: "DELETE",
       signal: this.abortController.signal
     }).then(res => res.json())
     .then((json) => this.setState({ isDeleted: true }))
     .catch(error => console.log(error))
  }
  
  componentWillUnmount() {
    this.abortController.abort()
  }

  render() {
    const { isDeleted } = this.state
    return (
      <UserConsumer>
        {(userState) => (
          isDeleted ? null : <div className="postInfo">
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
            {userState.userId === this.props.data.user && <button onClick={this.removePost}>Ta bort inlägg</button>}
          </div>
        )}
      </UserConsumer>
    );
  }
}

export default Post;
