import React from 'react';
import classNames from 'classnames';
import ReactTooltip from 'react-tooltip';
import {isList, listSubType} from '../../classes/helpers/type'
import { connect } from 'react-redux';
import { VALUES_TYPES } from '../../constants/constants';
import Icon from '../icons/Icon';
import * as icons from '../../constants/icons';
import MateFun2D from '../graph/MateFun2D';
import ModalGraphic from '../modal/ModalGraphic';
import './DisplayResult.scss';

export const typeTranslate = (type) => {
    switch(type) {
        case VALUES_TYPES.NUMBER:
            return 'Numero';
        case VALUES_TYPES.POINT:
            return 'Punto';
        case VALUES_TYPES.COLOR:
            return 'Color'
        case VALUES_TYPES.FIGURE:
            return 'Imagen';
        case VALUES_TYPES.list(VALUES_TYPES.FIGURE):
            return 'Animacion';
    }
    if(isList(type)) {
        return 'Lista de ' + typeTranslate(listSubType(type))
    } else {
        return type
    }
}

const DisplayValue = ({ hasError, type, value, text}) => {
    if(hasError) return <textarea className="info result" readOnly value={text}/>;
    switch(type) {
        case VALUES_TYPES.FIGURE:
        case VALUES_TYPES.list(VALUES_TYPES.FIGURE):
            return <MateFun2D value={value} type={type}/>;
        case VALUES_TYPES.POINT:
            const pos = text.replace(/[\(\)]/g,'').split(',')
            return (
                <div className="point">
                    <p className="line">
                        <span className="label">Valor X:</span><span className="value">{pos[0]}</span>
                    </p>
                    <p className="line">
                        <span className="label">Valor Y:</span><span className="value">{pos[1]}</span>
                    </p>
                </div>
            );
        case VALUES_TYPES.NUMBER:
        case VALUES_TYPES.COLOR:
            return (
                <p className="line">
                     <span className="label">Valor:</span><span className="value">{text}</span>
                </p>
            );
        default:
            return <textarea className="info result" readOnly value={text}/>;

    }
}

const ExpandButton = ({onClick}) => (
    <React.Fragment>
        <button className="expand-button"
            data-tip='Pantalla completa'
            data-for='expands'
            onClick={onClick}>
            <Icon icon={icons.EXPAND_WINDOWS}/>
        </button>
        <ReactTooltip
            key='expands'
            id='expands' 
            effect='solid'
            place='bottom'
            delayShow={500}
        />    
    </React.Fragment>
)

export class DisplayResult extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            graphModal: false,
            minimized: false
        }
    }

    render() {
        const { lastEvalValue } = this.props;
        const { hasError, value, text, type } = lastEvalValue;
        const { graphModal, minimized } = this.state;
        if(!type) return null;
        const graph = type  === VALUES_TYPES.FIGURE  || type === VALUES_TYPES.list(VALUES_TYPES.FIGURE);

        return (
            <div className={classNames("DisplayResult info-panel", { 'graph' : graph, 'minimized': minimized})}>
                <div className="title">
                    <p>
                        <span className='action' onClick={() => this.setState({minimized:!minimized})}>{minimized ? '+' : '-'}</span>
                        Resultado: {hasError ? 'Error' : typeTranslate(type)}
                    </p>
                </div>
                { graph && !minimized && 
                    <ExpandButton
                        onClick={() => this.setState({graphModal: true})}/>
                }
                { !minimized && 
                    <DisplayValue 
                        hasError={hasError} 
                        type={type} 
                        value={value}
                        text={text}/> 
                }
                { graphModal && graph && !minimized &&
                    <ModalGraphic 
                        open={graphModal}
                        onClose={() => this.setState({graphModal: false})} 
                        value={value} 
                        type={type}/>
                }
            </div>
        )
      
    }
}

const mapStateToProps = state => {
    return {
        lastEvalValue: state.matrix.lastEvalValue,
    }
}

const mapDispatchToProps = {
}


export default connect(mapStateToProps, mapDispatchToProps)(DisplayResult);