import React from "react";
import "./RenderPost.css";
import { UserConsumer } from "../../contexts/UserContext";
import UserContext from "../../contexts/UserContext";
import { getFromStorage } from "../../utils/storage";

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

  removePost = async () => {
    let token;
    if (await getFromStorage('storage-object') !== null) {
      token = await getFromStorage('storage-object').token;
    }
    fetch(`http://localhost:3001/api/post/remove/${token}?post=${this.props.data._id}`, {
      method: "DELETE",
      body: token,
      signal: this.abortController.signal
    }).then(res => res.json())
      .then((json) => {
        console.log(json)
        if (!json.success) {
          alert("You are not authorized to remove this post")
          return;
        }
        this.setState({ isDeleted: true })
      })
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
    const date = `${weekdays[today.getDay()]} ${today.getFullYear()}/${today.getMonth()}/${today.getDate()} kl ${(today.getHours() < 10 ? '0' : '') + today.getHours()}:${(today.getMinutes() < 10 ? '0' : '') + today.getMinutes()}:${(today.getSeconds() < 10 ? '0' : '') + today.getSeconds()}`
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
                  console.log(this.props.data)
                  console.log(this.props.data.image.filename)
                  return <div key={this.props.data[key].filename}><img
                    className={`_${key} postImg`}
                    key={`_${key}`}
                    src={this.props.data[key].filename === "" ? "" : `http://localhost:3001/api/post/image/${this.props.data[key].filename}`} /></div>
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
            </div>
          </div>
        )}
      </UserConsumer>
    );
  }
}

export default Post;
