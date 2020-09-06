import React from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames';
import { Modal, Button } from 'react-bootstrap';
import ReactTooltip from 'react-tooltip';
import { closeExportModal, exportFunctions } from '../../api/matefun';
import './Export.scss';
import Icon from '../icons/Icon';
import Pipe from '../pipes/Pipe';
import * as icon from '../../constants/icons';

export class Export extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            pipes: [],
            selected: [],
            name: 'matefun'
        }
        this.onSelect = this.onSelect.bind(this);
        this.onExport = this.onExport.bind(this);
    }

    componentDidMount() {
        const pipes = this.props.myFunctions.map(pipe => pipe.snapshot());
        const selected = pipes.map(() => false);
        this.setState({ pipes, selected });
    }

    componentDidUpdate(prevProp) {
        if(prevProp.myFunctions != this.props.myFunctions) {
            const pipes = this.props.myFunctions.map(pipe => pipe.snapshot());
            const selected = pipes.map(() => false);
            this.setState({ pipes, selected });
        }
        if(prevProp.open != this.props.open) {
            const {pipes} = this.state;
            const selected = pipes.map(() => false);
            this.setState({  selected, name: 'matefun' });
        }
    }

    onSelect(selectedIndex) {
        const { selected } = this.state;
        this.setState({ selected: selected.map((value, index) => index === selectedIndex ? !value : value)});
    }

    onExport() {
        const { pipes, selected, name} = this.state;
        const cFunctions = pipes.filter((_, index) => selected[index])
        this.props.exportFunctions(name, cFunctions);
    }

    render() {
        const { pipes, selected, name } = this.state;
        const { open } = this.props;
        return (
            <Modal className="Export" 
                show={open}
                onHide={() => this.props.closeExportModal()}>
                <Modal.Header closeButton>
                    <h5><Icon icon={icon.EXPORT}/> Exportar funciones</h5>
                </Modal.Header>
                <div className="body">
                    <div className="pipes">
                    {
                        pipes.map((pipe, index) => 
                            <button key={`${index}-custom`}
                                className={classNames('pipe-button', {'select' : selected[index]})}
                                onClick={() => this.onSelect(index)}
                                data-tip={`${pipe.name}`}
                                data-for='pipe-export-custom'>
                                <Pipe pipe={pipe}/>
                            </button>
                        ) 
                    }
                    </div>
                    { pipes.length > 0 && 
                        <ReactTooltip
                            key={pipes.reduce((p, c) => `${p}-${c}`, '')}
                            id='pipe-export-custom' 
                            effect='solid'
                            place='bottom'
                            className='pipe-button-tooltip'
                            delayShow={500}
                        />
                    }
                </div>
                <Modal.Footer>
                    <span className='name-export'>
                        <input type="text" value={name}
                            onChange={(event) => this.setState({ name:event.target.value})}/>
                        .mf
                    </span>
                    <Button variant="primary"
                        className="mf-primary-button"
                        onClick={this.onExport}
                        disabled={!name}> Exportar
                    </Button>
                </Modal.Footer>
            </Modal>
        )
    }
}

const mapStateToProps = state => ({
    open: state.environment.modalExport,
    myFunctions: state.environment.myFunctions
});

const mapDispatchFunction = {
    closeExportModal,
    exportFunctions
}

export default connect(mapStateToProps, mapDispatchFunction)(Export);
