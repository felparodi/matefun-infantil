import React from 'react';
import classNames from 'classnames';
import {typeToClass} from '../../../classes/helpers/type';

const InputRight = ({type, join, onClick}) => (
    <g className={classNames(typeToClass(type), {'join': join})} onClick={onClick}>
        <path d="M 33 10 L 33 30 L 40 30 L 40 10"/>
        <path className="border" d="M 33 10 L 33 15 L 40 15 L 40 10"/>
        <path className="border" d="M 33 25 L 33 30 L 40 30 L 40 25"/>
    </g>
);


export default InputRight;