import React from "react";

type BootstrapIconsProps = React.HTMLAttributes<HTMLSpanElement> & {
    icon: string
};

/**
 * TODO: await fix for: https://github.com/ismamz/react-bootstrap-icons/issues/39
 */
export function BootstrapIcon(props: BootstrapIconsProps) {
    const {className, ...propsWithoutClassName} = props;
    return <i className={`bi-${props.icon} ${className ?? ''}`} {...propsWithoutClassName}></i>;
}