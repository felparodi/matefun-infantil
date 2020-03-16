import React from 'react';
import classNames from 'classnames';
import {typeToClass} from '../../../classes/helpers/type';

const InputTop = ({type, join, onClick}) => (
    <g className={classNames(typeToClass(type), {'join': join})} onClick={onClick}>
        <path d="M 10 0 L 10 7 L 30 7 L 30 0"/>
        <path className="border" d="M 10 0 L 10 7 L 15 7 L 15 0"/>
        <path className="border" d="M 25 0 L 25 7 L 30 7 L 30 0"/>
    </g>
);

export default InputTop;
