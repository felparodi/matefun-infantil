import React from 'react';

const Cross = (props) => (
    <svg viewBox="0 0 40 40" className={props.className}>
        <path d="M 10 0 L 30 0 L 30 10 L 40 10 L 40 30 L 30 30 L 30 40 L 10 40 L 10 30 L 0 30 L 0 10 L 10 10 Z"/>
        <path className="border" d="M 10 0 L 10 10 L 0 10 L 0 15 L 15 15 L 15 0 Z"/>
        <path className="border" d="M 30 0 L 30 10 L 40 10 L 40 15 L 25 15 L 25 0 Z"/>
        <path className="border" d="M 40 30 L 30 30 L 30 40 L 25 40 L 25 25 L 40 25 Z"/>
        <path className="border" d="M 0 30 L 10 30 L 10 40 L 15 40 L 15 25 L 0 25 Z"/>
    </svg>
);

export default Cross;