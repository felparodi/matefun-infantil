import React from 'react';

const Vertical = (props) => (
    <svg viewBox="0 0 40 40" className={props.className}>
        <g>
            <path d="M 10 0 L 10 40 L 30 40 L 30 0 z"/>
            <path className="border" d="M 10 0 L 10 40 L 15 40 L 15 0 z"/>
            <path className="border" d="M 25 0 L 25 40 L 30 40 L 30 0 z"/>
        </g>
    </svg>
);

export default Vertical