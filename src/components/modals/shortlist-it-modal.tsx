import React, { createRef, useEffect } from "react";
import { Alert } from "react-bootstrap";

type ShortlistItModalProps = JSX.ElementChildrenAttribute & {
    id?: string;
    variant?: string;
    dismissible?: boolean;
    show?: boolean;
    heading: string | (() => {});
    onClose: () => void;
};

function preventScrolling(): void {
    const html = document.querySelector<HTMLElement>("html");
    if (html) {
        html.style.overflow = "hidden";
    }
}

function restoreScrolling(): void {
    const html = document.querySelector<HTMLElement>("html");
    if (html) {
        html.style.overflow = "auto";
    }
}

export function ShortlistItModal(props: ShortlistItModalProps) {
    const overlayRef = createRef<HTMLDivElement>();

    useEffect(() => {
        if (overlayRef.current) {
            preventScrolling();
            window.setTimeout(() => window.scrollTo({top: 0, behavior: 'instant' as ScrollBehavior}), 100);
        } else {
            restoreScrolling();
        }
    }, [props.show]);
    
    if (props.show) {
        return (
            <div className="overlay w-100 d-flex justify-content-center align-content-start">
                <Alert
                    ref={overlayRef}
                    className="m-3"
                    id={props.id}
                    variant={props.variant}
                    dismissible={props.dismissible}
                    onClose={() => props.onClose()}>
                    <Alert.Heading>{(typeof props.heading === 'string') ? props.heading : props.heading()}</Alert.Heading>
                    <div className="alert-body">{props.children}</div>
                </Alert>
            </div>
        );
    } else {
        return <></>;
    }
}