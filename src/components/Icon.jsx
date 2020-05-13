import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import * as fas from '@fortawesome/free-solid-svg-icons';
import * as far from '@fortawesome/free-regular-svg-icons';
import * as icons from './../constants/icons'

function getFontAwesomeIcon(icon) {

    switch(icon) {
        // toolbox
        case icons.CALCULATOR:
            return fas.faCalculator
        case icons.SHAPES:
            return fas.faShapes
        // ui buttons
        case icons.USER:
            return fas.faUser
        case icons.CLEAN:
            return fas.faBroom
        case icons.PLAY:
            return fas.faPlay
        case icons.SAVE:
            return fas.faSave
        case icons.CONSOLE:
            return fas.faTerminal
        case icons.COLLAPSE:
            return fas.faAngleDoubleRight
        case icons.EXPAND:
            return fas.faAngleDoubleLeft
        case icons.TRASH:
            return fas.faTrash
        case icons.EXPAND_WINDOWS:
            return fas.faExpand;
        // graphic buttons
        case icons.ZOOM_IN:
            return fas.faSearchPlus
        case icons.ZOOM_OUT:
            return fas.faSearchMinus
        case icons.CENTER:
            return fas.faArrowsAlt
        case icons.DOWNLOAD:
            return fas.faDownload
        // primitive functions
        case icons.PLUS:
            return fas.faPlus
        case icons.MINUS:
            return fas.faMinus
        case icons.TIMES:
            return fas.faTimes
        case icons.DIVIDE:
            return fas.faDivide
        case icons.EQUAL:
            return fas.faEquals
        case icons.NOT_EQUAL:
            return fas.faNotEqual
        case icons.GREATER:
            return fas.faGreaterThan  
        case icons.GREATER_EQUAL:
            return fas.faGreaterThanEqual
        case icons.LESS:
            return fas.faLessThan  
        case icons.LESS_EQUAL:
            return fas.faLessThanEqual                
        case icons.CIRCLE:
            return far.faCircle 
        case icons.ROTATE:
            return fas.faRedo 
        case icons.PAINT:
            return fas.faFillDrip
        case icons.MOVE:
            return fas.faArrowsAlt
        case icons.SCALE:
            return fas.faExpand       
        case icons.GROUP:
            return fas.faObjectGroup        
        default:    
            return null;
    }
}

const Icon = ({icon, color, size}) => {
    var faIcon= getFontAwesomeIcon(icon);
    if (faIcon){
        return <FontAwesomeIcon icon={faIcon} color={color} style={(size)?{width: size, height: size}:{}}/>
    } else {
        return <span>{icon}</span>;
    }
}

export default Icon;