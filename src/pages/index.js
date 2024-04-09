import React from "react"
import { Link, graphql } from "gatsby"

import Bio from "../components/bio"
import Layout from "../components/layout"
import SEO from "../components/seo"
import { rhythm } from "../utils/typography"
import "../utils/global.css";

class BlogIndex extends React.Component {
  render() {
    const { data } = this.props
    const siteTitle = data.site.siteMetadata.title
    const posts = data.allMarkdownRemark.edges

    return (
    <div>
      <Layout location={this.props.location} title={siteTitle} metalinks={data.site.siteMetadata.menuLinks}>
        <SEO
          title="A blog by Sam Eshun"
          keywords={[`swift`, `ios`, `c`, `objective c`, `go`]}
        />
        <Bio />
        {posts.map(({ node }) => {
          const title = node.frontmatter.title || node.fields.slug
          return (
            <div key={node.fields.slug} className='animated rollIn'>
              <h3
                style={{
                  marginBottom: rhythm(1 / 4),
                }}
              >
                <Link style={{ boxShadow: `none` }} to={node.fields.slug}>
                  {title}
                </Link>
              </h3>
              <small>
              {node.frontmatter.date} • <b>{node.fields.readingTime.text}</b>
              </small>

              <p style={{ fontSize: '0.95rem' }}
                dangerouslySetInnerHTML={{
                  __html: node.frontmatter.spoiler || node.excerpt,
                }}
              />
            </div>
          )
        })}
      </Layout>
    </div>
    )
  }
}

export default BlogIndex

export const pageQuery = graphql`
  query {
    site {
      siteMetadata {
        title
        menuLinks {
            name
            link
        }
      }
    }
    allMarkdownRemark(sort: { fields: [frontmatter___date], order: DESC }) {
      edges {
        node {
          excerpt
          fields {
            slug
            readingTime {
                text
            }
          }
          frontmatter {
            date(formatString: "MMMM DD, YYYY")
            title
            description
            spoiler
          }
        }
      }
    }
  }
`
