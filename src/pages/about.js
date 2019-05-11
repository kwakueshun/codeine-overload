import React from "react"
import Layout from "../components/layout"

class About extends React.Component {
    render() {
        const { data } = this.props

        return (
            <Layout location={this.props.location} metalinks={data.site.siteMetadata.menuLinks}>
                <AboutDetails />
                <TechStack />
                <RandomFacts />
            </Layout>
        )
    }
}

function AboutDetails() {
    return (
        <div className="about-content animated bounceIn">
            <p><span role="img">👋🏻</span> Hi, I’m Sam.</p>
            <p>
                <span role="img">🇬🇭 </span>Software Engineer living in Accra, Ghana.
            </p>
            <p>📱When I’m not developing iOS apps, I build web and console apps for fun. I am passionate about Open Source, soccer and music.</p>
            <p>🖥️ Currently, I am available for freelance work, but I'd also love to get a drink and get to know you, so don’t hesitate to get in touch.</p>
            <p><i className="icon-link fab fa-github fa-lg"></i> My github page can be found <a href="https://github.com/kwakueshun" target="_blank">here</a></p>
            {/* <p>📘 You can read my blog <a href="/">here</a></p> */}
        </div>
    )
}


function TechStack() {
    var _style = { color: "#d23669", textTransform: 'uppercase'}
    return (
        <div class="about-content">
        <h4 style={_style }>Tech Stack</h4>
        <ul id="stack">
               <li><p>Swift &amp; Objective-C: iOS, MacOS</p></li>
	           <li><p>Python: Flask, Automating the boring stuff</p></li>
               <li><p>JavaScript: Playing with React</p></li>
               <li>PostgreSQL</li>
               <li><p>Rust: Really just took it for a spin but I am already in love</p></li>
			</ul>
        </div>
    )
}

function RandomFacts() {
    // ##0185BD
    var _style = { color: "#d23669", textTransform: 'uppercase' }
    return (
        <div class="about-content">
        <h4 style={_style}>Random Facts</h4>
            <ul id="stack">
            <li>I am a sucker for anything Swift & Python</li>
            <li>I do dream about the crazy things I could do with Rust</li>
            <li>These days I spend most of my leisure time on multiple slack channels including&nbsp;
                  <a href="http://slack.devcongress.org/" target="_blank">DevCongress</a>,&nbsp;
                  <a href="http://ios-developers.slack.com" target="_blank">iOS Dev</a>, &amp; <a href="http://pythondev.slack.com" target="_blank">Python Dev</a>
            </li>
            </ul>
        </div>
    )
}


export default About

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