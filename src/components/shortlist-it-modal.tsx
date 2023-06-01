import React, { useState } from "react";
import { Alert } from "react-bootstrap";

type ShortlistItModalProps = JSX.ElementChildrenAttribute & {
    id: string;
    variant?: string;
    dismissible?: boolean;
    show?: boolean;
    heading: string;
    onClose: () => void;
};

type ShortlistItModalState = {
    show: boolean;
}

function preventScrolling(): void {
    const html = document.querySelector("html");
    if (html) {
        html.style.overflow = "hidden";
    }
}

function restoreScrolling(): void {
    const html = document.querySelector("html");
    if (html) {
        html.style.overflow = "auto";
    }
}

export function ShortlistItModal(props: ShortlistItModalProps) {
    const [state, setState] = useState<ShortlistItModalState>({
        show: props.show ?? true
    });
    
    if (props.show) {
        preventScrolling();
        return (
            <div className="overlay w-100 d-flex justify-content-center align-content-start">
                <Alert className="m-3" id={props.id} variant={props.variant} dismissible={props.dismissible} onClose={() => props.onClose()}>
                    <Alert.Heading>{props.heading}</Alert.Heading>
                    {props.children}
                </Alert>
            </div>
        );
    } else {
        restoreScrolling();
        return <></>;
    }
}