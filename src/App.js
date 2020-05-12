import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import "./css/App.css";

// Components
import Wrapper from "./components/Wrapper";
import Startpage from "./components/Startpage";
import EditPostpage from "./components/EditPostpage";

console.log("hello from app.js");
function App() {
  return (
    <Router>
      <Switch>

        <Route exact path="/">
          <Wrapper>
            <Startpage />
          </Wrapper>
        </Route>

        <Route exact path="/edit">
          <Wrapper>
            <EditPostpage />
          </Wrapper>
        </Route>

        {/* <Route path="/new-post">
          <Wrapper>
            <CreatePostPage />
          </Wrapper>
        </Route> */}
        
      </Switch>
    </Router>
  );
}

export default App;
