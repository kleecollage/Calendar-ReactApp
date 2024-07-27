import { useEffect, useMemo, useState } from 'react';
import Modal from 'react-modal';

import DatePicker, { registerLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import { addHours, differenceInSeconds } from 'date-fns';
import { es } from 'date-fns/locale/es';

import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css'

import { useUiStore, useCalendarStore } from '../../hooks';
import { getEnvVariables } from '../../helpers';


registerLocale('es', es)

const customStyles = {
    content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
    },
}

if (getEnvVariables().VITE_MODE !== 'test') {
    Modal.setAppElement('#root');
}

export const CalendarModal = () => {
    
    const { isDateModalOpen, closeDateModal } = useUiStore();
    const [formSubmitted, setFormSubmitted] = useState(false);
    const { activeEvent, startSavingEvent } = useCalendarStore()

    const [formValues, setFormValues] = useState({
        title: '',
        notes: '',
        start: new Date(),
        end: addHours(new Date(), 2)
    });

    const titleClass = useMemo(() => {
        if (!formSubmitted) return '';
        return (formValues.title.length > 0)
            ? ''
            : 'is-invalid';
    }, [formValues.title, formSubmitted])

    useEffect(() => {
        if (activeEvent !== null) {
          setFormValues({...activeEvent})
      }
    }, [activeEvent])
    

    const onInputChange = ({ target }) => {
        setFormValues({
            ...formValues,
            [target.name]: target.value
        })
    }

    const onDateChange = (event, changing) => {
        setFormValues({
            ...formValues,
            [changing]: event
        })
    }
    
    const onCloseModal = () => {
        // console.log('cerrando modal')
        closeDateModal();
    }

    const onSubmit = async(event) => {
        event.preventDefault();
        setFormSubmitted(true)
        const difference = differenceInSeconds(formValues.end, formValues.start)
        if (isNaN(difference) || difference <= 0) {
            Swal.fire('Fehas incorrectas', 'Revisa las fechas ingresadas', 'error')
            return;
        }
        if (formValues.title.length <= 0) return;
        // console.log(formValues)

        await startSavingEvent( formValues );
        closeDateModal();
        setFormSubmitted(false)
    }

  return (
      <Modal
        className="modal"
        overlayClassName="modal-fondo"
        closeTimeoutMS={ 200 }
        isOpen={ isDateModalOpen }
        onRequestClose={ onCloseModal }
        style={ customStyles }
        contentLabel="Example Modal"
      >
        <h1> Nuevo evento </h1>
        <hr />
        <form className="container" onSubmit={onSubmit}>

            <div className="form-group mb-2">
                  <label>Fecha y hora inicio</label>
                  <div className='mt-2'>                      
                    <DatePicker
                        className='form-control'
                        selected={formValues.start}
                        onChange={(event) => onDateChange(event, 'start')} //only when value has changed
                        dateFormat="Pp"
                        showTimeSelect
                        locale='es'
                        timeCaption='Hora'
                        popperPlacement="bottom-start"
                    />
                  </div>
            </div>

              <div className="form-group mb-2">
                  <label>Fecha y hora fin</label>
                  <div className='mt-2'>
                    <DatePicker
                        className='form-control'
                        minDate={ formValues.start }
                        selected={formValues.end}
                        onChange={(event) => onDateChange(event, 'end')} //only when value has changed
                        dateFormat="Pp"
                        showTimeSelect
                        locale='es'
                        timeCaption='Hora'
                        popperPlacement="bottom-start"
                    />
                  </div>
            </div>

            <hr />
            <div className="form-group mb-2">
                <label>Titulo y notas</label>
                <input 
                    type="text" 
                    className={`form-control ${titleClass}`}
                    placeholder="Título del evento"
                    name="title"
                    autoComplete="off"
                    value={formValues.title}
                    onChange={onInputChange}
                />
                <small id="emailHelp" className="form-text text-muted">Una descripción corta</small>
            </div>

            <div className="form-group mb-2">
                <textarea 
                    type="text" 
                    className="form-control"
                    placeholder="Notas"
                    rows="5"
                    name="notes"
                    value={formValues.notes}
                    onChange={onInputChange}
                ></textarea>
                <small id="emailHelp" className="form-text text-muted">Información adicional</small>
            </div>

            <button
                type="submit"
                className="btn btn-outline-primary btn-block"
            >
                <i className="far fa-save"></i>
                <span> Guardar</span>
            </button>
        </form>

      </Modal>
      
  )
}
