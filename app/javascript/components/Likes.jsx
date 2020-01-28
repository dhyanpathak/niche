import React, { Component } from 'react';

import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { loadLikes } from '../actions';

import 'font-awesome/css/font-awesome.min.css';
import Post from './Post';
import 'bulma/css/bulma.css';
import { Title, Progress } from 'bloomer';

class Likes extends Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        this.props.loadLikes(this.props.userid);
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
                    {this.props.loadedLikes ? this.generatePosts(this.props.likes) : <Progress isSize="small" max={100} />}
                </div>
            </div>
        );
    }
};

Likes.propTypes = {
    loadedLikes: PropTypes.bool.isRequired,
    likes: PropTypes.array.isRequired
}

const mapStateToProps = state => ({
    loadedLikes: state.postInteraction.loadedLikes,
    likes: state.postInteraction.likes,
})

export default connect(mapStateToProps, { loadLikes })(Likes);