import React from 'react';
import classNames from 'classnames';
import {typeToClass} from '../../../classes/helpers/type';

const InputLeft = ({type, onClick, join}) => (
    <g className={classNames(typeToClass(type), {'join': join})} onClick={onClick}>
        <path d="M 0 10 L 0 30 L 7 30 L 7 10"/>
        <path className="border" d="M 0 25 L 0 30 L 7 30 L 7 25"/>
        <path className="border" d="M 0 10 L 0 15 L 7 15 L 7 10"/>
    </g>
)

export default InputLeft;