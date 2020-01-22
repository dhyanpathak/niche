import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

import 'font-awesome/css/font-awesome.min.css';
import 'bulma/css/bulma.css';

import Post from './Post';
import NewPost from './NewPost';
import { Button, Progress, Title, Icon, Heading } from 'bloomer';

import '../../assets/stylesheets/user.css';
import defaultAvatar from '../../assets/images/default-avatar.png'

const User = (props) => {
    const { isActive, user, handleLogout } = props;
    const [activeNewPost, setActiveNewPost] = useState(false);
    const [newlyAddedPost, setNewlyAddedPost] = useState(false);

    const generatePosts = (data) => {
        if (data == undefined) return;
        if (data.length == 0 && !activeNewPost) {
            return <p>You don't have any posts!</p>
        }

        return data.map((post) => {
            if (post.id == undefined) {
                console.log(post);
            }
            return <Post fullProfile={true} onlyLikes={false} key={post.id} is_store={false} hasTags={true} hasLink={false} {...post} />
        });
    }

    const loadPost = (data) => {
        setNewlyAddedPost(data);
        setActiveNewPost(false);
    }

    const handleLink = () => {
        axios.delete('/logout', { withCredentials: true })
            .then(response => {
                handleLogout();
                props.history.push('/')
            })
            .catch(error => console.log(error))
    }

    return (
        <div id="user" style={{ display: isActive ? "block" : "none" }}>
            {Object.keys(user).length ?
                <div id='profile'>
                    <div id="profile-header">
                        <figure className="image">
                            <img className="is-rounded" src={defaultAvatar} />
                        </figure>
                        <Title>{user.username}</Title>
                        <Link to='/logout' onClick={handleLink}>
                            <Icon className="fa fa-sign-out" isSize="small" />
                        </Link>
                    </div>
                    <Heading>{user.about}</Heading>
                    <div className="feed">
                        {newlyAddedPost ? generatePosts([newlyAddedPost]) : ''}
                        {generatePosts(user.posts)}
                    </div>
                    <NewPost loadPost={(data) => loadPost(data)} isActive={activeNewPost} close={() => setActiveNewPost(false)} />
                    <Button onClick={() => setActiveNewPost(!activeNewPost)} className='fixed-bottom' isColor='success'>
                        +
                    </Button>
                </div>
                :
                <Progress isSize="small" max={100} />
            }
        </div>
    )
};

export default User;