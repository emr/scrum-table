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
            stories: [],
            lists: [],
            saving: false,
            saved: true,
            fetching: true,
        };
        this.toaster = new Toaster();
        this.auth = firebase.auth();
        this.listsDbRef = firebase.database().ref().child('lists');
        this.storiesDbRef = firebase.database().ref().child('stories');
    }
    componentDidMount() {
        this.auth.onAuthStateChanged(user => {
            this.setState({
                isSigningIn: false,
                isSignedIn: !!user,
                userProfile: user,
            })
        });
        Promise.all([
            new Promise(resolve => {
                this.listsDbRef
                    .on('value', snap => {
                        // normalize
                        const lists = Object.keys(snap.val()).reduce(
                            (lists, key) => {
                                lists[key] = {
                                    title: 'Untitled',
                                    ...lists[key],
                                    // items object to array
                                    // and push id from object key
                                    items: lists[key].items ? Object.entries(lists[key].items).map(i => ({...i[1], id: i[0]})) : [],
                                }
                                return lists;
                            },
                            snap.val()
                        );
        
                        this.setState({
                            lists,
                        });
                        resolve();
                    })
                ;
            }),
            new Promise(resolve => {
                this.storiesDbRef
                    .on('value', snap => {
                        // normalize
                        const stories = Object.entries(snap.val() || []).map(i => ({...i[1], id: i[0]}));

                        this.setState({
                            stories,
                        });
                        resolve();
                    })
                ;
            })
        ])
        .then(() => {
            this.setState({
                fetching: false
            })
            this.lockSave();
        });
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
        this.setSaving();
        Promise.all([
            new Promise(resolve => {
                this.listsDbRef
                    .set(this.state.lists)
                    .then(resolve)
                ;
            }),
            new Promise(resolve => {
                this.storiesDbRef
                    .set(this.state.stories)
                    .then(resolve)
                ;
            }),
        ])
        .then(() => this.lockSave())
        .catch(e => {
            this.toaster.show({
                intent: Intent.DANGER,
                message: e.message,
            });
        });
    }
    setSaving = () => this.setState({ saving: true, saved: false, });
    lockSave = () => this.setState({ saving: false, saved: true, });
    unlockSave = () => this.setState({ saving: false, saved: false, });
    render() {
        const { isSignedIn, isSigningIn, loginData, stories, lists, saving, saved, fetching, } = this.state;
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
                                    synchronize={this.synchronize}
                                    {...{fetching, stories, lists}}
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
