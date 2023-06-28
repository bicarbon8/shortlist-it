import React, { ReactNode, createRef, useEffect, useState } from "react";
import { Alert } from "react-bootstrap";
import { createPortal } from "react-dom";

type ShortlistItModalProps = React.PropsWithChildren & {
    id?: string;
    variant?: string;
    dismissible?: boolean;
    show?: boolean;
    heading: string | (() => ReactNode);
    onClose: () => void;
};

export function ShortlistItModal(props: ShortlistItModalProps) {
    if (!props.show) {
        return <></>;
    }

    const [size, setSize] = useState(window.innerWidth);
    const handleResize = () => {
        setSize(window.innerWidth);
    }

    const alertRef = createRef<HTMLDivElement>();
    const alertHeaderRef = createRef<HTMLDivElement>();
    const alertBodyRef = createRef<HTMLDivElement>();
    useEffect(() => {
        if (alertRef?.current && alertHeaderRef?.current && alertBodyRef?.current) {
            const alertHeight = alertRef.current.clientHeight;
            const alertHeaderHeight = alertHeaderRef.current.clientHeight;
            const remainingHeight = alertHeight - alertHeaderHeight - 30;
            alertBodyRef.current.style.maxHeight = `${remainingHeight}px`;
        }
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [size]);
    
    return createPortal(
        <div className="overlay w-100 d-flex justify-content-center align-content-start">
            <Alert
                ref={alertRef}
                className="m-3"
                id={props.id}
                variant={props.variant}
                dismissible={props.dismissible}
                onClose={() => props.onClose()}>
                <Alert.Heading ref={alertHeaderRef}>{(typeof props.heading === 'string') ? props.heading : props.heading()}</Alert.Heading>
                <div ref={alertBodyRef} className="alert-body">{props.children}</div>
            </Alert>
        </div>
    , document.body);
}