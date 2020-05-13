import React from 'react'
import { UserConsumer } from '../contexts/UserContext'

class NewPost extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            response: "",
            user: this.props.user.userId
        }
        this.fetchPost()
    }

    render() {
        console.log("Response: " + this.state.response)
        return (
            <UserConsumer>
                {(userState) => (
                    <>
                        <p>Hej</p>
                        <p>{this.props.user.userId}</p>
                    </>
                )}
            </UserConsumer>
        )
    }

    async fetchPost() {
        await fetch(`http://localhost:3001/api/post/${this.props.user.userId}`, {
            method: "GET"
        }).then(res => {
            this.setState({ response: res })
        })
    }
}

export default NewPost