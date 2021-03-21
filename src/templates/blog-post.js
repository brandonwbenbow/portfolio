import React from "react"
import { Link, graphql } from "gatsby"
import { MDXRenderer } from "gatsby-plugin-mdx"

import Layout from "../components/layout"
import SEO from "../components/seo"
import { rhythm, scale } from "../utils/typography"
import {StyledLink} from "../components/link"

class BlogPostTemplate extends React.Component {
  render() {
    const post = this.props.data.mdx
    const siteTitle = this.props.data.site.siteMetadata.title
    const { previous, next } = this.props.pageContext

    return (
      <Layout location={this.props.location} title={siteTitle}>
        <SEO
          title={post.frontmatter.title}
          description={post.frontmatter.description || post.excerpt}
        />
        <div style={{width: "100%", height: "100vh", backgroundColor: "#333333", display: "flex", flexDirection: "column", alignItems: "center"}}>
          <div style={{display: "flex", justifyContent: "center", alignItems: "center", height: "10vh", width: "70%", flexWrap: "wrap", marginTop: "15px"}}>
            <StyledLink className="fit-blog" path="/devlog" extraStyle={{padding: "5px", margin: "0px", flex: 1}}>
              <h1 style={{color: "#eaeaea", margin: "0px"}}>Devlog</h1>
            </StyledLink>
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
          <div style={{height: "10vh", width: "70%", flexWrap: "wrap", marginTop: "15px"}}>
            <h1>{post.frontmatter.title}</h1>
            <p
              style={{
                ...scale(-1 / 5),
                display: `block`,
                marginBottom: rhythm(1),
                marginTop: rhythm(-1),
              }}
            >
              {post.frontmatter.date}
            </p>
            <MDXRenderer>{post.body}</MDXRenderer>
            <hr
              style={{
                marginBottom: rhythm(1),
              }}
            />

            <ul
              style={{
                display: `flex`,
                flexWrap: `wrap`,
                justifyContent: `space-between`,
                listStyle: `none`,
                padding: 0,
              }}
            >
              <li>
                {previous && (
                  <Link to={`/devlog${previous.fields.slug}`} rel="prev">
                    ← {previous.frontmatter.title}
                  </Link>
                )}
              </li>
              <li>
                {next && (
                  <Link to={`/devlog${next.fields.slug}`} rel="next">
                    {next.frontmatter.title} →
                  </Link>
                )}
              </li>
            </ul>
          </div>
        </div>
      </Layout>
    )
  }
}

export default BlogPostTemplate

export const pageQuery = graphql`
  query BlogPostBySlug($slug: String!) {
    site {
      siteMetadata {
        title
        author
      }
    }
    mdx(fields: { slug: { eq: $slug } }) {
      id
      excerpt(pruneLength: 160)
      body
      frontmatter {
        title
        date(formatString: "MMMM DD, YYYY")
        description
      }
    }
  }
`
