import React, { Component } from 'react';
import axios from 'axios';

import Post from './Post';
import ResultBox from './ResultBox';
import 'font-awesome/css/font-awesome.min.css';
import 'bulma/css/bulma.css';
import { Heading, Button, Title, Field, Box, Control, Input, Icon } from 'bloomer';
import '../../assets/stylesheets/search.css';

class Search extends Component {
    constructor(props) {
        super(props);
        this.state = {
            search: '',
            loaded: false,
            users: [],
            stores: [],
            posts: []
        }
    }
    handleChange = (event) => {
        const { name, value } = event.target
        this.setState({
            [name]: value
        })
    };
    handleSubmit = (event) => {
        event.preventDefault();
        const { search } = this.state;

        if (search.length < 1) return;

        axios.get('/api/search?search=' + search, { withCredentials: true })
            .then(resp => {
                this.setState({ loaded: true, users: resp.data.users, stores: resp.data.stores, posts: resp.data.posts });
            })
            .catch(err => {
                this.setState({ loaded: false });
                console.log("API ERROR", err);
            });
    };

    showStores = (data) => {
        return data.map((store) => {
            return <ResultBox key={store.id} data={store} is_store={true} />
        })
    }
    showUsers = (data) => {
        return data.map((user) => {
            return <ResultBox key={user.id} data={user} is_store={false} />
        })
    }
    generatePosts = (data) => {
        return data.map((post) => {
            return <Post onlyLikes={false} key={post.id} is_store={post['is_store?']} {...post} />
        });
    }
    render() {
        return (
            <div id="search" style={{ display: this.props.isActive ? "block" : "none" }}>
                <div id="searchbar">
                    <Title>Search</Title>
                    <Field>
                        <Control hasIcons='left'>
                            <Input type="text" name="search" placeholder='Posts/Users/Stores' onChange={this.handleChange} />
                            <Icon className='fa fa-search' isSize='small' isAlign='left' />
                            <Button isColor='success' onClick={this.handleSubmit}>Go</Button>
                        </Control>
                    </Field>
                </div>
                <br />
                <hr />
                {this.state.loaded ?
                    <div className="feed">
                        <Heading>Posts</Heading>
                        {this.state.posts.length > 0 ?
                            this.generatePosts(this.state.posts)
                            :
                            <div>
                                <p>Couldn't find posts matching that</p>
                            </div>
                        }
                        <hr />
                        <Heading>Stores</Heading>
                        {this.state.stores.length > 0 ?
                            this.showStores(this.state.stores)
                            :
                            <div>
                                <p>Couldn't find stores matching that</p>
                            </div>
                        }
                        <hr />
                        <Heading>Users</Heading>
                        {this.state.users.length > 0 ?
                            this.showUsers(this.state.users)
                            :
                            <div>
                                <p>Couldn't find users matching that</p>
                            </div>
                        }
                    </div>
                    :
                    ''
                }
            </div>
        );
    }
};

export default Search;