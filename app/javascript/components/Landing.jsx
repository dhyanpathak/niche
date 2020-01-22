import React, { Component } from 'react';
import Signin from './auth/Signin';
import Signup from './auth/Signup';
import 'bulma/css/bulma.css';
import { Hero, HeroHeader, HeroBody, Container, HeroFooter, Button, Title, Heading } from 'bloomer';
import '../../assets/stylesheets/landing.css';

class Landing extends Component {
    constructor(props) {
        super(props);
        this.state = {
            welcome: true,
            signin: false,
            signup: false
        };
    }

    componentWillMount() {
        return this.props.loggedInStatus ? this.props.history.push('/app') : null;
    }

    switchSignIn = () => {
        this.setState({
            welcome: !this.state.welcome,
            signin: !this.state.signin
        })
    }

    switchSignUp = () => {
        this.setState({
            welcome: !this.state.welcome,
            signup: !this.state.signup
        })
    }

    render() {
        return (
            <Hero className="bg" isFullHeight isFullWidth>
                <HeroHeader>
                </HeroHeader>
                <HeroBody isFullWidth hasTextAlign="centered" >
                    <Container isFullWidth className="banner">
                        <div style={{ display: this.state.welcome ? "block" : "none" }}>
                            <Title className="title">niche</Title>
                            <Heading className="slogan">curated fashion from indie brands</Heading><br />
                            <div>
                                <Button isColor='white' isOutlined isSize="medium" style={{ margin: 10 }} onClick={this.switchSignIn} >Log in</Button>
                                <Button isColor='white' isOutlined isSize="medium" style={{ margin: 10 }} onClick={this.switchSignUp} >Signup</Button>
                            </div>
                        </div>
                        <div style={{ display: this.state.signin ? "block" : "none" }} >
                            <a className="close" onClick={this.switchSignIn} >{"< back"}</a>
                            <Signin {...this.props} />
                        </div>
                        <div style={{ display: this.state.signup ? "block" : "none" }}>
                            <a className="close" onClick={this.switchSignUp} >{"< back"}</a>
                            <Signup {...this.props} />
                        </div>
                    </Container>
                </HeroBody>
                <HeroFooter hasTextAlign="centered" >
                    <p className="author">created by Dhyan Pathak</p>
                </HeroFooter>
            </Hero>
        )
    }
};

export default Landing;