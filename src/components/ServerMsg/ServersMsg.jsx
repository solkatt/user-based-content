import React, { Component} from 'react'
import './ServerMsg.css'
import { FaTimesCircle } from 'react-icons/fa'
import { FaKiwiBird } from 'react-icons/fa'


export default class ServerMsg extends Component {
    constructor(props) {
        super(props)
        this.state = {

        }
        this.closeServerMsg = this.closeServerMsg.bind(this)
    }

    render() {

        return(
            <div className="serverMsg-container"> 
        <div className="serverMsg-box">
        <FaTimesCircle
											className='closeServerMsg-icon'
											onClick={this.closeServerMsg}
                                            />
            <FaKiwiBird className="kiwi"/>
            <h1>{this.props.message}</h1>
            </div>
            </div>
    )
}


    closeServerMsg() {
		let popUp = document.querySelector('.serverMsg-container')
		popUp.classList.add('hidden')
	}

}