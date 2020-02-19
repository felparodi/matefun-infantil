import React from 'react';
import L from './L';

const BottomLeft = (props) => (
    <svg viewBox="0 0 40 40" className={props.className}>
        <L transform="rotate(-180 20 20)"/>
    </svg>
); 
export default BottomLeft;