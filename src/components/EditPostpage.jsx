import React, { Component } from "react";
import "../css/editpostpage.css"
import trashIcon from "../assets/iconfinder_trash.png"
import ProfileSidebar from './ProfileSidebar'
class EditPostpage extends Component {
    constructor(props) {
        super(props)
        this.state = {
            user: 'Kalle',
            title: "",
            text: "",
            file: "",
            fileName: "",
            fileURL: ""
        }

        this.handleChange = this.handleChange.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
        this.formRef = React.createRef()
    }

    render() {
        return (
            <>
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
                            {this.state.fileURL !== "" && this.state.URL !== null ?
                                <img src={this.state.fileURL} alt="" /> : null}
                            <p>Image from DB (search param is original filename)</p>
                             {this.state.fileName !== "" && this.state.fileName !== null ?
                                <img src={`http://localhost:3001/api/post/image/${this.state.fileName}`} alt="" /> : null}
                        </div>
                        <img src={trashIcon} width="20px" height="20px" alt="" />
                        <button type="submit" id="delete_post" value="Delete" onClick={this.handleSubmit}>Ta bort inlägg</button>
                        <button type="submit" id="new_post" value="Post" onClick={this.handleSubmit}>Posta inlägg</button>
                    </form>
                </div>
                <ProfileSidebar />
            </>
        )
    }

    /**
     * 
     * @param {Event} event 
     */
    handleChange(event) {
        switch (event.target.name) {
            case "file":
                const imageFile = event.currentTarget.files[0]
                const imageSource = URL.createObjectURL(event.currentTarget.files[0])
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
     * Handles submit and sets state
     * @param {Event} event 
     */
    handleSubmit(event) {
        event.preventDefault()
        if (event.target.value === 'Post') {
            const { user, file, title, text } = this.state
            const inputs = { user, file, title, text }
            const found = Object.keys(inputs).filter(key => inputs[key] === "")
            if (found.length !== 0) {
                found.forEach(emptyInput => console.log(`${emptyInput} is empty.`))
                return
            } else {
                let formData = new FormData(this.formRef.current)
                formData.delete('file')
                formData.append('user', this.state.user)
                formData.append('file', this.state.file)
                fetch("http://localhost:3001/api/post/new", {
                    method: "POST",
                    body: formData
                }).then(response => {
                    console.log(response, response.id)
                    this.setState({ fileName: this.state.file.name })
                }).catch(error => console.log(error))
            }
        } else if (event.target.value === 'Delete') {
            console.log('right')

            // Ta bort från databasen...
        } else { return false }
    }

}

export default EditPostpage