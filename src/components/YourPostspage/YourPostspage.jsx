import React, { Component } from "react";
import "./YourPostspage.css";
import Post from "../RenderPost/RenderPost";
import EditPostspage from "../EditPostspage/EditPostspage";
import SignIn from '../SignIn/SignIn'
import UserContext from "../../contexts/UserContext";
import { getFromStorage } from "../../utils/storage";

class YourPostspage extends Component {
  static contextType = UserContext
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      postsElements: [],
      backToStartpage: false,
      editStatus: false,
      postData: {},
    };

    this.editPage = this.editPage.bind(this);
    this.abortController = new AbortController();
  }

  componentWillUnmount() {
    this.abortController.abort()
  }

  fetchPosts = async () => {
    const userId = await this.context.getUserId()
    await fetch(`http://localhost:3001/api/post/${userId}`, {
      method: "GET",
      signal: this.abortController.signal
    })
      .then((response) => response.json())
      .then((json) => {
        if (!json.success) {
          return alert("Failed getting user posts")
        }
        this.setState({
          isLoading: false,
          postsElements: this.renderPosts(json.allUserPosts),
        });
      })
      .catch((error) => console.log(error));
  }

  editPage(post) {
    this.setState({ postData: post, editStatus: true })
  }

  // Create post elements from fetched data
  renderPosts = (posts) => {
    const allPosts = posts.map((post) => {
      return (
        <div key={post._id}>
          <Post data={post}>
            <button className="editPostButton" type="button" onClick={() => this.editPage(post)}>
              Edit Post
            </button>
          </Post>
        </div>
      );
    });
    return allPosts;
  };

  //Fetch posts when component mounts, will trigger rerender
  componentDidMount() {
     this.fetchPosts();
  }

  render() {
    const { isLoading, backToStartpage, postsElements, postData } = this.state;

    if (this.state.editStatus) {
      return <EditPostspage data={postData} />
    }

    return (
      isLoading && !backToStartpage ? <p>Loading...</p> :
        <div className="userPostsContainer">
          <SignIn backButton createButton />
          {postsElements}
        </div>
    )
  }
}

export default YourPostspage;


