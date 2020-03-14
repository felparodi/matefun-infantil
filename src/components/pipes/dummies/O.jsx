import React from 'react';

const O = (props) => (
    <svg viewBox="0 0 40 40" className={props.className}>
        <g>
            <circle className="border" cx="20" cy="20" r="10" />
            <circle cx="20" cy="20" r="5" />
        </g>
    </svg>
);

export default O;
