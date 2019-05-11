import React from "react"
import { Link } from "gatsby"
import { Helmet } from 'react-helmet';


import { rhythm, scale } from "../utils/typography"
import Footer from "./footer"
import HeaderNav from "./headernav"
import "../utils/prism-dracula.css";
import "../utils/code-highlight.css";
import "prismjs/plugins/line-numbers/prism-line-numbers.css";
import "../utils/global.css";


class Layout extends React.Component {
  render() {
    const { location, title, metalinks, children } = this.props
    const rootPath = `${__PATH_PREFIX__}/`
    let header

    if (location.pathname === rootPath) {
      header = (
        <h1
          style={{
            ...scale(1.2),
            marginBottom: rhythm(1.5),
            marginTop: 0,
          }}
        >
          <Link
            style={{
              boxShadow: `none`,
              textDecoration: `none`,
              color: `inherit`,
            }}
            to={`/`}
          >
            {title}
          </Link>
        </h1>
      )
    } else {
      header = (
        <h3
          style={{
            fontFamily: `Nunito, sans-serif`,
            marginTop: 0,
          }}
        >
          <Link
            style={{
              boxShadow: `none`,
              textDecoration: `none`,
              color: '#d23669'
            //   color: `inherit`,
            }}
            to={`/`}
          >
            {title}
          </Link>
        </h3>
      )
    }
    return (
        <React.Fragment>
        <Helmet>
        <link rel="stylesheet" href="https://cdn.pride.codes/css/bar_body.css" />
        </Helmet>
        <div
        style={{
          marginLeft: `auto`,
          marginRight: `auto`,
          maxWidth: rhythm(24),
          padding: `${rhythm(1.5)} ${rhythm(3 / 4)}`,
        }}
      >
        <HeaderNav menuLinks={metalinks} />
        <header>{header}</header>
        <main>{children}</main>

        <Footer />

        {/* <footer>
          © {new Date().getFullYear()}, Built with
          {` `}
          <a href="https://www.gatsbyjs.org">Gatsby</a>
        </footer> */}
      </div>
        </React.Fragment>
    )
  }
}

export default Layout
