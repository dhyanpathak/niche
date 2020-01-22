import React, { useState } from 'react';
import axios from 'axios';
import Owner from './Owner';
import 'font-awesome/css/font-awesome.min.css';
import 'bulma/css/bulma.css';
import { Box } from 'bloomer';
import '../../assets/stylesheets/post.css';

const ResultBox = ({ data, is_store }) => {
    const [owner, setOwner] = useState(0);
    const [displayOwner, setDisplayOwner] = useState(false);

    const closeOwner = (e) => {
        setDisplayOwner(false);
        e.stopPropagation();
    }
    const getOwner = () => {
        if (!owner) {
            if (is_store) {
                axios.get('/api/stores/' + data.id, { withCredentials: true })
                    .then(resp => {
                        setOwner(resp.data);
                        setDisplayOwner(true);
                    })
                    .catch(error => console.log('API ERROR:', error));
            } else {
                axios.get('/api/users/' + data.id, { withCredentials: true })
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
        <Box style={{ display: 'inline-block', marginLeft: '5px' }} onClick={getOwner}>
            {displayOwner ? <Owner is_store={is_store} data={owner} closeOwner={closeOwner} /> : null}
            {is_store ? <p>{data.title}</p> : <p>{data.username}</p>}
        </Box>
    )
};

export default ResultBox;