import React from "react";
import { OverlayTrigger, Tooltip, TooltipProps } from "react-bootstrap";

export class ShortlistItTooltip extends React.Component<{id: string, text: string, children: React.ReactElement}> {
    tooltip = (props: JSX.IntrinsicAttributes & TooltipProps & React.RefAttributes<HTMLDivElement>) => (
        <Tooltip id={this.props.id} {...props}>
          {this.props.text}
        </Tooltip>
    );
    
    render() {
        return (
            <OverlayTrigger
                placement="auto"
                delay={{ show: 250, hide: 400 }}
                overlay={this.tooltip}>
                <span>{this.props.children}</span>
            </OverlayTrigger>
        )
    }
}