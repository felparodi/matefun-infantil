import React from 'react';
import classNames from 'classnames';
import {typeToClass} from '../../../classes/helpers/type';

const Output = ({type, join, onClick}) => (
    <g transform="rotate(90 20 20)" 
        onClick={onClick} 
        className={classNames(typeToClass(type), {'join': join})} >
        <path                    d="M 33 28 L 34 30 L 35 28 L 36 30 L 37 28 L 38 30 L 40 30 L 40 10 L 38 10 L 37 12 L 36 10 L 35 12 L 34 10 L 33 12 Z" />
        <path className="border" d="M 33 28 L 34 30 L 35 28 L 36 30 L 37 28 L 38 30 L 40 30 L 40 25 L 33 25 Z" />
        <path className="border" d="M 40 15 L 40 10 L 38 10 L 37 12 L 36 10 L 35 12 L 34 10 L 33 12 L 33 15 Z" />"
    </g>
);

export default Output;

