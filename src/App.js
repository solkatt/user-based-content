import React from 'react'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import { UserProvider, UserConsumer } from './contexts/UserContext'

// Components
import Wrapper from "./components/Wrapper";
import Startpage from "./components/Startpage";
import Postpage from "./components/Postpage";
import NewPost from "./components/NewPost"

console.log('hello from app.js')
function App() {
  return (
    <Router>
      <UserProvider>
        <Switch>

          <Route exact path="/">
            <Wrapper>
              <Startpage />
            </Wrapper>
          </Route>

          <Route exact path="/new">
            <Wrapper>
              <Postpage />
            </Wrapper>
          </Route>

          <Route exact path="/post">
            <UserConsumer>
              {(userState) => (
                <Wrapper>
                  <NewPost user={userState}/>
                </Wrapper>
              )}
            </UserConsumer>
          </Route>

          {/* <Route path="/new-post">
          <Wrapper>
            <CreatePostPage />
          </Wrapper>
        </Route> */}
        </Switch>
      </UserProvider>
    </Router>
  )
}

export default App
