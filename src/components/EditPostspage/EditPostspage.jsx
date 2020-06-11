import React, { Component } from "react";
import trashIcon from "../../assets/iconfinder_trash.png";
import UserContext from "../../contexts/UserContext";
import { Redirect } from "react-router-dom";
import "./EditPostspage.css";
import SignIn from "../SignIn/SignIn";
import { getFromStorage } from "../../utils/storage"

class EditPostspage extends Component {
  static contextType = UserContext;

  constructor(props) {
    super(props);
    this.state = {
      title: this.props.data.title,
      text: this.props.data.text,
      file: this.props.data.image ? this.props.data.image._id : "",
      fileURL: "",
      removeOldImage: false,
      redirect: false,
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.formRef = React.createRef();
    this.fileInputRef = React.createRef()
  }

  removeImage = (event) => {
    this.setState({ file: "", fileURL: "" })
    this.fileInputRef.current.value = ""
  }

  removePost = async () => {
    let token;
    if (await getFromStorage('storage-object') !== null) {
      token = await getFromStorage('storage-object').token;
    }
    fetch(`http://localhost:3001/api/post/remove/${token}?post=${this.props.data._id}`, {
      method: "DELETE",
      body: token,
      signal: this.abortController.signal
    }).then(res => res.json())
      .then((json) => {
        if (!json.success) {
          alert("You are not authorized to remove this post")
          return;
        }
        this.setState({ isDeleted: true })
      })
      .catch(error => { console.log(error) })
  }

  render() {
    return (
      <div className="editPostContainer">
        <SignIn backButton yourPostsButton />
        <div className="editPostContainer">
          <h3></h3>
          <h1>Redigera inlägg</h1>
          <h2></h2>
          <form onSubmit={this.handleSubmit} ref={this.formRef}>
            <label htmlFor="title">
              Titel:
                  <input
                type="text"
                name="title"
                id="title"
                defaultValue={this.props.data.title}
                placeholder="Skriv din titel här..."
                onChange={this.handleChange}
              />
            </label>
            <label htmlFor="text">
              <textarea
                value={this.state.postText}
                name="text"
                id="text"
                cols="30"
                rows="10"
                defaultValue={this.props.data.text}
                placeholder="Skriv något kul här..."
                onChange={this.handleChange}
              />
            </label>
            <div className="previewImage">
              {(
                <>
                  <div className="upload">
                    <img onClick={this.removeImage} name="newimg" src={trashIcon} width="20px" height="20px" margin="0" alt="Ta bort bild" />
                    <p>Uppladdad bild:</p>
                  </div><img src={this.state.fileURL !== "" ? this.state.fileURL : this.state.file !== "" ? `http://localhost:3001/api/post/image/${this.props.data.image.filename}` : ""} alt="" />
                </>
              )}
              <label htmlFor="fileInput">
                <input
                  ref={this.fileInputRef}
                  type="file"
                  name="file"
                  id="fileInput"
                  // defualtvalue={this.props.data.image}
                  accept=".png, .jpg, .jpeg"
                  onChange={this.handleChange}
                />
              </label>

            </div>
            <button
              className={
                this.state.text === "" || this.state.title === ""
                  ? "invalid"
                  : "valid"
              }
              type="submit"
              id="new_post"
              value="Post"
              onClick={this.handleSubmit}
            >
              Uppdatera inlägg
                  {this.state.redirect && <Redirect to="/" />}
            </button>
          </form>
        </div>
      </div>
    );
  }

  /**
   * Handles input change and sets state
   * @param {Event} event
   */
  handleChange(event) {
    switch (event.target.name) {
      case "file":
        const imageFile = event.currentTarget.files[0];
        const imageSource = URL.createObjectURL(event.currentTarget.files[0]);
        // Sets state for image preview and file to send with request
        this.setState({ file: imageFile, fileURL: imageSource });
        break;
      case "title":
        this.setState({ title: event.target.value });
        break;
      case "text":
        this.setState({ text: event.target.value });
        break;
      default:
        break;
    }
  }

  /**
   * Handles submit and makes request to save new post
   * @param {Event} event
   */
  handleSubmit = async (event) => {
    event.preventDefault();
    let token;
    if (await getFromStorage('storage-object') !== null) {
      token = await getFromStorage('storage-object').token;
    }
    const { file, title, text } = this.state;
    const inputs = { file, title, text };
    const found = Object.keys(inputs).filter((key) => inputs[key] === "");
    if (found.length !== 0) {
      found.forEach((emptyInput) => {
        if (emptyInput !== "file") {
          console.log(`${emptyInput} is empty.`);
          return;
        }
      });
    }

    // Get input data
    let formData = new FormData(this.formRef.current);
    formData.delete("file");
    formData.append("token", token);
    formData.append("file", this.state.file)

    for (const [key, value] of formData) { console.log(key, value) }

    formData.forEach(val => console.log(val))

    // UPDATE
    fetch(`http://localhost:3001/api/post/update/${this.props.data._id}`, {
      method: "PUT",
      body: formData
    }).then(res => res.json())
      .then((json) => {
        console.log(json)
        if (json.success === true) {
          console.log("result ", json.result)
          // Set state with fileName and then redirect
          console.log(this.state)
          this.setState({
            redirect: true,
          });
          return
        }
        alert(`Failed updating post
          ${json.error && json.error}
          ${json.message}`)

        return;
      })
      .catch((error) => console.log(error));
  }
}

// removePost() {
//     fetch(`http://localhost:3001/api/post/remove/${this.props.data._id}`, {
//       method: "DELETE",
//       signal: this.abortController.signal
//     }).then(res => res.json())
//       .then((json) => this.setState({ isDeleted: true }))
//       .catch(error => console.log(error))
//   }

export default EditPostspage;
