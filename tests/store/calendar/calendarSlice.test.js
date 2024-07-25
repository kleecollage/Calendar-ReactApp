import { expect } from "@jest/globals"
import { calendarSlice, onAddNewEvent, onDeleteEvent, onLoadEvents, onLogoutCalendar, onSetActiveState, onUpdateEvent } from "../../../src/store/calendar/calendarSlice"
import { initialState, calendarWithActiveEventState, calendarWithEventsState, events } from "../../fixtures/calendarStates";

describe('Pruebas en calendarSlice', () => { 
    // ************************************************** //
    test('debe retornar el estado inicial', () => {
        const state = calendarSlice.getInitialState();

        expect(state).toEqual(initialState);
    }); 
    // ************************************************** //
    test('onSetActiveEvent debe activar el evento', () => {
        const state = calendarSlice.reducer(calendarWithEventsState, onSetActiveState(events[1]));

        expect(state.activeEvent).toEqual(events[1]);
    });
    // ************************************************** //
    test('OnAddNewEvent debe agregar el evento', () => {
        const newEvent = {
            id: '3',
            start: new Date('2022-10-21 15:00:00'),
            end: new Date('2022-10-21 19:00:00'),
            title: 'Titulo de test id 3',
            note: 'Nota de test id 3',
        }
        const state = calendarSlice.reducer(calendarWithEventsState, onAddNewEvent(newEvent));
        
        expect(state.events).toEqual([...events, newEvent]);
    });
    // ************************************************** //
    test('onUpdateEvent debe actualizar el evento', () => {
        const updatedEvent = {
            id: '1',
            start: new Date('2022-10-21 15:00:00'),
            end: new Date('2022-10-21 19:00:00'),
            title: 'Titulo de test id 1 actualizado',
            note: 'Nota de test id 1 actualizado',
        };
        const state = calendarSlice.reducer(calendarWithEventsState, onUpdateEvent(updatedEvent));
        
        expect(state.events).toContain(updatedEvent);
    });
    // ************************************************** //
    test('onDeleteEvent debe borrar el evento activo', () => {
        const state = calendarSlice.reducer(calendarWithActiveEventState, onDeleteEvent());
        
        expect(state.activeEvent).toBe(null);
        expect(state.events).not.toContain(events[0]);
    });
    // ************************************************** //
    test('onLoadEvent debe establecer los eventos', () => {
        const state = calendarSlice.reducer(initialState, onLoadEvents(events));
        
        expect(state.isLoadingEvents).toBeFalsy();
        expect(state.events.length).toBeGreaterThanOrEqual(1);
        expect(state.events).toEqual(events);

        const newState = calendarSlice.reducer(state, onLoadEvents(events));
        expect( newState.events.length).toBe(events.length)
    });
    // ************************************************** //
    test('onLogoutCalendar debe limpiar el estado', () => {
        const state = calendarSlice.reducer(calendarWithEventsState, onLogoutCalendar());

        expect(state).toEqual(initialState);
    });
 })