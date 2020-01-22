import React, { Component } from 'react';

import 'font-awesome/css/font-awesome.min.css';
import 'bulma/css/bulma.css';
import '../../assets/stylesheets/main.css';

import Menu from './Menu';
import Home from './Home';
import Likes from './Likes';
import Search from './Search';
import User from './User';

class Main extends Component {
    constructor(props) {
        super(props);
        this.state = {
            home: true,
            search: false,
            likes: false,
            profile: false,
            newLiked: null
        };
    }
    componentWillMount() {
        this.props.handleLogin();
    }
    handleSelected = (e) => {
        switch (e.target.name) {
            case "home":
                this.setState({ home: true, search: false, likes: false, profile: false });
                break;
            case "search":
                this.setState({ home: false, search: true, likes: false, profile: false });
                break;
            case "likes":
                this.setState({ home: false, search: false, likes: true, profile: false });
                break;
            case "profile":
                this.setState({ home: false, search: false, likes: false, profile: true })
        }
    }
    updateLikes = (post) => {
        this.setState({ newLiked: post });
    }
    render() {
        return (
            <div id="main">
                <Menu
                    {...this.props}
                    homeSelect={this.state.home}
                    searchSelect={this.state.search}
                    likesSelect={this.state.likes}
                    userSelect={this.state.profile}
                    handleLogout={this.props.handleLogout}
                    handleSelected={this.handleSelected}
                />
                <div id="content">
                    <Home updateLikes={this.updateLikes} isActive={this.state.home} />
                    <Likes newLiked={this.state.newLiked} userId={this.props.user.id} isActive={this.state.likes} />
                    <Search updateLikes={this.updateLikes} isActive={this.state.search} />
                    <User {...this.props} isActive={this.state.profile} user={this.props.user} handleLogout={this.props.handleLogout} />
                </div>
            </div>
        );
    }
};

export default Main;