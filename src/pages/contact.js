import React from "react"
import { Link } from "gatsby"

import Layout from "../components/layout"
import SEO from "../components/seo"
import Button from "../components/button"
import StyledLink from "../components/link"

import "../css/layout.css"

class ContactPage extends React.Component {
  render() {
    const siteTitle = "Gatsby Starter Personal Website"

    return (
      <Layout location={this.props.location} title={siteTitle}>
        <SEO
          title="Projects"
          keywords={[`blog`, `gatsby`, `javascript`, `react`]}
        />
        <div className="flex-center" style={{maxHeight: "100vh", height: "100vh", width: "100%"}}>
          <div className="flex-center" style={{flexDirection: "column", position: "relative"}}>
            <div className="flex-center" style={{justifyContent: "space-around", alignItems: "center", padding: "5px", width: "100%"}}>
              <StyledA className="float-hover" path="https://twitter.com/brandon_benbow" extraStyle={{display: "flex", alignItems: "flex-end"}}>
                <img style={{margin: "0px", padding: "5px", marginLeft: "5px", marginRight: "5px", width: "50px", height: "60px"}} src="./assets/twitter-logo.svg"></img>
                <h4>@brandon_benbow</h4>
              </StyledA>
              <StyledA className="float-hover" path="https://github.com/brandonwbenbow" extraStyle={{display: "flex", alignItems: "flex-end"}}>
                <img style={{margin: "0px", padding: "5px", marginLeft: "5px", marginRight: "5px", width: "50px", height: "60px"}} src="./assets/github-logo.svg"></img>
                <h4>brandonwbenbow</h4>
              </StyledA>
            </div>
            <div style={{width: "100%", display: "flex", justifyContent: "space-around"}}>
              <StyledLink className="sink-hover" path="/projects/" extraStyle={{padding: "5px", marginLeft: "10px", marginRight: "10px"}}>
                <h4 className="fit-index">projects</h4>
              </StyledLink>
              <StyledLink className="sink-hover" path="/contact/" extraStyle={{padding: "5px", marginLeft: "10px", marginRight: "10px"}}>
                <h4 className="fit-index">contact</h4>
              </StyledLink>
            </div>
          </div>
        </div>
      </Layout>
    )
  }
}

export default ContactPage
