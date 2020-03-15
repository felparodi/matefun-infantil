import React from 'react';

const InputLeft = (props) => (
    <g className={props.className} onClick={props.onClick}>
        <path d="M 0 10 L 0 30 L 7 30 L 7 10"/>
        <path className="border" d="M 0 25 L 0 30 L 7 30 L 7 25"/>
        <path className="border" d="M 0 10 L 0 15 L 7 15 L 7 10"/>
    </g>
)

export default InputLeft;