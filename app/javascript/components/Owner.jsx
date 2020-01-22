import React from 'react';

import Post from './Post';
import 'font-awesome/css/font-awesome.min.css';
import 'bulma/css/bulma.css';
import { Content, Modal, ModalBackground, ModalContent, ModalClose, Title, Tag, Icon } from 'bloomer';
import '../../assets/stylesheets/owner.css';

const Owner = ({ data, is_store, closeOwner }) => {
    const generatePosts = (data) => {
        if (data == undefined) return;

        return data.map((post) => {
            if (is_store) {
                return <Post fullProfile={true} onlyLikes={false} key={post.id} is_store={post['is_store?']} hasTags={false} {...post} />
            } else {
                return <Post fullProfile={true} onlyLikes={false} key={post.id} is_store={post['is_store?']} hasTags={false} hasLink={false} {...post} />
            }
        });
    }
    return (
        <Modal isActive={data ? true : false}>
            <ModalBackground />
            <ModalContent>
                <div className="modal-header">
                    <ModalClose onClick={closeOwner} isSize="large" />
                    <div className="owner-title">
                        <Title>
                            {is_store ?
                                <div>
                                    {data.store.link.includes(data.store.title.toLowerCase()) ? data.store.title : data.store.link.split('.')[0].substr(8)}
                                    |
                                    <a href={data.store.link}>
                                        <Icon className="fa fa-external-link fa-sm"></Icon>
                                    </a>
                                </div>
                                :
                                data.user.username
                            }
                        </Title>
                    </div>
                    <Content>
                        {data.tags.map((tag, i) => <Tag isColor='light' key={i}>{tag}</Tag>)}
                    </Content>
                </div>
                <br />
                <div className="feed">
                    {generatePosts(data.posts)}
                </div>
            </ModalContent>
        </Modal >
    );
};

export default Owner;