import React, { Component } from 'react';
import axios from 'axios'
import 'bulma/css/bulma.css';
import { Button, Controller, Label, Field, Title, Input, Help } from 'bloomer';
import '../../../assets/stylesheets/auth.css';
import { Container } from 'bloomer/lib/layout/Container';

class Signup extends Component {
    constructor(props) {
        super(props);
        this.state = {
            username: '',
            email: '',
            password: '',
            confirmed_password: '',
            errors: ''
        };
    }
    redirect = () => {
        this.props.history.push('/app');
    }
    handleChange = (event) => {
        const { name, value } = event.target
        this.setState({
            [name]: value
        });
        if (name == "confirmed_password" && this.state.password !== value) {
            this.state.errors = "Passwords don't match";
        } else {
            this.state.errors = "";
        }
    };

    handleSubmit = (event) => {
        event.preventDefault();
        const { username, email, password, confirmed_password } = this.state;
        let user = {
            username,
            email,
            password,
            password_confirmation: confirmed_password
        };
        axios.post('/api/users', { user }, { withCredentials: true })
            .then(resp => {
                if (resp.data.status === 'created') {
                    this.props.handleLogin(resp.data);
                    this.redirect();
                } else {
                    this.setState({
                        errors: resp.data.errors
                    })
                }
            })
            .catch(err => console.log("API ERROR", err));
    };

    redirect = () => {
        this.props.history.push('/app');
    }

    render() {
        const { errors, username, email, password, confirmed_password } = this.state

        return (
            <Container>
                <form onSubmit={this.handleSubmit}>
                    <Title isSize={2}>Sign Up</Title>
                    <Field isHorizontal>
                        <Label>Username</Label>
                        <Input
                            name="username"
                            type="username"
                            placeholder="username"
                            autoComplete="none"
                            value={username}
                            onChange={this.handleChange}
                        />
                    </Field>
                    <Field isHorizontal>
                        <Label>Email</Label>
                        <Input
                            name="email"
                            type="email"
                            placeholder="person@email.com"
                            autoComplete="none"
                            value={email}
                            onChange={this.handleChange}
                        />
                    </Field>
                    <Field isHorizontal>
                        <Label>Password</Label>
                        <Input
                            name="password"
                            type="password"
                            placeholder="******"
                            autoComplete="none"
                            value={password}
                            onChange={this.handleChange}
                        />
                    </Field>
                    <Field isHorizontal>
                        <Label>Re-type</Label>
                        <Input
                            placeholder="******"
                            type="password"
                            name="confirmed_password"
                            value={confirmed_password}
                            onChange={this.handleChange}
                        />
                    </Field>
                    <center>
                        <Help id="signin-error" className="error" isColor="warning">{errors}</Help>
                        <Button type="submit">Enter</Button>
                    </center>
                </form>
            </Container>
        );
    }
}
export default Signup;