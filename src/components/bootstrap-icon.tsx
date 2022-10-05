import React from "react";

type bootstrapIconsProps = {
    icon: string,
    style?: {},
    onClick?: () => void
};

/**
 * TODO: await fix for: https://github.com/ismamz/react-bootstrap-icons/issues/39
 */
export class BootstrapIcon extends React.Component<bootstrapIconsProps> {
    render() {
        return <i className={'bi-' + this.props.icon} style={this.props.style || {}}></i>
    }
}