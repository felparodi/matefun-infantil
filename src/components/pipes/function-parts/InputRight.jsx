import React from 'react';

const InputRight = (props) => (
    <g className={props.className} onClick={props.onClick}>
        <path d="M 33 10 L 33 30 L 40 30 L 40 10"/>
        <path className="border" d="M 33 10 L 33 15 L 40 15 L 40 10"/>
        <path className="border" d="M 33 25 L 33 30 L 40 30 L 40 25"/>
    </g>
);


export default InputRight;