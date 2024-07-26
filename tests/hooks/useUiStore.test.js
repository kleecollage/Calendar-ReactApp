import { act, renderHook } from "@testing-library/react";
import { useUiStore } from "../../src/hooks/useUiStore";
import { Provider } from "react-redux";
import { uiSlice } from "../../src/store";
import { configureStore } from "@reduxjs/toolkit";
import { expect } from "@jest/globals";

const getMockStore = ( initialState ) => {
    return configureStore({
        reducer: {
            ui: uiSlice.reducer
        },
        preloadedState: {
            ui: { ...initialState }
        }
    })
}

describe('Pruebas en customHook useUiStore', () => { 
    // ************************************************************ //
    test('debe regresar los valores por defecto', () => {
        const mockStore = getMockStore({ isDateModalOpen: false })
        const { result } = renderHook(() => useUiStore(), {
            wrapper: ({ children }) => <Provider store={mockStore}>{ children }</Provider>
        });
        
        expect(result.current).toEqual({
            isDateModalOpen: false,
            openDateModal: expect.any(Function),
            closeDateModal: expect.any(Function),
            toggleDateModal: expect.any(Function),
        });
    });
    // ************************************************************ //
    test('openDateModal debe poner true en isDateModalOpen', () => {
        const mockStore = getMockStore({ isDateModalOpen: false });
        const { result } = renderHook(() => useUiStore(), {
            wrapper: ({ children }) => <Provider store={mockStore}>{children}</Provider>
        });

        const { isDateModalOpen, openDateModal } = result.current;
        act(() => {
            openDateModal()
        });
        // console.log({ result: result.current, isDateModalOpen }) // valores primitivos no se mantienen por referencia, por eso uno es true y otro es false
        expect(result.current.isDateModalOpen).toBeTruthy();
    });
    // ************************************************************ //
    test('closeDateModal deber poner a isDateModalOpen en false', () => {
        const mockStore = getMockStore({ isDateModalOpen: true });
        const { result } = renderHook(() => useUiStore(), {
            wrapper: ({ children }) => (
                <Provider store={mockStore}>
                    {children}
                </Provider>
            )
        });
        act(() => {
            result.current.closeDateModal() // como alternativa  a la desestructuracion
        });
        expect(result.current.isDateModalOpen).toBeFalsy();
    });
    // ************************************************************ //
    test('toggleDateModal deber cambiar el estado respectivamente', () => {
        const mockStore = getMockStore({ isDateModalOpen: true });
        const { result } = renderHook(() => useUiStore(), {
            wrapper: ({ children }) => (
                <Provider store={mockStore}>
                    {children}
                </Provider>
            )
        });
        act(() => {
            result.current.toggleDateModal()
        });
        expect(result.current.isDateModalOpen).toBeFalsy();
        // cambio de estado ...
        act(() => {
            result.current.toggleDateModal()
        });
        expect(result.current.isDateModalOpen).toBeTruthy();
    });
 })