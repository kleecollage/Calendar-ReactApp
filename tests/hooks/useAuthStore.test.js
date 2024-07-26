import { configureStore } from "@reduxjs/toolkit"
import { act, renderHook, waitFor } from "@testing-library/react"
import { Provider } from "react-redux"
import { expect } from "@jest/globals"
import { useAuthStore } from "../../src/hooks/useAuthStore"
import { authSlice } from "../../src/store"
import { authenticatedState, initialState, notAuthenticatedState } from "../fixtures/authStates";
import { testUserCredentials } from "../fixtures/testUser";

describe('Pruebas en customHook useAuthStore', () => { 
    
    const getMockStore = ( initialState) => {
        return configureStore({
            reducer: {
                auth: authSlice.reducer
            },
            preloadedState: {
                auth: { ...initialState }
            }
        })
    };

    // ************************************************** //
    test('debe de retornar los valores por defecto', () => {
        const mockStore = getMockStore({ ...initialState });
        const { result } = renderHook(() => useAuthStore(), {
            wrapper: ({ children }) => (
                <Provider Provider store={mockStore}>
                    {children}
                </Provider>
            )
        });

        expect(result.current).toEqual({
            status: 'checking',
            user: {},
            errorMessage: undefined,
            startLogin: expect.any(Function),
            startLogout: expect.any(Function),
            startRegister: expect.any(Function),
            checkAuthToken: expect.any(Function),
        });
    });
    // ************************************************** //
    test('startLogin debe regresar el login correctamente', async () => {
        localStorage.clear();
        const mockStore = getMockStore({ ...notAuthenticatedState });
        const { result } = renderHook(() => useAuthStore(), {
            wrapper: ({ children }) => (
                <Provider Provider store={mockStore}>
                    {children}
                </Provider>
            )
        });
        
        await act(async () => { // si la funcion es asincrona act debe tener un await
            await result.current.startLogin(testUserCredentials)
        });
        const { errorMessage, status, user } = result.current;
        
        expect({ errorMessage, status, user }).toEqual({
            status: 'authenticated',
            user: {
                name: "Test User",
                uid: "66a28d73cbad5757a2a9d978"
            },
            errorMessage: undefined
        });
        expect(localStorage.getItem('token')).toEqual(expect.any(String));
        expect(localStorage.getItem('token-init-date')).toEqual(expect.any(String));
    });
        // ************************************************** //
    test('startLogin debe fallar la autenticacion', async () => {
        localStorage.clear();
        const mockStore = getMockStore({ ...notAuthenticatedState });
        const { result } = renderHook(() => useAuthStore(), {
            wrapper: ({ children }) => (
                <Provider Provider store={mockStore}>
                    {children}
                </Provider>
            )
        });
            
        await act(async () => {
            await result.current.startLogin({
                email: 'non-existing-mail@google.com',
                password: 'terreneitor3000'
            })
        });
        const { errorMessage, status, user } = result.current;
        
        expect(localStorage.getItem('token')).toBe(null);
        expect({ errorMessage, status, user }).toEqual({
            status: 'not-authenticated',
            user: {},
            errorMessage: expect.any(String)
        });
        await waitFor(() => (
            expect(result.current.errorMessage).toBe(undefined))
        );  
    });
    // ************************************************** //
 })