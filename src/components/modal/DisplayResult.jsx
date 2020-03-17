import React from 'react';
import classNames from 'classnames';
import {VALUES_TYPES} from '../../constants/constants';
import { Modal } from 'react-bootstrap';
import MateFun2D from '../graph/MateFun2D';
import './DisplayResult.scss';

export class DisplayResult extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        const { props } = this;
        const { value, valuetext, type} = props;
        const graph = type  === VALUES_TYPES.FIGURE  || type === VALUES_TYPES.list(VALUES_TYPES.FIGURE);
        return (
            <Modal className={classNames("DisplayResult", {'no-graph': !graph} )} {...props}>
                <p className="title">({type})</p>
                { 
                    graph ?
                    <MateFun2D value={value} type={type}/> :
                    <textarea className="info result" readOnly value={valuetext}/>
                }
            </Modal>
        )
    }
}