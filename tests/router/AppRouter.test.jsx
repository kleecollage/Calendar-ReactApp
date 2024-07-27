import { render, screen } from "@testing-library/react";
import { useAuthStore } from "../../src/hooks/useAuthStore"
import { AppRouter } from "../../src/router/AppRouter";
import { expect } from "@jest/globals";
import { MemoryRouter } from "react-router-dom";

jest.mock('../../src/hooks/useAuthStore');
jest.mock('../../src/calendar', () => ({
    CalendarPage: () => <h1>CalendarPage</h1>
}))

describe('Pruebas en componente <AppRouter />', () => { 

    const mockCheckAuthToken = jest.fn();
    beforeEach( () => jest.clearAllMocks );
    beforeEach( () => jest.clearAllTimers );

    // ************************************************************ //
    test('debe mostrar la pantalla de carga y llamar checkAuthToken', () => {
        // jest.fn().mockReturnValue
        useAuthStore.mockReturnValue({
            status: 'checking',
            checkAuthToken: mockCheckAuthToken
        });
        render(<AppRouter />);
        
        expect(screen.getByText('Cargando...')).toBeTruthy();
        expect(mockCheckAuthToken).toHaveBeenCalled();
    });
    // ************************************************************ //
    test('debe mostrar el login si no esta autenticado', () => {
        useAuthStore.mockReturnValue({
            status: 'not-authenticated',
            checkAuthToken: mockCheckAuthToken
        });
        const { container } = render(
            <MemoryRouter initialEntries={['/auth/logout']}>
                <AppRouter />
            </MemoryRouter>
        );
        
        expect(screen.getByText('Ingreso')).toBeTruthy();
        expect(container).toMatchSnapshot();
    });
    // ************************************************************ //
    test('debe mostrar el calendario si se esta autenticado', () => {
        useAuthStore.mockReturnValue({
            status: 'authenticated',
            checkAuthToken: mockCheckAuthToken
        });
        const { container } = render(
            <MemoryRouter initialEntries={['/auth/login']}>
                <AppRouter />
            </MemoryRouter>
        );

        expect(screen.getByText('CalendarPage')).toBeTruthy();
    });
 })