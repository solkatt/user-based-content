import React from 'react'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import { UserProvider, UserConsumer } from './contexts/UserContext'
import './index.css'

// Components
import Wrapper from "./components/Wrapper/Wrapper";
import Startpage from "./components/Startpage/Startpage";
import Postpage from "./components/CreateNewPostpage/CreateNewPostpage";
import UserPostspage from "./components/YourPostspage/YourPostspage";
import Editpage from "./components/EditPostspage/EditPostspage";


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

          <Route exact path="/edit">
            <Wrapper>
              <Editpage />
            </Wrapper>
          </Route>

          <Route exact path="/post">
            <UserConsumer>
              {(userState) => (
                <Wrapper>
                  <UserPostspage user={userState}/>
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



// import React from 'react';
// import {BrowserRouter as Router,Route,
//  Redirect,Switch} from 'react-router-dom';
// import Home from './App.js';
// import Tutorials from './tutorials.js';

// function Routes(){
//     return (
//     <Router>
//       <div>
//         <Switch>
//            <Route path="/" component = {Home}>
//            <Redirect from='/blog/' to="/tutorials/" />
//            <Route path="/tutorials/" component={About} />
//         </Switch>
//       </div>
//     </Router>
//     )
// }