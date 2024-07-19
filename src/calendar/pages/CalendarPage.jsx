import { Calendar } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { addHours } from 'date-fns';
import { CalendarEvent, CalendarModal, Navbar } from '../';
import { localizer, getMessagesES } from '../../helpers';
import { useState } from 'react';

const events = [{
  title: 'Cumpleaños del jefe',
  note: 'Hay que comprar el pastel',
  start: new Date(),
  end: addHours(new Date(), 2),
  bgColor: '#01fafa',
  user: {
    _id: '123',
    name: 'Antonio'
  }
}]


export const CalendarPage = () => {

  const [lastView, setLastView] = useState(localStorage.getItem('lastView') || 'week')

  const eventStyleGetter = (event, start, end, isSelected) => {
    // console.log({event, start, end, isSelected})
    
    const style = {
      backgroundColor: '#347CF7',
      borderRadius: '0px',
      opacity: 0.8,
      color: 'white'
    }
    
    return { style }
  }

  const onDoubkeClick = (event) => {
    console.log({ doubleClick: event });
  }

  const onSelect = (event) => {
    console.log({ click: event });
  }
  
  const  onViewChange = (event) => {
    // console.log({ viewChange: event });
    localStorage.setItem('lastView', event);
    setLastView( event )
  }


	return (
		<>
			<Navbar />
      <Calendar
        culture='es'
        localizer={ localizer }
        events={ events }
        defaultView={lastView}
        startAccessor='start'
        endAccessor='end'
        style={{ height: 'calc(100vh - 80px)' }}
        messages={ getMessagesES() }
        eventPropGetter={ eventStyleGetter }
        components={{
          event: CalendarEvent
        }}
        onDoubleClickEvent={ onDoubkeClick }
        onSelectEvent={ onSelect }
        onView={ onViewChange }
      />
      <CalendarModal/>
		</>
	);
};
