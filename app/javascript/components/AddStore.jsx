import React, { Component } from 'react';
import axios from 'axios';

import ReactTags from 'react-tag-autocomplete';
import 'font-awesome/css/font-awesome.min.css';
import 'bulma/css/bulma.css';
import { Help, Panel, PanelHeading, PanelBlock, Button, Control, Input, Icon } from 'bloomer';
import '../../assets/stylesheets/addstore.css';

class AddStore extends Component {
    constructor(props) {
        super(props);
        this.state = {
            link: "",
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

        const headers = {
            'Content-Type': 'application/json'
        }
        if (name == "link") {
            let url = value.replace("http://", "https://") + '/products.json';
            if (!url.includes("https://")) {
                url = "https://" + url;
            }

            axios.get(url, { headers })
                .then(resp => {
                    if (resp.data.hasOwnProperty("products")) {
                        this.setState({ link: value, status: "Valid Shopify store!" });
                    } else {
                        this.setState({ status: "Invalid Shopify store!", link: "" })
                    };
                })
                .catch(error => {
                    this.setState({ status: "Invalid Shopify store!", link: "" })
                });
        };
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
        const { link, tag_list } = this.state;

        let storeInfo = {
            link,
            tag_list: tag_list.map(tag => tag.name).toString()
        };

        axios.post('/api/stores', storeInfo, { withCredentials: true })
            .then(resp => {
                this.setState({ status: 'Successfully added store!' });
            })
            .catch(err => {
                this.setState({ status: 'Could not save store, possibly because it already exists in the app.' });
            });
    };

    render() {
        return (
            <div id="addstore">
                <Panel>
                    <PanelHeading>Add a Shopify store</PanelHeading>
                    <PanelBlock>
                        <Control hasIcons='left'>
                            <Input onChange={this.handleChange} name="link" placeholder='Enter a Shopify URL' />
                            <Icon isSize='small' isAlign='left' className='fa fa-shopping-bag' />
                        </Control>
                    </PanelBlock>
                    <PanelBlock>
                        <p>What styles match this store's clothes?</p>
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
                    </PanelBlock>
                    <PanelBlock>
                        <center>
                            <Help id="addstore-error" className="error" isColor="warning">{this.state.status}</Help>
                            <Button disabled={!(this.state.link.length > 1 && this.state.tag_list.length > 0)} type="submit" onClick={this.handleSubmit}>Add</Button>
                        </center>
                    </PanelBlock>
                </Panel>
            </div>
        );
    }
};

export default AddStore;