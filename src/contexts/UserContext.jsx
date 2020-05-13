import React, { Component, createContext } from 'react'
import { getFromStorage, setInStorage, removeFromStorage } from '../utils/storage'

const UserContext = createContext({
    username: '',
})


export class UserProvider extends Component {
    constructor(props) {
        super(props)

        this.state = {
            isLoading: false,
            userId: 'TETSNAMNENEA',
        }

    }

componentDidMount() { 
     console.log('BAJS')

        const obj = getFromStorage('storage-object')
        if (obj && obj.token) {
            const { token } = obj
            fetch('/api/account/user/data?token=' + token)
                .then((res) => res.json())
                .then((json) => {
                    if (json.success) {
                        this.setState({
                            userId: json.userId,
                            isLoading: false,
                        })
                        console.log('JSON HÄR', json)
                    } else {
                        this.setState({
                            isLoading: false,
                        })
                        console.log('ELSE')
                    }
                })
        } else {
            this.setState({
                isLoading: false,
            })
        }
    }

    render() {
        return(
            <UserContext.Provider value={this.state}>
                {this.props.children}
            </UserContext.Provider>
        )
    }

}

export const UserConsumer = UserContext.Consumer