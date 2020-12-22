import React from "react"
import { Link } from "gatsby"
import styled from "styled-components"

import { rhythm, scale } from "../utils/typography"

class Layout extends React.Component {
  render() {
    const { location, title, children } = this.props
    const rootPath = `${__PATH_PREFIX__}/`
    const blogPath = `${__PATH_PREFIX__}/blog/`
    // loctation.pathname is current path check for above
    
    return (
      <Wrapper>
        <div>
          <main style={{height: "100vh", width: "100%"}}>{children}</main>
        </div>
      </Wrapper>
    )
  }
}

const Wrapper = styled.div`
  min-height: 100vh;
`

const Container = styled.div`
  flex: 1;
  display: flex;
  justify-content: space-evenly;
  align-items: center;
`

export default Layout
