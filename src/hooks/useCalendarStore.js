import { useDispatch, useSelector } from "react-redux"
import { onAddNewEvent, onDeleteEvent, onSetActiveState, onUpdateEvent } from "../store"

export const useCalendarStore = () => {

    const dispatch = useDispatch()
    const { events, activeEvent } = useSelector(state => state.calendar)

    const setActiveEvent = (calendarEvent) => {
        dispatch(onSetActiveState(calendarEvent))
    }

    const startSavingEvent = async( calendarEvent ) => {
        // TODO: llegar al backend ...

        // OK
        if (calendarEvent._id) {
            // Actualizando
            dispatch( onUpdateEvent({...calendarEvent}))
        } else {
            // Creando
            dispatch( onAddNewEvent({ ...calendarEvent, _id: new Date().getTime() }) )
        }
    }

    const startDeletingEvent = () => {
        // TODO: Llegar al backend
        dispatch(onDeleteEvent())
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
    }
}