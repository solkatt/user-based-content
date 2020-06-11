import React, { Component } from "react";
import "./CreateNewPostpage.css";
import trashIcon from "../../assets/iconfinder_trash.png";
import { UserConsumer } from "../../contexts/UserContext";
import UserContext from "../../contexts/UserContext";
import { getFromStorage } from "../../utils/storage";
import { Redirect } from "react-router-dom";
import SignIn from "../SignIn/SignIn";

class Postpage extends Component {
  static contextType = UserContext;

  constructor(props) {
    super(props);
    this.state = {
      title: "",
      text: "",
      file: "",
      fileName: "",
      fileURL: "",
      redirect: false,
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.formRef = React.createRef();
    this.abortController = new AbortController();
  }

  // Abort any fetch at unmount
  componentWillUnmount() {
    this.abortController.abort();
  }

  render() {
    return (
      <div className="editPostContainer">
        <SignIn backButton yourPostsButton />
        <h1>Skapa inlägg</h1>
        <form onSubmit={this.handleSubmit} ref={this.formRef}>
          <input
            type="text"
            name="title"
            id="title"
            placeholder="Skriv din titel här..."
            onChange={this.handleChange}
          />
          <textarea
            value={this.state.postText}
            name="text"
            id="text"
            maxLength="200"
            cols="30"
            rows="10"
            placeholder="Skriv något kul här..."
            onChange={this.handleChange}
          />
          <label htmlFor="fileInput">
            <input
              type="file"
              name="file"
              id="fileInput"
              accept=".png, .jpg, .jpeg"
              onChange={this.handleChange}
            />
          </label>
          <div className="previewImage">
            <p>Uppladdad bild:</p>
            {this.state.fileURL !== "" &&
              this.state.fileURL !== null &&
              this.state.fileURL !== undefined ? (
                <img src={this.state.fileURL} alt="" />
              ) : null}
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
            Posta inlägg
                  {this.state.redirect && <Redirect to="/" />}
          </button>
        </form>
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
    event.persist()
    event.preventDefault();
    let token;
    if (await getFromStorage('storage-object') !== null) {
      token = await getFromStorage('storage-object').token;
    }
console.log("Hello:(")
    const { file, title, text } = this.state;
    const inputs = { file, title, text };

    const found = Object.keys(inputs).filter((key) => {
      return inputs[key] === "" && key !== "file";
    });

    if (found.length >= 1) {
      alert(`Du måste fylla i alla fält.`);
      found.forEach((emptyInput) => {
        if (emptyInput !== "file") {
          console.log(`${emptyInput} is empty.`);
        }
      });
      return;
    }

    // Get input data and put file last
    let formData = new FormData(this.formRef.current);
    formData.delete("file")
    formData.append("token", token)
    formData.append("file", this.state.file)
    // Make request
    fetch("http://localhost:3001/api/post/new", {
      method: "POST",
      body: formData,
    }).then(res => res.json())
      .then(json => {
        if (!json.success) {
          alert(`You must be logged in to create a post`)
          return;
        }
        // Set state with fileName and then redirect
        this.setState({ fileName: this.state.file.name, redirect: true });
        return
      }).catch((error) => alert(`You must be logged in to create a post`));
  }
}

export default Postpage;
