import React from 'react';
import {
    Button,
    Intent,
    ControlGroup,
    InputGroup,
    ButtonGroup
} from "@blueprintjs/core";
import './Login.css';

export default class Login extends React.Component {
    static defaultProps = {
        handleSignIn(email, password) {
        },
        handleSignUp(email, password) {
        },
        loading: false,
        loginData: {
            email: '',
            password: '',
        }
    }
    constructor(props, context) {
        super(props, context);
        this.state = {
            loginData: props.loginData,
        };
    }
    updateLoginData = (data) => {
        this.setState({loginData: Object.assign(this.state.loginData, data)});
    }
    render() {
        const { loading, loginData } = this.props;
        const handleSignIn = () => this.props.handleSignIn(loginData);
        const handleSignUp = () => this.props.handleSignUp(loginData);
        return (
            <form className="Login" onSubmit={handleSignIn}>
                <ControlGroup vertical={true}>
                    <InputGroup
                        className={loading && "pt-skeleton"}
                        placeholder="E-mail"
                        leftIcon="user"
                        large={true}
                        required={true}
                        value={loginData.email}
                        onChange={e => {
                            this.updateLoginData({email: e.target.value});
                        }}
                    />
                    <InputGroup
                        className={loading && "pt-skeleton"}
                        type="password"
                        placeholder="Password"
                        leftIcon="lock"
                        large={true}
                        required={true}
                        value={loginData.password}
                        onChange={e => {
                            this.updateLoginData({password: e.target.value});
                        }}
                    />
                    <ButtonGroup large={true} fill={true}>
                        <Button
                            text="Sign in"
                            className={loading && "pt-skeleton"}
                            intent={Intent.PRIMARY}
                            onClick={handleSignIn}
                        />
                        <Button
                            text="Sign up"
                            className={loading && "pt-skeleton"}
                            intent={Intent.NONE}
                            onClick={handleSignUp}
                        />
                    </ButtonGroup>
                </ControlGroup>
            </form>
        );
    }
}