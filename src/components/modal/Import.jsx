import React from 'react';
import { connect } from 'react-redux';
import Dropzone from 'react-dropzone';
import ReactTooltip from 'react-tooltip';
import { Modal, Button } from 'react-bootstrap';
import { closeImportModal, getCustomFunctionsByText, amendMyFunctions } from '../../api/matefun';
import './Import.scss';
import Icon from '../icons/Icon';
import Pipe from '../pipes/Pipe';
import * as icon from '../../constants/icons';


const PipeDisplay = ({pipes}) => (
    <React.Fragment>
        <div className='pipes'>
            {
                pipes.map((pipe, index) => 
                    <button key={`${index}-custom`}
                        className={'pipe-button'}
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
    </React.Fragment>
)

const UploadFile = ({onUpload}) => (
    <Dropzone onDrop={onUpload}>
        {({getRootProps, getInputProps}) => (
            <section>
                <div className="uploaded-file" {...getRootProps()}>
                    <input {...getInputProps()} />
                        <p className="uploaded-file-text">Subir archivo</p>
                </div>
            </section>
        )}
    </Dropzone>
)

export class Import extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            pipes: [],
            textFile: '',
            name: ''
        }
        this.onUpload = this.onUpload.bind(this);
        this.onImport = this.onImport.bind(this);
    }

    componentDidUpdate(prevProp) {
        if(prevProp.open != this.props.open) {
            this.setState({  pipes: [], textFile: '', name: '' });
        }
    }

    onImport() {
        const { textFile, name } = this.state;
        this.props.amendMyFunctions(name, textFile);
    }

    onUpload(acceptedFiles) {
        acceptedFiles.forEach((file) => {
            const reader = new FileReader()
            reader.onload = (event) => {    
              const textFile = reader.result;
              const pipes = getCustomFunctionsByText(textFile).map(pipe => pipe.snapshot());
              this.setState({ textFile,  pipes, name: file.name});
            }
            reader.readAsText(file);
        });
    }

    render() {
        const { pipes } = this.state;
        const {open} = this.props;
        return (
            <Modal className="Import" 
                show={open}
                onHide={() => this.props.closeImportModal()}>
                <Modal.Header closeButton>
                    <h5><Icon icon={icon.IMPORT}/> Importar</h5>
                </Modal.Header>
                <div className="body">
                    {pipes.length == 0 ? 
                        <UploadFile onUpload={this.onUpload}/>
                    : 
                        <PipeDisplay pipes={pipes}/>    
                    }
                </div>
                <Modal.Footer>
                    <Button variant="primary"
                        className="mf-primary-button"
                        onClick={this.onImport}
                        disabled={!pipes.length}>
                            <Icon icon={icon.IMPORT}/> Importar
                    </Button>
                </Modal.Footer>
            </Modal>
        )
    }
}

const mapStateToProps = state => ({
    open: state.environment.modalImport
});

const mapDispatchFunction = {
    closeImportModal,
    amendMyFunctions
}

export default connect(mapStateToProps, mapDispatchFunction)(Import);
