import React, { Component } from 'react';
import axios from 'axios';

import ReactTags from 'react-tag-autocomplete';
import 'font-awesome/css/font-awesome.min.css';
import 'bulma/css/bulma.css';
import {
    Field, Label, Control, Delete, Modal, ModalCard, ModalCardTitle,
    ModalBackground, ModalCardHeader, ModalCardBody, ModalCardFooter, Help, Button, Input
} from 'bloomer';
import '../../assets/stylesheets/newpost.css';

class NewPost extends Component {
    constructor(props) {
        super(props);
        this.state = {
            title: "",
            fileName: "",
            image: null,
            suggestions: [],
            tag_list: [],
            status: ""
        }
    }

    componentDidMount() {
        let url = '/api/posts/tags';
        axios.get(url, { withCredentials: true })
            .then(resp => {
                this.setState({ suggestions: resp.data.tags });
            })
            .catch(error => console.log('API ERROR:', error));
    }

    handleChange = (event) => {
        const { name, value } = event.target;
        this.setState({
            status: ''
        });

        if (name == "title") {
            this.setState({ [name]: value })
        } else if (name == "fileName") {
            this.setState({
                [name]: URL.createObjectURL(event.target.files[0]),
                image: event.target.files[0]
            });
        }
    };

    onDelete = (i) => {
        const tag_list = this.state.tag_list.slice(0)
        tag_list.splice(i, 1)
        this.setState({ tag_list })
    }

    onAddition = (tag) => {
        const tag_list = [].concat(this.state.tag_list, tag)
        this.setState({ tag_list });
    }
    onValidate = (tag) => {
        return (this.state.tag_list.length + 1 < 6);
    }
    handleSubmit = (event) => {
        event.preventDefault();

        const { title, tag_list, image, fileName } = this.state;
        const formData = new FormData();
        formData.append('image', image, fileName);
        formData.append('title', title);
        formData.append('tag_list', tag_list.map(tag => tag.name).toString());
        formData.append('is_store?', false);

        axios.post('/api/posts', formData, { withCredentials: true })
            .then(resp => {
                this.props.loadPost(resp.data.post);
            })
            .catch(err => {
                this.setState({ status: 'Could not create post.' });
            });
    };

    render() {
        return (
            <Modal isActive={this.props.isActive}>
                <ModalBackground />
                <ModalCard>
                    <ModalCardHeader>
                        <ModalCardTitle>Add new post</ModalCardTitle>
                        <Delete onClick={this.props.close} />
                    </ModalCardHeader>
                    <ModalCardBody>
                        <Field>
                            <Label>Title</Label>
                            <Control>
                                <Input onChange={this.handleChange} name="title" placeholder='Name of post' />
                            </Control>
                        </Field>
                        <Field>
                            <Label>Picture</Label>
                            {this.state.fileName.length > 0 ?
                                <img src={this.state.fileName} /> : null
                            }
                            <br />
                            <input type="file" name="fileName" accept="image/*" onChange={this.handleChange} />
                        </Field>
                        <Field>
                            <Label>Tags</Label>
                            <p>What styles match this post?</p>
                            <br />
                            <ReactTags
                                placeholderText="Add new style tag (e.g. vintage)"
                                tags={this.state.tag_list}
                                suggestions={this.state.suggestions}
                                onDelete={this.onDelete.bind(this)}
                                onAddition={this.onAddition.bind(this)}
                                onValidate={this.onValidate.bind(this)}
                                delimiters={[' ', 'Enter', 'Tab']}
                                allowNew={true}
                            />
                        </Field>
                        <center>
                            <Help id="newpost-error" className="error" isColor="warning">{this.state.status}</Help>
                        </center>
                    </ModalCardBody>
                    <ModalCardFooter>
                        <Button
                            disabled={!(this.state.title.length > 1 && this.state.tag_list.length > 0 && this.state.fileName.length > 0)}
                            type="submit"
                            isColor="dark"
                            onClick={this.handleSubmit}
                        >
                            Submit
                        </Button>
                    </ModalCardFooter>
                </ModalCard>
            </Modal>
        );
    }
};

export default NewPost;
