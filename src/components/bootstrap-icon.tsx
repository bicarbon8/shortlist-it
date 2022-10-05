import React from "react";

type bootstrapIconsProps = {
    icon: string,
    style?: {},
    onClick?: () => void
};

export class BootstrapIcon extends React.Component<bootstrapIconsProps> {
    render() {
        return <i className={'bi-' + this.props.icon} style={this.props.style || {}}></i>
    }
}