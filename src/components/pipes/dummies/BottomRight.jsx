import React from 'react';
import L from './L';

const BottomRight = (props) => (
    <svg viewBox="0 0 40 40" className={props.className}>
        <L transform="rotate(90 20 20)"/>
    </svg>
);

export default BottomRight;