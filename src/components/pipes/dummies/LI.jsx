import React from 'react';
import I from './I';

const LI = (props) => (
    <svg viewBox="0 0 40 40" className={props.className}>
        <I transform="rotate(270 20 20)"/>
    </svg>
);

export default LI;