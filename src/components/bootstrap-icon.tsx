import React from "react";

type bootstrapIconsProps = React.HTMLAttributes<HTMLSpanElement> & {
    icon: string
};

/**
 * TODO: await fix for: https://github.com/ismamz/react-bootstrap-icons/issues/39
 */
export class BootstrapIcon extends React.Component<bootstrapIconsProps> {
    render() {
        const propsWithoutClassName = {...this.props};
        delete propsWithoutClassName.className;
        return <i className={`bi-${this.props.icon} ${this.props.className ?? ''}`} {...propsWithoutClassName}></i>
    }
}