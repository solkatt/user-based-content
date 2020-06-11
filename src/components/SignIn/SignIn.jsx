import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import {
  getFromStorage,
  setInStorage,
  removeFromStorage,
} from "../../utils/storage";
import "./SignIn.css";
import { UserConsumer } from "../../contexts/UserContext";
import ServerMsg from "../ServerMsg/ServersMsg";
// ICONS
import { FaTimesCircle } from "react-icons/fa";
import UserContext from '../../contexts/UserContext'



//

export default class SignIn extends Component {
  static contextType = UserContext
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      token: "", // Are signed in
      signInError: "",
      signInUsername: "",
      signInPassword: "",
      createPost: false,
      userPosts: false,
      backToStartpage: false,
      username: ""
    };

    this.onChangeSignInUsername = this.onChangeSignInUsername.bind(this);
    this.onChangeSignInPassword = this.onChangeSignInPassword.bind(this);
    this.onSignIn = this.onSignIn.bind(this);
    this.logout = this.logout.bind(this);
    this.closeSignIn = this.closeSignIn.bind(this);
  }

  componentDidMount() {
    const obj = getFromStorage("storage-object");
    if (obj && obj.token) {
      const { token } = obj;
      fetch("/api/account/verify?token=" + token)
        .then((res) => res.json())
        .then((json) => {
          if (json.success) {
            this.setState({
              token: token,
              isLoading: false,
            });
          } else {
            this.setState({
              isLoading: false,
            });
          }
        });
    } else {
      this.setState({
        isLoading: false,
      });
    }
  }

  onChangeSignInUsername(event) {
    this.setState({
      signInUsername: event.target.value,
    });
  }
  onChangeSignInPassword(event) {
    this.setState({
      signInPassword: event.target.value,
    });
  }

  onSignIn() {
    const { signInUsername, signInPassword } = this.state;

    this.setState({
      isLoading: true,
    });

    fetch("/api/account/signin", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: signInUsername,
        password: signInPassword,
      }),
    })
      .then((res) => res.json())
      .then((json) => {
        if (json.success) {
          setInStorage("storage-object", { token: json.token });
          console.log("success")
          this.setState({
            signInError: json.message,
            isLoading: false,
            signInPassword: "",
            // signInUsername: '',
            token: json.token,
          });

          { this.context.getUserData() }
        } else {
          this.setState({
            signInError: json.message,
            isLoading: false,
          });
          // set Sign In Popup Message not hidden
          // this.signInErrorMsg(this.state.signInError)
        }
      })
      .catch((error) => console.log(error));
  }

  logout() {
    this.setState({
      isLoading: true,
    });

    const obj = getFromStorage("storage-object");
    if (obj && obj.token) {
      const { token } = obj;
      fetch("/api/account/logout?token=" + token)
        .then((res) => res.json())
        .then((json) => {
          if (json.success) {
            this.setState({
              token: "",
              isLoading: false,
            });
            removeFromStorage("storage-object", {
              token: json.token,
            });
          } else {
            this.setState({
              isLoading: false,
            });
          }
        })
    } else {
      this.setState({
        isLoading: false,
      });
    }
  }

  closeSignIn() {
    let popUp = document.querySelector(".sign-in-container");
    popUp.classList.add("hidden");
  }

  openSignIn() {
    let popUp = document.querySelector(".sign-in-container");
    popUp.classList.remove("hidden");
  }

  openSignUp() {
    let popUp = document.querySelector(".sign-up-container");
    popUp.classList.remove("hidden");
  }

  async getUsername() {
      const userId = await this.context.getUserId()
      const user = await this.context.getUsername(userId)
      this.setState({ username: user })
  }

  componentWillMount() {
    this.getUsername()
  }

  render() {
    const {
      isLoading,
      token,
      signInError,
      signInUsername,
      signInPassword,
      backToStartpage,
    } = this.state;

    if (isLoading) {
      return (
        <div>
          <p>Loading...</p>
        </div>
      );
    }

    if (!token) {
      return (
        <UserConsumer>
          {(userState) => (
            <>
              {/* {{ signInError } ? (
								<div className='errorMsg'>
									
									<ServerMsg message={signInError}/>
								</div>
							) : null} */}

              <div className={`errMsg ${signInError ? "" : "hidden"}`}>
                <ServerMsg message={signInError} />
              </div>

              <div className="profileContainer">
                <button type="button" onClick={this.openSignIn}>
                  Logga in
                </button>
                <button type="button" onClick={this.openSignUp}>
                  Registrera dig
                </button>
              </div>

              <div className="sign-in-container hidden">
                <div className="sign-in-box">
                  {/* {{signInError} ? <p>{signInError}</p> : null} */}
                  <div>
                    <p>Redan medlem?</p>
                    <FaTimesCircle
                      className="close-icon"
                      onClick={this.closeSignIn}
                    />
                  </div>
                  <input
                    type="text"
                    placeholder="Användarnamn"
                    defaultValue={signInUsername}
                    onChange={this.onChangeSignInUsername}
                  />
                  <br />
                  <input
                    type="password"
                    placeholder="Lösenord"
                    defaultValue={signInPassword}
                    onChange={this.onChangeSignInPassword}
                  />
                  <br />
                  <button
                    onClick={() => {
                      this.onSignIn();
                    }}
                  >
                    Logga in
                  </button>
                </div>
                <br />
                <br />
                <br />
              </div>
            </>
          )}
        </UserConsumer>
      );
    }

    return (
      <UserConsumer>
        {(userState) => (
          <div className="profileContainer">
            <h3>Hej {this.state.username !== "" && this.state.username}! </h3>
            {this.props.yourPostsButton && (
              <button
                type="button"
                onClick={() => {
                  this.setState({ userPosts: true });
                }}
              >
                Dina inlägg
                {this.state.userPosts && <Redirect to="/post" />}
              </button>
            )}
            {this.props.createButton && (
              <button
                type="button"
                onClick={() => {
                  this.setState({ createPost: true });
                }}
              >
                Skapa inlägg
                {this.state.createPost && <Redirect to="/new" />}
              </button>
            )}
            {this.props.logOutButton && (
              <button type="button" onClick={this.logout}>
                Logga ut
              </button>
            )}
            {!isLoading && backToStartpage && (
              <>
                <p>Loading...</p>
                <Redirect to="/" />
              </>
            )}
            {this.props.backButton && (
              <button
                type="button"
                onClick={() => this.setState({ backToStartpage: true })}
              >
                Tillbaka till startsidan
              </button>
            )}
          </div>
        )}
      </UserConsumer>
    );
  }
}
