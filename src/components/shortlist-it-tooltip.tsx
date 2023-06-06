import React from "react";
import { OverlayTrigger, Tooltip, TooltipProps } from "react-bootstrap";

type ShortlistItTooltipProps =  React.HTMLAttributes<HTMLSpanElement> & {
    id: string, 
    text: string, 
    children: React.ReactElement
};

export function ShortlistItTooltip(props: ShortlistItTooltipProps) {
    const tooltip = (tooltipProps: JSX.IntrinsicAttributes & TooltipProps & React.RefAttributes<HTMLDivElement>) => (
        <Tooltip id={props.id} {...tooltipProps}>
          {props.text}
        </Tooltip>
    );
    
    return (
        <OverlayTrigger
            placement="auto"
            delay={{ show: 250, hide: 400 }}
            overlay={tooltip}>
            <span {...props}>{props.children}</span>
        </OverlayTrigger>
    );
}