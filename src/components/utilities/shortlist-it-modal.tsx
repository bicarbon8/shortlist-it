import React, { createRef } from "react";
import { Alert } from "react-bootstrap";
import { createPortal } from "react-dom";

type ShortlistItModalProps = JSX.ElementChildrenAttribute & {
    id?: string;
    variant?: string;
    dismissible?: boolean;
    show?: boolean;
    heading: string | (() => {});
    onClose: () => void;
};

export function ShortlistItModal(props: ShortlistItModalProps) {
    if (!props.show) {
        return <></>;
    }

    const overlayRef = createRef<HTMLDivElement>();
    
    return createPortal(
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
    , document.body);
}