import React, { useState, useEffect } from 'react';
import { Toast } from 'react-bootstrap';
import { connect } from 'react-redux';

import './ToastMessages.scss';

const ToastMessage = ({toast, onClose}) => {
    const [show, setShow] = useState(true);
    const handlerClose = () =>  { 
        setShow(false);
        setTimeout(() => {
            onClose && onClose();
        }, 200);
    }
    useEffect(() => {
        setTimeout(handlerClose, 5000)
    })

    return (
        <Toast show={show} onClose={handlerClose}>
            <Toast.Header>
            <strong className="mr-auto">{toast.title}</strong>
            </Toast.Header>
            <Toast.Body>{toast.text}</Toast.Body>
        </Toast>
    )
}


export class ToastMessages extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            toastId: 0,
            toasts: []
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