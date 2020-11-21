import React, { useState } from 'react';
import LoginForm from './forms/LoginForm';
import SignupForm from './forms/SignupForm';
const UserLoginSignupModule = (props) => {
    const [switchSignup, setSwitchSignup] = useState(false);
    return (
        <div className="login-body d-flex flex-column justify-content-center overflow-hidden m-auto">
            <div className={"d-flex login-signup-container" + (switchSignup ? " slide-signup" : " slide-login")}>
                <div className={"d-flex module login-module"} >
                    <LoginForm/>
                </div>
                <div className={"d-flex module signup-module"} >
                    <SignupForm/>
                </div>
            </div>
            <div className="row m-0 switch-link p-4">
            <div className="col-xs-12 pl-2 pr-2">
                <a href="javascript:void(0)" onClick={() => {setSwitchSignup(!switchSignup)}}>{switchSignup ? "Already have an account?" : "Or create an account?"}</a>
            </div>
            </div>
        </div>
    )
}

export default UserLoginSignupModule;