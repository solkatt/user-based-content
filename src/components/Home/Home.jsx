import React from 'react'
import SignIn from './SignIn'
import SignUp from './SignUp'

import { UserProvider } from '../../contexts/UserContext';

import UserConTest from '../testWithContext'


export default function Home() {

    return(

        <div>
<UserProvider>
                <SignUp />
                <SignIn />
                <UserConTest />
</UserProvider>
        </div>


    

    )

}