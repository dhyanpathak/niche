import React, { Component } from 'react';
import axios from 'axios';

import 'font-awesome/css/font-awesome.min.css';
import Post from './Post';
import 'bulma/css/bulma.css';
import { Title, Progress } from 'bloomer';

class Likes extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loadedLikes: false,
            data: null
        }
    }

    componentDidMount() {
        let url = window.location.origin + '/api/users/' + this.props.userid + '/likes';
        axios.get(url, { withCredentials: true })
            .then(resp => {
                this.setState({ loadedLikes: true, data: resp.data.likes });
            })
            .catch(error => console.log('API ERROR:', error));
    }

    generatePosts = (data) => {
        if (data == undefined) return;

        return data.map((post) => {
            return <Post onlyLikes={true} key={post.id} is_store={post['is_store?']} {...post} />
        });
    }

    render() {
        return (
            <div id="likes" style={{ display: this.props.isActive ? "block" : "none" }}>
                <Title isSize={5}>Your likes</Title>
                <div className="feed">
                    {this.props.newLiked !== null ? this.generatePosts([this.props.newLiked]) : null}
                    {this.state.loadedLikes ? this.generatePosts(this.state.data) : <Progress isSize="small" max={100} />}
                </div>
            </div>
        );
    }
};

export default Likes;