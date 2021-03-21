import React from "react"
import { graphql } from "gatsby"

import Layout from "../components/layout"
import SEO from "../components/seo"
import Button from "../components/button"
import SearchPosts from "../components/searchPosts"
import {StyledLink} from "../components/link"

import "../css/layout.css"

class Blog extends React.Component {
  render() {
    const { data, navigate, location } = this.props
    const siteTitle = data.site.siteMetadata.title
    const posts = data.allMdx.edges
    const localSearchBlog = data.localSearchBlog

    console.log(posts);

    return (
      <Layout location={this.props.location} title={siteTitle}>
        <SEO title="All posts" />
        <div style={{width: "100%", height: "100vh", backgroundColor: "#333333", display: "flex", flexDirection: "column", alignItems: "center"}}>
          <div style={{display: "flex", justifyContent: "center", alignItems: "center", height: "10vh", width: "70%", flexWrap: "wrap", marginTop: "15px"}}>
            <h1 style={{color: "#eaeaea", margin: "0px", flex: 1}}>Devlog</h1>
            <div style={{alignItems: "center", flex: 1, display: "flex", justifyContent: "space-between"}}>
              <StyledLink className="fit-blog" path="/" extraStyle={{padding: "5px", marginLeft: "10px", marginRight: "10px"}}>
                home
              </StyledLink>
              <StyledLink className="fit-blog" path="/projects/" extraStyle={{padding: "5px", marginLeft: "10px", marginRight: "10px"}}>
                projects
              </StyledLink>
              <StyledLink className="fit-blog" path="/contact/" extraStyle={{padding: "5px", marginLeft: "10px", marginRight: "10px"}}>
                contact
              </StyledLink>
            </div>
          </div>
          <div style={{width: "70%"}}>
          <SearchPosts
            posts={posts}
            localSearchBlog={localSearchBlog}
            navigate={navigate}
            location={location}
          />
          </div>
        </div>
      </Layout>
    )
  }
}

export default Blog

export const pageQuery = graphql`
  query {
    site {
      siteMetadata {
        title
      }
    }
    localSearchBlog {
      index
      store
    }
    allMdx(sort: { fields: [frontmatter___date], order: DESC }) {
      edges {
        node {
          excerpt
          fields {
            slug
          }
          frontmatter {
            date(formatString: "MMMM DD, YYYY")
            title
            description
          }
        }
      }
    }
  }
`
