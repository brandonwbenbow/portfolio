import React from "react"
import { Link } from "gatsby"

import Layout from "../components/layout"
import SEO from "../components/seo"
import Button from "../components/button"
import {StyledLink, StyledA} from "../components/link"

import "../css/layout.css"

class IndexPage extends React.Component {
  render() {
    const siteTitle = "Gatsby Starter Personal Website"

    return (
      <Layout location={this.props.location} title={siteTitle}>
        <SEO
          title="Home"
          keywords={[`blog`, `devlog`, `gatsby`, `javascript`, `react`]}
        />
        <script data-ad-client="ca-pub-8631961845697038" async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"></script>
        <div className="flex-center" style={{maxHeight: "100vh", height: "100vh", width: "100%"}}>
          <img style={{position: "absolute", objectFit: "cover", filter: "brightness(0.6)", height: "100vh", width: "100%"}} src="./assets/beach.jpeg"></img>
          <div className="flex-center" style={{flexDirection: "column", position: "relative"}}>
            <div className="flex-center" style={{justifyContent: "flex-start", padding: "5px", width: "100%"}}>
              <StyledA className="float-hover" path="https://twitter.com/brandon_benbow" extraStyle={{display: "flex", alignItems: "flex-end"}}>
                <img style={{margin: "0px", padding: "5px", marginLeft: "5px", marginRight: "5px", width: "50px", height: "60px"}} src="./assets/twitter-logo.svg"></img>
              </StyledA>
              <StyledA className="float-hover" path="https://github.com/brandonwbenbow" extraStyle={{display: "flex", alignItems: "flex-end"}}>
                <img style={{margin: "0px", padding: "5px", marginLeft: "5px", marginRight: "5px", width: "50px", height: "60px"}} src="./assets/github-logo.svg"></img>
              </StyledA>
            </div>
            <div style={{borderTop: "solid 12px #eaeaea", borderBottom: "solid 12px #eaeaea", marginTop: "-5px"}}>
              <h1 className="fit-index-title" style={{margin: "0px", padding: "15px"}}>Brandon Benbow</h1>
            </div>
            <div style={{width: "100%", display: "flex", justifyContent: "space-around"}}>
              <StyledLink className="sink-hover" path="/projects/" extraStyle={{padding: "5px", marginLeft: "10px", marginRight: "10px"}}>
                <h4 className="fit-index">projects</h4>
              </StyledLink>
              <StyledLink className="sink-hover" path="/contact/" extraStyle={{padding: "5px", marginLeft: "10px", marginRight: "10px"}}>
                <h4 className="fit-index">contact</h4>
              </StyledLink>
              <StyledLink className="sink-hover" path="/devlog/" extraStyle={{padding: "5px", marginLeft: "10px", marginRight: "10px"}}>
                <h4 className="fit-index">devlog</h4>
              </StyledLink>
            </div>
          </div>
        </div>
      </Layout>
    )
  }
}

export default IndexPage
