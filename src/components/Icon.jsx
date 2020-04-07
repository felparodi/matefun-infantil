import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import * as fas from '@fortawesome/free-solid-svg-icons';
import * as icons from './../constants/icons'

const Icon = ({icon}) => {
    switch(icon) {
        case icons.CALCULATOR:
            return <FontAwesomeIcon icon={fas.faCalculator}/>
        default:    
            return <span>{icon}</span>;
    }
    
}

export default Icon;