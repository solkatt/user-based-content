import React, { Component } from "react";
import "./editpostpage.css"
import trashIcon from "../../assets/iconfinder_trash.png"
import { UserConsumer } from '../../contexts/UserContext'
import { Redirect } from 'react-router-dom'
import SignIn from "../SignIn/SignIn"

class Postpage extends Component {
    constructor(props) {
        super(props)
        this.state = {
            title: "",
            text: "",
            file: "",
            fileName: "",
            fileURL: "",
            redirect: false
        }

        this.handleChange = this.handleChange.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
        this.formRef = React.createRef()
    }

    render() {
        return (
            // Get current user online
            <UserConsumer>
                {(userState) => (
                    <>
                        <SignIn />
                        <div className="editPostContainer">
                            <h1>Skapa post</h1>
                            <form onSubmit={this.handleSubmit} ref={this.formRef}>
                                <label htmlFor="title">
                                    Titel:
                                <input type="text" name="title" id="title" placeholder="Skriv din titel här..." onChange={this.handleChange} />
                                </label>
                                <label htmlFor="text">
                                    <textarea value={this.state.postText} name="text" id="text" cols="30" rows="10" placeholder="Skriv något kul här..." onChange={this.handleChange} />
                                </label>
                                <label htmlFor="fileInput">
                                    <input type="file" name="file" id="fileInput" accept=".png, .jpg, .jpeg" onChange={this.handleChange} />
                                </label>
                                <div className="previewImage">
                                    <p>Image preview</p>
                                    {this.state.fileURL !== "" && this.state.fileURL !== null && this.state.fileURL !== undefined ?
                                        <img src={this.state.fileURL} alt="" /> : null}
                                    <p>Image from DB (search param is original filename)</p>
                                    {this.state.fileName !== "" && this.state.fileName !== null && this.state.fileName !== undefined ?
                                        <img src={`http://localhost:3001/api/post/image/${this.state.fileName}`} alt="" /> : null}
                                </div>
                                <img src={trashIcon} width="20px" height="20px" alt="" />
                                <button type="submit" id="delete_post" value="Delete" onClick={this.handleSubmit}>Ta bort inlägg</button>
                                <button type="submit" id="new_post" value="Post" name={userState.userId} onClick={this.handleSubmit}>
                                    Posta inlägg
                                    {this.state.redirect && <Redirect to="/" />}
                                </button>
                            </form>
                        </div>
                    </>
                )}
            </UserConsumer>
        )
    }

    /**
     * Handles input change and sets state
     * @param {Event} event 
     */
    handleChange(event) {
        switch (event.target.name) {
            case "file":
                const imageFile = event.currentTarget.files[0]
                const imageSource = URL.createObjectURL(event.currentTarget.files[0])
                // Sets state for image preview and file to send with request
                this.setState({ file: imageFile, fileURL: imageSource })
                break;
            case 'title':
                this.setState({ title: event.target.value })
                break;
            case 'text':
                this.setState({ text: event.target.value })
                break;
            default:
                break;
        }
    }

    /**
     * Handles submit and makes request to save new post
     * @param {Event} event 
     */
    handleSubmit(event) {
        event.preventDefault()
        const user = event.target.name
        if (event.target.value === 'Post') {
            const { file, title, text } = this.state
            const inputs = { file, title, text }
            const found = Object.keys(inputs).filter(key => inputs[key] === "")
            if (found.length !== 0) {
                found.forEach(emptyInput => {
                    if (emptyInput !== 'file') {
                        console.log(`${emptyInput} is empty.`)
                        return
                    }
                })
            }
            // Get input data
            let formData = new FormData(this.formRef.current)
            formData.delete('file')
            formData.append('user', user)
            // Add file to request if it exists
            if (file) {
                formData.append('file', this.state.file)
            }
            // Make request
            fetch("http://localhost:3001/api/post/new", {
                method: "POST",
                body: formData
            }).then(res => {
                // Set state with fileName and then redirect
                this.setState({ fileName: this.state.file.name, redirect: true })
                return
            }).catch(error => console.log(error))
        } else if (event.target.value === 'Delete') {
            console.log("Delete")
            // Ta bort från databasen...
        } else { return false }
    }
}

export default Postpage