import React, { Component } from 'react';
import axios from 'axios';

import 'bulma/css/bulma.css';
import { Button, Label, Field, Container, Title, Input, Help } from 'bloomer';
import '../../../assets/stylesheets/auth.css';

class Signin extends Component {
    constructor(props) {
        super(props);
        this.state = {
            username: '',
            password: '',
            errors: ''
        };
    }

    redirect = () => {
        this.props.history.push('/app');
    }

    handleChange = (event) => {
        const { name, value } = event.target
        this.setState({
            [name]: value,
            errors: ''
        })
    };

    handleSubmit = (event) => {
        event.preventDefault();
        const { username, email, password } = this.state;
        let user = {
            username,
            email,
            password
        };
        axios.post('/login', { user }, { withCredentials: true })
            .then(resp => {
                if (resp.data.logged_in) {
                    this.props.handleLogin(resp.data);
                    this.redirect();
                } else {
                    this.setState({
                        errors: resp.data.errors
                    })
                }
            })
            .catch(err => console.log('API ERROR', err))
    };

    render() {
        const { username, errors, password } = this.state

        return (
            <Container isFluid>
                <form onSubmit={this.handleSubmit}>
                    <Title isSize={2}>Sign In</Title>
                    <Field isHorizontal hasTextAlign="centered" >
                        <Label>Username</Label>
                        <Input
                            name="username"
                            type="text"
                            placeholder="username"
                            autoComplete="none"
                            value={username}
                            onChange={this.handleChange}
                        />
                    </Field>
                    <Field isHorizontal>
                        <Label>Password</Label>
                        <Input
                            name="password"
                            type="password"
                            placeholder="*******"
                            autoComplete="none"
                            value={password}
                            onChange={this.handleChange}
                        />
                    </Field>
                    <center>
                        <br />
                        <Help id="signin-error" className="error" isColor="warning">{errors}</Help>
                        <Button type="submit">Enter</Button>
                    </center>
                </form>
            </Container>
        );
    }
}
export default Signin;