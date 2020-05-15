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
        case icons.SAVE_ALT:
            return far.faSave
        case icons.CONSOLE:
            return fas.faTerminal
        case icons.COLLAPSE:
            return fas.faChevronRight
        case icons.EXPAND:
            return fas.faChevronLeft
        case icons.TRASH:
            return fas.faTrash
        case icons.EXPAND_WINDOWS:
            return fas.faExpand;
        case icons.CANCEL: 
            return fas.faTimes;
        case icons.CONFIG:
            return fas.faCogs
        case icons.LOGOUT:
            return fas.faPowerOff
        // graphic buttons
        case icons.ZOOM_IN:
            return fas.faSearchPlus
        case icons.ZOOM_OUT:
            return fas.faSearchMinus
        case icons.CENTER:
            return fas.faArrowsAlt
        case icons.DOWNLOAD:
            return fas.faDownload
        // PRIMITIVE FUNCTIONS
        // math
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
        case icons.ROOT:
            return fas.faSquareRootAlt;
        case icons.EXP:
            return fas.faSuperscript;
        // figures               
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
        // CUSTOM FUNCTIONS
        // random objects
        case icons.SNOWMAN:
            return fas.faSnowman
        case icons.UMBRELLA:
            return fas.faUmbrella
        case icons.HEART:
            return fas.faHeart
        case icons.DICE:
            return fas.faDice
        case icons.CROWN:
            return fas.faCrown
        // astronomy
        case icons.MOON:
            return fas.faMoon
        case icons.STAR:
            return fas.faStar
        case icons.SUN:
            return fas.faSun
        // food
        case icons.HAMBURGER:
            return fas.faHamburger     
        case icons.PIZZA:
            return fas.faPizzaSlice
        case icons.ICE_CREAM:
            return fas.faIceCream
        // transport
        case icons.PLANE:
            return fas.faPlane
        case icons.CAR:
            return fas.faCarSide
        case icons.BICYCLE:
            return fas.faBicycle
        // animals
        case icons.DOG:
            return fas.faDog
        case icons.CAT:
            return fas.faCat
        case icons.SPIDER:
            return fas.faSpider
        case icons.FISH:
            return fas.faFish
        // music
        case icons.MUSIC:
            return fas.faMusic
        case icons.DRUM:
            return fas.faDrum
        case icons.GUITAR:
            return fas.faGuitar
        // sports
        case icons.BASKETBALL_BALL:
            return fas.faBasketballBall
        // wearable
        case icons.COWBOY_HAT:
            return fas.faHatCowboy
        case icons.GLASSES:
                return fas.faGlasses
        case icons.TSHIRT:
            return fas.faTshirt
        case icons.SOCKS:
            return fas.faSocks
        case icons.MASK:
                return fas.faMask
        default:    
            return null;
    }
}

function getCustomIcon(icon) {

    switch(icon) {
        // toolbox
        case icons.INPUT:
            return (
                <path d="M 20 0 C 10 0 0 10 0 20 C 0 30 10 20 10 30 L 10 33 L 30 33 L 30 30 C 30 20 40 30 40 20 C 40 0 20 0 20 0 z"/>
            )
        case icons.WINDOW:
            return (   
                <g>
                    <path id="p1" d="M 5 5 L 5 30 L 35 30 L 35 5 Z" style={
                        {'fill': 'transparent', 'stroke': 'currentColor', 'strokeWidth': 4}}/>      
                    <line x1="20" y1="5" x2="20" y2="30" style={{'stroke':'currentColor', 'strokeWidth':4}}/>
                    <circle cx="18.6" cy="17" r="0.5" stroke="currentColor" fill="red" strokeWidth="6"/>
                    <circle cx="21.4" cy="17" r="0.5" stroke="currentColor" fill="red" strokeWidth="6"/>
                </g>
            )
        case icons.LIST:
            return (
                <g>
                    <circle cx="20" cy="5" r="1" stroke="currentColor" fill="red" strokeWidth="6"/>
                    <circle cx="20" cy="15" r="1" stroke="currentColor" fill="red" strokeWidth="6"/>
                    <circle cx="20" cy="25" r="1" stroke="currentColor" fill="red" strokeWidth="6"/>
                    <circle cx="20" cy="35" r="1" stroke="currentColor" fill="red" strokeWidth="6"/>
                </g>
            );
        default:    
            return null;
    }
}

const Icon = ({icon, color, size}) => {
    var faIcon= getFontAwesomeIcon(icon);
    if (faIcon){
        return <FontAwesomeIcon icon={faIcon} color={color} style={(size)?{width: size, height: size}:{}}/>
    } else {
        var customIcon= getCustomIcon(icon);
        if (customIcon) {
            return (
                <svg viewBox="0 0 40 40" fill={color}>
                    {customIcon}
                </svg>
            )
        } else {
            return <span>{icon}</span>;
        }
    }
}

export default Icon;