"use client";

import * as React from "react";

import type {
    ToastActionElement,
    ToastProps,
} from "@/components/ui/toast";

const TOAST_LIMIT = 1;
const TOAST_REMOVE_DELAY = 1000000;

type ToasterToast = ToastProps & {
    id: string;
    title?: React.ReactNode;
    description?: React.ReactNode;
    action?: ToastActionElement;
};

const toastTimeouts = new Map<string, ReturnType<typeof setTimeout>>();

type ToastState = {
    toasts: ToasterToast[];
};

const enum ActionType {
    ADD_TOAST = "ADD_TOAST",
    UPDATE_TOAST = "UPDATE_TOAST",
    DISMISS_TOAST = "DISMISS_TOAST",
    REMOVE_TOAST = "REMOVE_TOAST",
}

type Action =
    | {
          type: ActionType.ADD_TOAST;
          toast: ToasterToast;
      }
    | {
          type: ActionType.UPDATE_TOAST;
          toast: Partial<ToasterToast>;
      }
    | {
          type: ActionType.DISMISS_TOAST;
          toastId?: ToasterToast["id"];
      }
    | {
          type: ActionType.REMOVE_TOAST;
          toastId?: ToasterToast["id"];
      };

const toastReducers = (state: ToastState, action: Action): ToastState => {
    switch (action.type) {
        case ActionType.ADD_TOAST:
            return {
                ...state,
                toasts: [action.toast, ...state.toasts].slice(0, TOAST_LIMIT),
            };
        case ActionType.UPDATE_TOAST:
            return {
                ...state,
                toasts: state.toasts.map((toast) =>
                    toast.id === action.toast.id
                        ? { ...toast, ...action.toast }
                        : toast,
                ),
            };
        case ActionType.DISMISS_TOAST: {
            const { toasts } = state;
            if (action.toastId) {
                toastTimeouts.set(
                    action.toastId,
                    setTimeout(() => {
                        dispatch({
                            type: ActionType.REMOVE_TOAST,
                            toastId: action.toastId,
                        });
                    }, TOAST_REMOVE_DELAY),
                );
            } else {
                for (const toast of toasts) {
                    toastTimeouts.set(
                        toast.id,
                        setTimeout(() => {
                            dispatch({
                                type: ActionType.REMOVE_TOAST,
                                toastId: toast.id,
                            });
                        }, TOAST_REMOVE_DELAY),
                    );
                }
            }

            return {
                ...state,
                toasts: state.toasts.map((toast) =>
                    toast.id === action.toastId || action.toastId === undefined
                        ? { ...toast, open: false }
                        : toast,
                ),
            };
        }
        case ActionType.REMOVE_TOAST:
            if (action.toastId) {
                toastTimeouts.delete(action.toastId);
                return {
                    ...state,
                    toasts: state.toasts.filter(
                        (toast) => toast.id !== action.toastId,
                    ),
                };
            }
            return {
                ...state,
                toasts: [],
            };
    }
};

const listeners = new Set<(state: ToastState) => void>();
let memoryState: ToastState = { toasts: [] };

function dispatch(action: Action) {
    memoryState = toastReducers(memoryState, action);
    listeners.forEach((listener) => {
        listener(memoryState);
    });
}

export function toast(props: Omit<ToasterToast, "id">) {
    const id = Math.random().toString(36).slice(2, 10);

    const update = (updates: ToasterToast) =>
        dispatch({
            type: ActionType.UPDATE_TOAST,
            toast: { ...updates, id },
        });
    const dismiss = () =>
        dispatch({ type: ActionType.DISMISS_TOAST, toastId: id });

    dispatch({
        type: ActionType.ADD_TOAST,
        toast: {
            ...props,
            id,
            open: true,
            onOpenChange(open) {
                if (!open) {
                    dismiss();
                }
                props.onOpenChange?.(open);
            },
        },
    });

    return {
        id,
        dismiss,
        update,
    };
}

export function useToast() {
    const [state, setState] = React.useState<ToastState>(memoryState);

    React.useEffect(() => {
        listeners.add(setState);
        return () => {
            listeners.delete(setState);
        };
    }, []);

    return {
        ...state,
        toast,
        dismiss(toastId?: string) {
            dispatch({ type: ActionType.DISMISS_TOAST, toastId });
        },
    };
}

export type Toast = ReturnType<typeof toast>;
