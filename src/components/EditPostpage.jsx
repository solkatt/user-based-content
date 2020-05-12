import React, { Component } from "react";
import "../css/editpostpage.css"
import trashIcon from "../assets/iconfinder_trash.png"
import ProfileSidebar from './ProfileSidebar'
class EditPostpage extends Component {
    constructor(props) {
        super(props)
        this.state = {
            fileFromDb: "",
            fileInput: "",
            fileInputURL: "",
            titleInput: "",
            textInput: ""
        }

        this.handleChange = this.handleChange.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
        this.fileInput = React.createRef()
    }

    render() {
        return (
            <>
                <div className="editPostContainer">
                    <h1>Skapa post</h1>
                    <form onSubmit={this.handleSubmit} encType="multipart/form-data">
                        <label htmlFor="titleInput">
                            Titel:
                        <input type="text" name="titleInput" id="titleInput" placeholder="Skriv din titel här..." onChange={this.handleChange} />
                        </label>
                        <label htmlFor="textInput">
                            <textarea value={this.state.postText} name="textInput" id="textInput" cols="30" rows="10" placeholder="Skriv något kul här..." onChange={this.handleChange} />
                        </label>
                        <label htmlFor="fileInput">
                            <input type="file" name="fileInput" id="fileInput" accept=".png, .jpg, .jpeg" onChange={this.handleChange} ref={this.fileInput} />
                        </label>
                        <div className="previewImage">
                            <img src={this.state.fileInputURL} alt="" />
                            {/* <p>{this.state.fileFromDb}</p> */}
                            <img src={this.state.fileFromDb} alt="" />
                        </div>
                        <div>
                            <img src={trashIcon} width="20px" height="20px" alt="" />
                            <button type="submit" id="delete_post" value="Delete" onClick={this.handleSubmit}>Ta bort inlägg</button>
                            <button type="submit" id="new_post" value="Post" onClick={this.handleSubmit}>Posta inlägg</button>
                        </div>
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
            case 'fileInput':
                let image = document.querySelector('.previewImage>img')
                const imageURL = URL.createObjectURL(event.target.files[0])
                const imageSrc = event.target.files[0]
                this.setState({ fileInput: imageSrc, fileInputURL: imageURL })
                break;
            case 'titleInput':
                this.setState({ titleInput: event.target.value })
                break;
            case 'textInput':
                this.setState({ textInput: event.target.value })
                break;
            default:
                break;
        }
    }

    /**
     * 
     * @param {Event} event 
     */
    handleSubmit(event) {
        event.preventDefault()
        if (event.target.value === 'Post') {

            const { fileInput, titleInput, textInput } = this.state
            const inputs = { fileInput, titleInput, textInput }
            const found = Object.keys(inputs).filter(key => inputs[key] === "")
            if (found.length !== 0) {
                found.forEach(emptyInput => console.log(`${emptyInput} is empty.`))
                return false
            } else {
                let formData = new FormData()
                formData.append('image', fileInput)
                fetch('http://localhost:3001/upload',
                    { method: "POST", body: formData }
                ).then(response => console.log(response)).catch(error => console.log(error))
            }
        } else if (event.target.value === 'Delete') {
            console.log('right')
            fetch('http://localhost:3001/files', {
                method: "GET"
            }).then(response => {
                this.setState({ fileFromDb: response })
                console.log("response " + response)
            }).catch(error => console.log("error " + error))

            // Ta bort från databasen...
        } else { return false }
    }

}

export default EditPostpage