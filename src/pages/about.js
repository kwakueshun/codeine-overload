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
                <FavoriteBooks />
            </Layout>
        )
    }
}

function AboutDetails() {
    return (
        <div className="about-content animated lightSpeedIn">
            <p><span role="img">👋🏻</span> Hi, I’m Sam.</p>
            <p>
                <span role="img">🇬🇭 </span>Software Engineer living in Accra, Ghana.
            </p>
            <p>
                <span role="img">📱</span>I primarily develop for Apple platforms, but I do work on web and cli tooling sometimes.
            </p>
            <p>
                <span role="img">🖥️ </span>Currently, I am available for freelance work, but I'd also love to get a drink and get to know you, so don’t hesitate to get in touch.
            </p>
            <p>
                <i className="icon-link fab fa-github fa-lg"></i> My github page can be found <a href="https://github.com/kwakueshun" target="_blank" rel="noopener noreferrer">here</a>
            </p>
        </div>
    )
}


function TechStack() {
    var _style = { color: "#d23669", textTransform: 'uppercase'}
    return (
        <div class="about-content">
        <h4 style={_style }>Tech Stack</h4>
        <ul id="stack">
               <li><p>Swift &amp; Objective-C: Apple platforms</p></li>
	             <li><p>Go: Web, tooling &amp; automating the boring stuff</p></li>
               <li><p>JavaScript: Playing with React sometimes</p></li>
               <li>PostgreSQL</li>
               <li><p>Python: Mostly scraping</p></li>
			</ul>
        </div>
    )
}

function RandomFacts() {
    var _style = { color: "#d23669", textTransform: 'uppercase' }
    return (
        <div class="about-content">
        <h4 style={_style}>Random Facts</h4>
            <ul id="stack">
            <li>I'm in the gym pumping iron like 2-4 times a week. Feel free to gift me some whey protein food</li>
            <li>Love music, can't go a day without it, for real</li>
            <li>I'm currently learning photography though I must admit that my DSLR is currently gathering dust in my camera bag</li>
            <li>These days I spend most of my leisure time on multiple slack communities including&nbsp;
                  <a href="http://slack.devcongress.org/" target="_blank" rel="noopener noreferrer">DevCongress Ghana</a>,&nbsp;
                  <a href="https://gophers.slack.com" target="_blank" rel="noopener noreferrer">Gophers</a> &amp;&nbsp;
                  <a href="http://ios-developers.slack.com" target="_blank" rel="noopener noreferrer">iOS Dev</a>
            </li>
            </ul>
        </div>
    )
}

function FavoriteBooks() {
  var _style = { color: "#d23669", textTransform: 'uppercase'}
  return (
      <div class="about-content">
      <h4 style={_style }>Books in my fave list</h4>
      <ul id="stack">
             <li><p>"Designing Data-Intensive Applications" by Martin Kleppmann</p></li>
             <li><p>"Advanced Swift" by Chris Eidhof and Ole Begemann</p></li>
             <li><p>"Programming iOS 11" by Matt Neuburg</p></li>
             <li><p>"Swift in Depth" by Tjeerd Veen</p></li>
             <li><p>"Let's go" by Alex Edwards</p></li>
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