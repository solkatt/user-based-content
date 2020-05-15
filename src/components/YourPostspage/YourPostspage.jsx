import React, { Component } from "react";
import "./YourPostspage.css";
import Post from "../RenderPost/RenderPost";
import { Redirect } from "react-router-dom";
import EditPostspage from "../EditPostspage/EditPostspage";
import SignIn from '../SignIn/SignIn'

class YourPostspage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      postsJSON: [],
      postsElements: [],
      userId: this.props.user.userId,
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

  async fetchPosts() {
    await fetch(`http://localhost:3001/api/post/${this.props.user.userId}`, {
      method: "GET",
      signal: this.abortController.signal
    })
      .then((response) => response.json())
      .then((json) => {
        this.setState({
          isLoading: false,
          postsJSON: json.allUserPosts,
          postsElements: this.renderPosts(json.allUserPosts),
        });
      })
      .catch((error) => console.log(error));
  }

  editPage(post) {

    console.log('POST SOM KOMMER IN', post)
    this.setState({
      postData: post
    })


    this.setState({
      editStatus: true,
    })

    console.log('POSTDATA', this.state.postData)

    return <h1>HEEEEEEEJ</h1>
    // return  <Redirect  to="/edit" />
    // BYTA TILL /EDITSIDAN
    // SKICKA MED POST OCH AUTOFYLL
    // ISTÄLLET FÖR SKAPA, UPPDATERA BEFINTLIG POST



  }
  /**
   * Create post elements from fetched data
   */
  renderPosts = (posts) => {
    const allPosts = posts.map((post) => {
      return (
        <div key={post._id}>
          <Post data={post} />
          <button type="button" onClick={() => this.editPage(post)}>
            Edit Post
          </button>
          <button type="button" onClick={() => <Redirect to="/edit" />}>
            Redirect
          </button>
        </div>
      );
    });
    return allPosts;
  };

  /**
   * Fetch posts when component mounts, will trigger rerender
   */
  componentDidMount() {
    this.fetchPosts();
  }

  render() {
    const { isLoading, backToStartpage, postsElements, userId, postData } = this.state;


    if (this.state.editStatus) {
      return (
        <>
          <EditPostspage data={postData} />

          {/* <Redirect to='/edit'  /> */}
          {/* <Redirect to={{
        pathname: '/edit',
        state: { post: this.postData }
    }} */}
        </>
      )
    }

    return isLoading && !backToStartpage ? (
      <p>Loading...</p>
    ) : (
        <div className="userPostsContainer">
          <SignIn backButton createButton />
          <p>Hello {userId}</p>
          {postsElements}
        </div>
      );
  }
}

export default YourPostspage;


