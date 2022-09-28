import React from "react";
export interface ModelProviderProps<State = void> {
    initialState?: State;
    children: React.ReactNode;
}
export interface Model<Value, State = void> {
    Provider: React.ComponentType<ModelProviderProps<State>>;
    useContext: () => Value;
}
export default function createModel<Value, State = void>(useHook: (initialState?: State) => Value): Model<Value, State>;
