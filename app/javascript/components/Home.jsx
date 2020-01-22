import React, { Component } from 'react';
import axios from 'axios';

import { Waypoint } from 'react-waypoint';
import 'font-awesome/css/font-awesome.min.css';
import Post from './Post';
import AddStore from './AddStore';
import 'bulma/css/bulma.css';
import { Tabs, TabList, Tab, TabLink, Heading, Progress } from 'bloomer';
import '../../assets/stylesheets/home.css';


class Home extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loaded: false,
            spotlightData: null,
            curatedData: null,
            showSpotlight: true,
            showPersonal: false,
            showAdd: false,
            spotlightPage: 0
        }
    }

    componentDidMount() {
        axios.get(window.location.origin + '/api/posts?page=' + this.state.spotlightPage,
            { withCredentials: true })
            .then(resp => {
                this.setState({ loaded: true, spotlightData: resp.data.spotlight, curatedData: resp.data.curated, spotlightPage: this.state.spotlightPage += 1 });
            })
            .catch(error => console.log('API ERROR:', error));
    }

    getSpotlightPosts = () => {
        axios.get(window.location.origin + '/api/posts?page=' + this.state.spotlightPage,
            { withCredentials: true })
            .then(resp => {
                if (!resp) return;
                if (resp.data.spotlight.length < 1) return;
                this.setState({ spotlightData: resp.data.spotlight, spotlightPage: this.state.spotlightPage += 1 });
            })
            .catch(error => console.log('API ERROR:', error));
    }

    newLike = (post) => {
        this.props.updateLikes(post);
    }

    generatePosts = (data) => {
        return data.map((post) => {
            return <Post newLike={this.newLike} onlyLikes={false} key={post.id} is_store={post['is_store?']} {...post} />
        });
    }

    switchPanel = (e) => {
        const { name } = e.target;
        if (name == "spotlight") {
            this.setState({ showSpotlight: true, showPersonal: false, showAdd: false });
        } else if (name == "personal") {
            this.setState({ showSpotlight: false, showPersonal: true, showAdd: false });
        } else if (name == "add") {
            this.setState({ showSpotlight: false, showPersonal: false, showAdd: true });
        }
    }

    render() {
        return (
            <div id="home" style={{ display: this.props.isActive ? "block" : "none" }}>
                <Tabs className="home-tabs">
                    <TabList>
                        <Tab isActive={this.state.showSpotlight} onClick={this.switchPanel}>
                            <TabLink name="spotlight">
                                <span>Spotlight</span>
                            </TabLink>
                        </Tab>
                        <Tab isActive={this.state.showPersonal} onClick={this.switchPanel}>
                            <TabLink name="personal">
                                <span>For you</span>
                            </TabLink>
                        </Tab>
                        <Tab isActive={this.state.showAdd} onClick={this.switchPanel}>
                            <TabLink name="add">
                                <span>+ store</span>
                            </TabLink>
                        </Tab>
                    </TabList>
                </Tabs>
                <br />
                <div className="feed" style={{ display: this.state.showSpotlight ? "inline-block" : "none" }}>
                    {this.state.loaded ? this.generatePosts(this.state.spotlightData) : <Progress isSize="small" max={100} />}
                    <Waypoint onEnter={() => this.getSpotlightPosts()} />
                </div>
                <div className="feed" style={{ display: this.state.showPersonal ? "inline-block" : "none" }}>
                    {this.state.loaded ?
                        <div>
                            <Heading>Based on your previous likes and posts</Heading>
                            {this.generatePosts(this.state.curatedData.posts)}
                        </div>
                        :
                        <Progress isSize="small" max={100} />
                    }
                </div>
                <div className="feed" style={{ display: this.state.showAdd ? "inline-block" : "none" }}>
                    <AddStore />
                </div>
            </div>
        );
    }
};

export default Home;