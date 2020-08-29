import React, { useState, useEffect } from 'react';
import classNames from 'classnames';
import * as toastType from '../constants/toast'
import { Toast } from 'react-bootstrap';
import { connect } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import * as fas from '@fortawesome/free-solid-svg-icons';
//exclamation-triangle

import './ToastMessages.scss';

function iconToast(type) {
    switch(type) {
        case toastType.ERROR:
            return <FontAwesomeIcon icon={fas.faTimesCircle}/>
        case toastType.WARNING:
            return <FontAwesomeIcon icon={fas.faExclamationTriangle}/>
        case toastType.SUCCESS:
            return <FontAwesomeIcon icon={fas.faCheckCircle}/>
        case toastType.INFO:
            return <FontAwesomeIcon icon={fas.faInfoCircle}/>
    }
}

const ToastMessage = ({toast, onClose}) => {
    const [show, setShow] = useState(true);
    const handlerClose = () =>  { 
        setShow(false);
        setTimeout(() => {
            onClose && onClose();
        }, 200);
    }
    useEffect(() => {
      setTimeout(handlerClose, 5000);
    })
    const icon = iconToast(toast.type);
    const texts = toast.text.split('\n');
    return (
        <Toast show={show} onClose={handlerClose}
            className={classNames({
                'error': toast.type === toastType.ERROR,
                'warn': toast.type === toastType.WARNING,
                'info': toast.type === toastType.INFO,
                'success': toast.type === toastType.SUCCESS
            })}>
            <Toast.Header>
                <p>{icon}<b>{toast.title}:</b> {texts[0]}</p>
            </Toast.Header>
            {texts.length > 1 &&
                <div className='toast-body'>
                    {[...texts].splice(1).map((text, index) => <p key={index}>{text}</p>)}
                </div>
            }
        </Toast>
    )
}


export class ToastMessages extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            toastId: 0,
            toasts: [
            ]
        }

        this.closeMessage = this.closeMessage.bind(this);
    }

    componentDidUpdate(prevProps) {
        if(prevProps.newToast !== this.props.newToast) {
            const {toasts, toastId } = this.state;
            const newToast = {...this.props.newToast, id: toastId }
            this.setState({ toasts: [...toasts, newToast], toastId: toastId+1});
        }
    }

    closeMessage(closeToast) {
        const {toasts} = this.state
        this.setState({ toasts: toasts.filter((toast) => toast !== closeToast)})
    }

    render() {
        return (
            <div className="ToastMessages">
                {
                    this.state.toasts
                        .map((toast) =>  (
                            <ToastMessage 
                                key={toast.id} 
                                toast={toast} 
                                onClose={() => this.closeMessage(toast)}/>
                        ))
                }
            </div>
        );
    }
}

const mapStateToProps = state => ({
    newToast: state.toast.newToast
})

export default connect(mapStateToProps)(ToastMessages);