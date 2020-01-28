import React, { Component } from 'react';

import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { loadHome, loadSpotlight, loadCurated } from '../actions';

import Post from './Post';
import AddStore from './AddStore';

import 'font-awesome/css/font-awesome.min.css';
import 'bulma/css/bulma.css';
import { Tabs, TabList, Tab, TabLink, Heading, Progress } from 'bloomer';
import '../../assets/stylesheets/home.css';


class Home extends Component {
    constructor(props) {
        super(props);
        this.handleScroll = this.handleScroll.bind(this);
        this.state = {
            showSpotlight: true,
            showPersonal: false,
            showAdd: false,
        }
    }

    componentDidMount() {
        this.props.loadHome(0);
        window.addEventListener('scroll', this.handleScroll, true);
        document.addEventListener("touchmove", this.handleScroll, true);
        document.addEventListener("scroll", this.handleScroll, true);
    }

    getSpotlightPosts = () => {
        this.props.loadSpotlight(this.props.spotlightPage);
    }

    generatePosts = (data) => {
        return data.map((post) => {
            return <Post onlyLikes={false} key={post.id} is_store={post['is_store?']} {...post} />
        });
    }

    switchPanel = (e) => {
        const { name } = e.target;
        if (name == "spotlight") {
            this.setState({ showSpotlight: true, showPersonal: false, showAdd: false });
        } else if (name == "personal") {
            this.props.loadCurated();
            this.setState({ showSpotlight: false, showPersonal: true, showAdd: false });
        } else if (name == "add") {
            this.setState({ showSpotlight: false, showPersonal: false, showAdd: true });
        }
    }

    isMobileDevice = () => {
        return (typeof window.orientation !== "undefined") || (navigator.userAgent.indexOf('IEMobile') !== -1);
    };

    handleScroll = (e) => {
        if(this.isMobileDevice()) {
            const bottom = e.target.scrollHeight - e.target.scrollTop < (e.target.clientHeight*1.2);
            if (bottom  && e.target.scrollTop > 0 && this.state.showSpotlight) {
                this.getSpotlightPosts();
            }
        } else {
            const bottom = e.target.scrollHeight - e.target.scrollTop < (e.target.clientHeight*1.1);
            if (bottom && this.state.showSpotlight) {
                this.getSpotlightPosts();
            }
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
                    {this.props.loaded ? this.generatePosts(this.props.spotlightData) : <Progress isSize="small" max={100} />}
                </div>
                <div className="feed" style={{ display: this.state.showPersonal ? "inline-block" : "none" }}>
                    {this.props.loaded ?
                        <div>
                            <Heading>Based on your previous likes and posts</Heading>
                            {this.generatePosts(this.props.curatedData.posts)}
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

Home.propTypes = {
    loaded: PropTypes.bool.isRequired,
    loadSpotlight: PropTypes.func.isRequired,
    spotlightData: PropTypes.array.isRequired,
    spotlightPage: PropTypes.number.isRequired,
    loadCurated: PropTypes.func.isRequired,
    curatedData: PropTypes.object.isRequired,
}

const mapStateToProps = state => ({
    spotlightData: state.pageInteraction.spotlightData,
    spotlightPage: state.pageInteraction.spotlightPage,
    curatedData: state.pageInteraction.curatedData,
    loaded: state.pageInteraction.loaded
})

export default connect(mapStateToProps, { loadHome, loadSpotlight, loadCurated })(Home);