import React, { Component } from 'react'
import './userpostspage.css'
import Post from '../Post/Post'
import { Redirect } from 'react-router-dom'

class UserPostspage extends Component {
    constructor(props) {
        super(props)
        this.state = {
            isLoading: true,
            postsJSON: [],
            postsElements: [],
            userId: this.props.user.userId,
            backToStartpage: false
        }
    }

    async fetchPosts() {
        await fetch(`http://localhost:3001/api/post/${this.props.user.userId}`, {
            method: "GET"
        })
            .then(response => response.json())
            .then((json) => {
                this.setState({
                    isLoading: false,
                    postsJSON: json.allUserPosts,
                    postsElements: this.renderPosts(json.allUserPosts)
                })
            }).catch(error => console.log(error))

    }

    /**
     * Create post elements from fetched data
     */
    renderPosts = (posts) => {
        const allPosts = posts.map(post => { return <Post key={post._id} data={post} /> })
        return allPosts
    }

    /**
     * Fetch posts when component mounts, will trigger rerender
     */
    componentDidMount() {
        this.fetchPosts()
    }

    render() {
        const { isLoading, backToStartpage, postsElements, userId } = this.state

        return (
            isLoading && !backToStartpage ? <p>Loading...</p>
                : <div className="userPostsContainer">
                    {!isLoading && backToStartpage && <><p>Loading...</p><Redirect to="/" /></>}
                    <button type="button" onClick={() => this.setState({ backToStartpage: true })}>Tillbaka till startsidan</button>
                    <p>Hello {userId}</p>
                    {postsElements}
                </div>

        )
    }
}

export default UserPostspage
