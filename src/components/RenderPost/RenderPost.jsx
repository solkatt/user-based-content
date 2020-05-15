import React from "react";
import "./RenderPost.css";
import { UserConsumer } from "../../contexts/UserContext";

class Post extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      isDeleted: false,
      username: undefined
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

  componentDidMount() {
    this.state.username === undefined && this.props.data.user !== undefined && this.fetchUsername(this.props.data.user)
  }

  fetchUsername(userId) {
    fetch(`http://localhost:3001/api/account/user/${userId}`,
      {
        method: "GET",
        signal: this.abortController.signal
      }).then(res => res.json())
      .then(json => this.setState({ username: json.username }))
      .catch(error => console.log(error))
  }

  renderDate = (postDate) => {
    const weekdays = ["Söndag", "Måndag", "Tisdag", "Onsdag", "Torsdag", "Fredag", "Lördag"]
    const today = new Date(postDate)
    const date = `${weekdays[today.getDay()]} ${today.getFullYear()}/${today.getMonth()}/${today.getDate()} kl ${(today.getHours()<10?'0':'') + today.getHours()}:${(today.getMinutes()<10?'0':'') + today.getMinutes()}:${(today.getSeconds()<10?'0':'') + today.getSeconds()}`    
    return date
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
                  return <div key={this.props.data[key].filename}><img
                    className={`_${key} postImg`}
                    key={`_${key}`}
                    src={`http://localhost:3001/api/post/image/${this.props.data[key].filename}`} /></div>
                } else if (key === '__v') {
                  return null
                } else { return null }
              })
            }
            <div className="postInfoText">
            <h3>{this.props.data.title}</h3>
            <h6>{this.renderDate(this.props.data.createdAt)} av {this.state.username}</h6>
            {
              Object.keys(this.props.data).map((key) => {
                if (key === 'text') {
                  return <p className={`_${key}`} key={`_${key}`}>{JSON.stringify(this.props.data[key]).replace(/\"/g, "")}</p>
                } else { return null }
              })
            }
            {userState.userId === this.props.data.user && <button className="removePostButton" onClick={this.removePost}>Ta bort inlägg</button>}
            {/* {userState.userId === this.props.data.user && <button className="removePostButton" onClick={this.removePost}>Uppdatera inlägg</button>} */}

            </div>
            
          </div>
        )}
      </UserConsumer>
    );
  }
}

export default Post;
