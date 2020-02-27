import React from 'react';

const Horizontal = (prop) => (
    <svg viewBox="0 0 40 40" className={prop.className}>
        <g>
            <path d="M 0 10 L 40 10 L 40 30 L 0 30 z"/>
            <path className="border" d="M 0 10 L 40 10 L 40 15 L 0 15 z"/>
            <path className="border" d="M 0 30 L 40 30 L 40 25 L 0 25 z"/>
        </g>
    </svg>
);

export default Horizontal