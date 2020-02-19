import React from 'react';
import T from './T';

const URL = (props) => (
    <svg viewBox="0 0 40 40" className={props.className}>
        <T transform="rotate(270 20 20)"/>
    </svg>
);

export default URL;
