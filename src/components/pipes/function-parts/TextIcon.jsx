import React, { useState } from 'react';

const fontSize = (text) => {
    if(text.length < 3) {
        return '20px';
    } else if ( text.length < 5) {
        return '15px';
    } else if ( text.length < 7) {
        return '8px';
    } else if ( text.length < 10) {
        return '6px';
    } else {
        return '4px';
    }
}

const textPrint = (text) => {
    return text.length < 11 ? text : `${text.substr(0, 8)}...`;
}

const TextIcon = ({text, onClick, onDoubleClick}) => {
    return (
        <text x="50%" y="45%" 
            dominantBaseline="central" 
            textAnchor="middle" 
            onClick={onClick}
            onDoubleClick={onDoubleClick}
            fontSize={fontSize(text)} 
            fill='white'>
            { textPrint(text) }
        </text>
    );
};

export default TextIcon