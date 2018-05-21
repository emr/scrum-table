import React, { Component } from 'react';
import firebase from './firebase';
import Login from './component/Login';
import AppNavbar from './component/AppNavbar';
import Board from './component/Board';
import { Toaster, Intent } from '@blueprintjs/core';
import './App.css';

class App extends Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            isSignedIn: false,
            isSigningIn: true,
            userProfile: null,
            loginData: {
                email: '',
                password: '',
            },
            lists: [],
            saving: false,
            saved: true,
            fetching: true,
        };
        this.toaster = new Toaster();
        this.auth = firebase.auth();
        this.listsDbRef = firebase.database().ref().child('lists');
    }
    componentDidMount() {
        this.auth.onAuthStateChanged(user => {
            this.setState({
                isSigningIn: false,
                isSignedIn: !!user,
                userProfile: user,
            })
        });
        this.listsDbRef
            .on('value', snap => {
                // normalize
                const lists = Object.keys(snap.val()).reduce(
                    (lists, key) => {
                        lists[key] = {
                            items: [],
                            title: 'Untitled',
                            ...lists[key]
                        }
                        return lists;
                    },
                    snap.val()
                );

                this.setState({
                    lists,
                    fetching: false,
                });
                this.lockSave();
            })
        ;
    }
    signIn = (data) => {
        this.setState({isSigningIn: true});
        this.auth.signInWithEmailAndPassword(data.email, data.password)
            .then(user => {
                this.toaster.show({
                    intent: Intent.SUCCESS,
                    message: 'Login successful.',
                });
            })
            .catch(e => {
                this.toaster.show({
                    intent: Intent.DANGER,
                    message: e.message,
                });
            })
            .then(() => {
                this.setState({isSigningIn: false});
            })
        ;
    }
    signUp = (data) => {
        this.setState({isSigningIn: true});
        this.auth.createUserWithEmailAndPassword(data.email, data.password)
            .then(user => {
                this.toaster.show({
                    intent: Intent.SUCCESS,
                    message: 'The user successfully registered.',
                });
            })
            .catch(e => {
                this.toaster.show({
                    intent: Intent.DANGER,
                    message: e.message,
                });
            })
            .then(() => {
                this.setState({isSigningIn: false});
            })
        ;
    }
    signOut = () => {
        this.auth.signOut();
    }
    synchronize = () => {
        this.listsDbRef
            .set(this.state.lists)
            .then(() => this.lockSave())
            .catch(e => {
                this.toaster.show({
                    intent: Intent.DANGER,
                    message: e.message,
                });
            })
        ;
    }
    lockSave = () => this.setState({saved: true});
    unlockSave = () => this.setState({saved: false});
    render() {
        const { isSignedIn, isSigningIn, loginData, lists, saving, saved, fetching, } = this.state;
        return (
            <div className="App">
                <Toaster ref={(ref) => this.toaster = ref} />
                { isSignedIn
                    ? (
                        <div>
                            <AppNavbar
                                user={this.state.userProfile}
                                handleSignOut={this.signOut}
                                synchronize={this.synchronize}
                                {...{saving, saved}}
                            />
                            <div className="container">
                                <Board
                                    unlockSave={this.unlockSave}
                                    {...{fetching, lists}}
                                />
                            </div>
                        </div>
                    )
                    : (
                        <Login
                            loginData={loginData}
                            handleSignIn={this.signIn}
                            handleSignUp={this.signUp}
                            loading={isSigningIn}
                        />
                    )
                }
            </div>
        );
    }
}

export default App;
