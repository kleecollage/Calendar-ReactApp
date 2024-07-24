import { useDispatch, useSelector } from "react-redux"
import { onAddNewEvent, onDeleteEvent, onLoadEvents, onSetActiveState, onUpdateEvent } from "../store"
import { calendarApi } from "../api"
import { convertEventsToDateEvents } from "../helpers";
import Swal from "sweetalert2";

export const useCalendarStore = () => {

    const dispatch = useDispatch();
    const { events, activeEvent } = useSelector(state => state.calendar);
    const { user } = useSelector(state => state.auth);

    // ==================== METHOD ==================== //
    const setActiveEvent = (calendarEvent) => {
        dispatch(onSetActiveState(calendarEvent))
    };

    // ==================== METHOD ==================== //
    const startSavingEvent = async (calendarEvent) => {
        console.log(calendarEvent)
        try {
            if (calendarEvent.id) {
                // Actualizando
                await calendarApi.put(`/events/${calendarEvent.id}`, calendarEvent);
                dispatch(onUpdateEvent({ ...calendarEvent, user }))
                return;
            }
            // Creando
            const { data } = await calendarApi.post('/events', calendarEvent)
            // console.log({ data })
            dispatch(onAddNewEvent({ ...calendarEvent, id: data.evento.id, user }))
        } catch (error) {
            console.log(error);
            Swal.fire('Error al guardar', error.response.data?.msg || 'No tienes los permisos', 'error');
        }
    };

    // ==================== METHOD ==================== //
    const startDeletingEvent = async() => {
        try {
            await calendarApi.delete(`/events/${activeEvent.id}`)
            dispatch(onDeleteEvent())
        } catch (error) {
            console.log(error)
            Swal.fire('Error al eliminar', error.response.data?.msg || 'No tienes los permisos', 'error');
        }
    };

    // ==================== METHOD ==================== //
    const startLoadingEvent = async() => {
        try {
            const { data } = await calendarApi.get('/events')
            const events = convertEventsToDateEvents(data.eventos)
            // console.log({data}) // console.log(events)
            dispatch(onLoadEvents(events))
        } catch (error) {
            console.log('Error cargando eventos')
            console.log(error)
        }
    }


    return {
        //* properties
        events,
        activeEvent,
        hasEventSelected: !!activeEvent,

        //* methods
        setActiveEvent,
        startSavingEvent,
        startDeletingEvent,
        startLoadingEvent,
    }
}