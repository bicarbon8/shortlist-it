import React from "react";
import { OverlayTrigger, Tooltip } from "react-bootstrap";

export class ShortlistTooltip extends React.Component<{id: string, text: string, children: React.ReactElement}> {
    renderTooltip = (props) => (
        <Tooltip id={this.props.id} {...props}>
          {this.props.text}
        </Tooltip>
    );
    
    render() {
        return (
            <OverlayTrigger
                placement="auto"
                delay={{ show: 250, hide: 400 }}
                overlay={this.renderTooltip}>
                <span>{this.props.children}</span>
            </OverlayTrigger>
        )
    }
}