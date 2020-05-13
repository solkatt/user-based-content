import React from 'react'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import './css/App.css'
import { UserProvider } from './contexts/UserContext'

// Components
import Wrapper from "./components/Wrapper";
import Startpage from "./components/Startpage";
import Postpage from "./components/Postpage";

console.log('hello from app.js')
function App() {
	return (
		<UserProvider>
			<Router>
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

        {/* <Route path="/new-post">
          <Wrapper>
            <CreatePostPage />
          </Wrapper>
        </Route> */}
				</Switch>
			</Router>
		</UserProvider>
	)
}

export default App
