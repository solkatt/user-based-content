import React, { Component } from 'react'
import { UserConsumer } from '../contexts/UserContext'

export default class testComponent extends Component {
    constructor(props) {
        super(props)
        this.state = {

        }

    }



    render() {


        return (
            <UserConsumer>

                {(userState) => (
                    <div>
                        <h2>userId</h2>
                        <h1>{userState.userId}</h1>
                        {/* <button type="button" onClick={userState.getCurrentUser()}>USER</button> */}
                    </div>
                )}
            </UserConsumer>
        )
    }

}