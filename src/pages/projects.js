import React from "react"
import { Link } from "gatsby"

import Layout from "../components/layout"
import SEO from "../components/seo"
import Button from "../components/button"
import {StyledLink} from "../components/link"

import "../css/layout.css"

class ProjectsPage extends React.Component {
  render() {
    const siteTitle = "Gatsby Starter Personal Website"

    return (
      <Layout location={this.props.location} title={siteTitle}>
        <SEO
          title="Projects"
          keywords={[`blog`, `gatsby`, `javascript`, `react`]}
        />
        <h1>Projects Under Construction</h1>
        <Button>
            <StyledLink path="/">Home</StyledLink>
        </Button>
      </Layout>
    )
  }
}

export default ProjectsPage
