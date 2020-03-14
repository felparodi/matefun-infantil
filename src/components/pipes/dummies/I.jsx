import React from 'react';

const I = (props) => (
    <g transform={props.transform}>
        <path className="border" d="M 10 0 L 10 20 L 30 20 L 30 0 z"/>
        <circle className="border" cx="20" cy="20" r="10" />
        <path d="M 15 0 L 15 20 L 25 20 L 25 0 z"/>
        <circle cx="20" cy="20" r="5" />
    </g>
);

export default I