import React from 'react';

const L = (props) => (
    <g transform={props.transform}>
        <path                    d="M 10 0 L 10 25 C 10 30 15 30 15 30 L 40 30 L 40 10 L 35 10 C 35 10 30 10 30 05 L 30 0 z"/>
        <path className="border" d="M 10 0 L 10 25 C 10 30 15 30 15 30 L 40 30 L 40 25 L 17 25 C 15 25 15 25 15 25 L 15 0 z"/> 
        <path className="border" d="M 25 0 L 25 15 C 10 15 10 15 15 15 L 40 15 L 40 10 L 35 10 C 35 10 30 10 30 05 L 30 0 z"/>
    </g>
);

export default L;
