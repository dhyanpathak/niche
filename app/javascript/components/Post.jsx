import React, { useState } from 'react';
import axios from 'axios';

import { connect } from 'react-redux';
import { likePost } from '../actions';

import Owner from './Owner';
import 'font-awesome/css/font-awesome.min.css';
import 'bulma/css/bulma.css';
import { Tag, Content, Card, CardHeader, CardContent, CardHeaderTitle, CardImage, Icon, CardFooter, CardFooterItem } from 'bloomer';
import '../../assets/stylesheets/post.css';

const Post = (props) => {
    const { id, title, image, link, is_liked, is_store, by, tag_list, onlyLikes, fullProfile, hasTags, hasLink } = props;
    const [liked, setLiked] = useState(onlyLikes ? true : (is_liked !== undefined ? is_liked : false));
    const [owner, setOwner] = useState(0);
    const [displayOwner, setDisplayOwner] = useState(false);

    const togglePostLiked = (bool) => {
        setLiked(bool);
        props.likePost(id);
    }

    const closeOwner = () => {
        setDisplayOwner(false);
    }
    const getOwner = () => {
        if (!owner) {
            if (is_store) {
                axios.get('/api/stores/' + by, { withCredentials: true })
                    .then(resp => {
                        setOwner(resp.data);
                        setDisplayOwner(true);
                    })
                    .catch(error => console.log('API ERROR:', error));
            } else {
                axios.get('/api/users/' + by, { withCredentials: true })
                    .then(resp => {
                        setOwner(resp.data);
                        setDisplayOwner(true);
                    })
                    .catch(error => console.log('API ERROR:', error));
            }
        } else {
            setDisplayOwner(true);
        }
    }

    return (
        <div style={{ display: 'inline-block' }}>
            {displayOwner ? <Owner is_store={is_store} data={owner} closeOwner={closeOwner} /> : null}
            <Card isHidden={onlyLikes && !liked ? true : false}>
                <CardHeader>
                    <CardHeaderTitle>
                        {title}
                    </CardHeaderTitle>
                </CardHeader>
                <CardImage className='image is-square' onDoubleClick={() => togglePostLiked(!liked)}>
                    <img src={image} />
                </CardImage>
                {(hasTags || true) ?
                    <CardContent>
                        <Content>
                            {
                                tag_list.map((tag, i) => <Tag isColor='light' key={i}>{tag}</Tag>)
                            }
                        </Content>
                    </CardContent>
                    :
                    <br />
                }
                {(fullProfile || false) ?
                    <CardFooter>
                        <CardFooterItem onClick={() => togglePostLiked(!liked)}>
                            <Icon className={liked ? "fa fa-heart liked" : "fa fa-heart"}></Icon>
                        </CardFooterItem>
                        {(hasLink || true) ?
                            <CardFooterItem href={link}>
                                <Icon className="fa fa-link"></Icon>
                            </CardFooterItem>
                            : ''
                        }
                    </CardFooter>
                    :
                    <CardFooter>
                        <CardFooterItem onClick={getOwner}>
                            <Icon className="fa fa-external-link"></Icon>
                        </CardFooterItem>
                        <CardFooterItem onClick={() => togglePostLiked(!liked)}>
                            <Icon className={liked ? "fa fa-heart liked" : "fa fa-heart"}></Icon>
                        </CardFooterItem>
                        {(hasLink || true) ?
                            <CardFooterItem href={link}>
                                <Icon className="fa fa-link"></Icon>
                            </CardFooterItem>
                            : ''
                        }
                    </CardFooter>
                }
            </Card>
        </div>
    )
};

export default connect(null, { likePost })(Post);