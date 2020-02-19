import React from 'react';

const T = (props) => (
    <g transform={props.transform}>
        <path d="M 10 0 L 10 40 L 30 40 C 30 30 35 30 35 30 L 40 30 L 40 10 C 30 10 30 5 30 5 L 30 0 Z"/>
        <path className="border" d="M 10 0 L 10 40 L 15 40 L 15 0 Z"/>
        <path className="border" d="M 30 40 C 30 30 35 30 35 30 L 40 30 L 40 25 L 25 25 L 25 40 Z"/>
        <path className="border" d="M 40 10 C 30 10 30 5 30 5 L 30 0 L  25 0 L 25 15 L 40 15 Z"/>
    </g>
);

export default T;