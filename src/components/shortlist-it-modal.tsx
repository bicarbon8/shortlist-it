import React from "react";
import { Alert } from "react-bootstrap";

type ShortlistItModalProps = {
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

export class ShortlistItModal extends React.Component<ShortlistItModalProps, ShortlistItModalState> {
    constructor(props: ShortlistItModalProps) {
        super(props);
        this.state = {
            show: props.show ?? true
        }
    }
    
    render() {
        if (this.props.show) {
            this.preventScrolling();
            return (
                <div className="overlay w-100 d-flex justify-content-center align-content-start">
                    <Alert className="m-3" id={this.props.id} variant={this.props.variant} dismissible={this.props.dismissible} onClose={() => this.props.onClose()}>
                        <Alert.Heading>{this.props.heading}</Alert.Heading>
                        {this.props.children}
                    </Alert>
                </div>
            );
        } else {
            this.restoreScrolling();
            return <></>;
        }
    }

    preventScrolling(): void {
        const html = document.querySelector("html");
        if (html) {
            html.style.overflow = "hidden";
        }
    }

    restoreScrolling(): void {
        const html = document.querySelector("html");
        if (html) {
            html.style.overflow = "auto";
        }
    }
}