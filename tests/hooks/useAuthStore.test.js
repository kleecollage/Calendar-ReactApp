import { configureStore } from "@reduxjs/toolkit"
import { act, renderHook, waitFor } from "@testing-library/react"
import { Provider } from "react-redux"
import { expect } from "@jest/globals"
import { useAuthStore } from "../../src/hooks/useAuthStore"
import { authSlice } from "../../src/store"
import { authenticatedState, initialState, notAuthenticatedState } from "../fixtures/authStates";
import { testUserCredentials } from "../fixtures/testUser";
import { calendarApi } from "../../src/api"

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

describe('Pruebas en customHook useAuthStore', () => { 

    beforeEach( () => localStorage.clear() );

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
    test('startRegister debe crear un usuario', async () => {
        const spy = jest.spyOn(calendarApi, 'post').mockReturnValue({
            data: {
                ok: true,
                uid: 'papa789papa456parapa123',
                name: 'Jhon Doe',
                token: 'abc-123-XYZ'
            }
        });
        const mockStore = getMockStore({ ...notAuthenticatedState });
        const { result } = renderHook(() => useAuthStore(), {
            wrapper: ({ children }) => (
                <Provider Provider store={mockStore}>
                    {children}
                </Provider>
            )
        });
        const newUser = {
            name: 'Jhon Doe',
            email: 'new-user@google.com',
            password: '123456'
        };
        await act(async () => {
            await result.current.startRegister(newUser)
        });
        const { errorMessage, status, user } = result.current;

        expect({ errorMessage, status, user }).toEqual({
            errorMessage: undefined,
            status: 'authenticated',
            user: { name: 'Jhon Doe', uid: 'papa789papa456parapa123' }
        });

        spy.mockRestore();
    });
    // ************************************************** //
    test('startRegister debe fallar la creacion', async () => {
        const mockStore = getMockStore({ ...notAuthenticatedState });
        const { result } = renderHook(() => useAuthStore(), {
            wrapper: ({ children }) => (
                <Provider Provider store={mockStore}>
                    {children}
                </Provider>
            )
        });
        await act(async () => {
            await result.current.startRegister(testUserCredentials)
        });
        const { errorMessage, status, user } = result.current;

        expect({ errorMessage, status, user }).toEqual({
            errorMessage: expect.any(String),
            status: 'not-authenticated',
            user: {}
        });
        await waitFor(() => (
            expect(result.current.errorMessage).toBe(undefined))
        );
    });
    // ************************************************** //
    test('checkAuthToken debe fallas si no hay token', async () => {
        const mockStore = getMockStore({ ...notAuthenticatedState });
        const { result } = renderHook(() => useAuthStore(), {
            wrapper: ({ children }) => (
                <Provider Provider store={mockStore}>
                    {children}
                </Provider>
            )
        });
        await act(async () => {
            await result.current.checkAuthToken(testUserCredentials)
        });
        // console.log('token', localStorage.getItem('token'))
        const { errorMessage, status, user } = result.current;

        expect({ errorMessage, status, user }).toEqual({
            errorMessage: undefined,
            status: 'not-authenticated',
            user: {}
        });
    });
    // ************************************************** //
    test('checkAuthToken debe autenticar el usuario si hay un token', async () => {
        const { data } = await calendarApi.post('/auth', testUserCredentials);
        // console.log({data})
        localStorage.setItem('token', data.token);
        const mockStore = getMockStore({ ...initialState });
        const { result } = renderHook(() => useAuthStore(), {
            wrapper: ({ children }) => (
                <Provider Provider store={mockStore}>
                    {children}
                </Provider>
            )
        });
        await act(async () => {
            await result.current.checkAuthToken()
        });
        const { errorMessage, status, user } = result.current;
        expect({ errorMessage, status, user }).toEqual({
            errorMessage: undefined,
            status: 'authenticated',
            user: { name: 'Test User', uid: '66a28d73cbad5757a2a9d978' }
        });

    });
})