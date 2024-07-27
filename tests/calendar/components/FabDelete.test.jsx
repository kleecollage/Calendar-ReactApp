import { fireEvent, render, screen } from "@testing-library/react"
import { FabDelete } from "../../../src/calendar/components/FabDelete"
import { useCalendarStore } from "../../../src/hooks/useCalendarStore"

jest.mock('../../../src/hooks/useCalendarStore')

describe('Pruebas en componente <FabDelete />', () => {

    const mockStartDeletingEvent = jest.fn();
    beforeEach( () => jest.clearAllMocks() );
    beforeEach( () => jest.clearAllTimers() );

    // ************************************************************ //
    test('debe mostrar el componente correctamente', () => {
        // jest.fn().mockReturnValue
        useCalendarStore.mockReturnValue({
            hasEventSelected: false
        });

        render(<FabDelete />)
        
        const btn = screen.getByLabelText('btn-delete');

        expect(btn.classList.toString()).toContain('btn');
        expect(btn.classList.toString()).toContain('btn-danger');
        expect(btn.classList.toString()).toContain('fab-danger');
        expect(btn.style.display).toBe('none');
    });
    // ************************************************************ //
    test('debe mostrar el boton si hay un evento activo', () => {
        useCalendarStore.mockReturnValue({
            hasEventSelected: true
        });

        render(<FabDelete />)
        const btn = screen.getByLabelText('btn-delete');
        expect(btn.style.display).toBe('');
    });
    // ************************************************************ //
    test('debe llamar startDeletingEvent() al dar click en el boton', () => {
        useCalendarStore.mockReturnValue({
            hasEventSelected: true,
            startDeletingEvent: mockStartDeletingEvent
        });

        render(<FabDelete />);
        
        const btn = screen.getByLabelText('btn-delete');
        fireEvent.click(btn);

        expect(mockStartDeletingEvent).toHaveBeenCalled();
    })
 })