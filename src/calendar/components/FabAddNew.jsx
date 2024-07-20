import { addHours } from "date-fns";
import { useCalendarStore, useUiStore } from "../../hooks"

export const FabAddNew = () => {

    const { openDateModal } = useUiStore();
    const { setActiveEvent } = useCalendarStore()

    const handleClickNew = () => {
        setActiveEvent({
            title: '',
            note: '',
            start: new Date(),
            end: addHours(new Date(), 2),
            bgColor: '#05fafa',
            user: {
                _id: '123',
                name: 'Antonio'
            }
        })        
        openDateModal()
    }

  return (
      <button
          className="btn btn-primary fab "
          onClick={handleClickNew}
      >
          <i className="fas fa-plus"/>
          
          
      </button>
      
  )
}
