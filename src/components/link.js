import React from "react"
import { Link } from "gatsby"

import "../css/layout.css"

class StyledLink extends React.Component {
    render() {
        const { path, extraStyle, className, children } = this.props;

        return (
            <Link className={className} style={{color: "#eaeaea", textDecoration: "none", ...extraStyle}} to={path}>{children}</Link>
        )
    }
}

class StyledA extends React.Component {
    render() {
        const { path, extraStyle, className, children } = this.props;

        return (
            <a className={className} style={{color: "#eaeaea", textDecoration: "none", ...extraStyle}} href={path}>{children}</a>
        )
    }
}

export {StyledLink, StyledA}