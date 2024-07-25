export const events = [
    {
        id: '1',
        start: new Date('2022-10-21 13:00:00'),
        end: new Date('2022-10-21 15:00:00'),
        title: 'Titulo de test id 1',
        note: 'Nota de test id 1',
    },
    {
        id: '2',
        start: new Date('2022-11-09 16:00:00'),
        end: new Date('2022-11-09 18:00:00'),
        title: 'Titulo del test id 2',
        note: 'Nota del test id 2',
    }
];

export const initialState = {
    isLoadingEvents: true,
    events: [],
    activeEvent: null
};

export const calendarWithEventsState = {
    isLoadingEvents: true,
    events: [...events],
    activeEvent: null
};

export const calendarWithActiveEventState = {
    isLoadingEvents: true,
    events: [...events],
    activeEvent: { ...events[0] }
};