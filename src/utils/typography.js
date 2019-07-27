import Typography from "typography"
import Wordpress2016 from "typography-theme-wordpress-2016"

import "./global.css"

Wordpress2016.overrideThemeStyles = () => {
  return {
    a: {
      color: '#d23669',
    },
    hr: {
      background: "hsla(0, 0%, 0%, 0.2)",
    },
    "a.gatsby-resp-image-link": {
      boxShadow: `none`,
    },
    // These two are for gatsby-remark-autolink-headers:
    "a.anchor": {
      boxShadow: "none",
    },
    'a.anchor svg[aria-hidden="true"]': {
      stroke: "#d23669",
    },
    "p code": {
      fontSize: "1rem",
    },
    // TODO: why tho
    "h1 code, h2 code, h3 code, h4 code, h5 code, h6 code": {
      fontSize: "inherit",
    },
    "li code": {
      fontSize: "1rem",
    },
    blockquote: {
      color: "inherit",
      borderLeftColor: "inherit",
      opacity: "0.8",
      fontSize: "1rem"
    },
    "blockquote.translation": {
      fontSize: "1em",
    },
    "body h1": {
        fontFamily: "'Alegreya Sans', Nunito, Enriqueta, sans-serif; !important"
    },
    "body p, dd, dt, li": {
        fontSize: '1.1rem',
        fontFamily: "'Alegreya Sans', Enriqueta, Nunito, Montserrat, Helvetica, 'Times New Roman', sans-serif; !important",
    },
    "body h3, small, footer, blockquote": {
        fontFamily: "'Alegreya Sans', Enriqueta, Nunito, Montserrat, Helvetica, serif"
    },
    "code[class*='language-'], pre[class*='language-']": {
        fontSize: "0.9em !important",
        fontFamily: "Inconsolata, 'Courier New', Menlo, 'SF Mono', Menlo, Consolas, Monaco, source-code-pro, monospace !important",
    },
    ":not(pre) > code[class*='language-']": {
        background: "none !important",
        fontStyle: "italic !important",
        fontSize: "0.7em !important"
    },
    ".about-content, .about-content p, .about-content h4": {
        fontFamily: "'Alegreya Sans', Nunito, Montserrat, Helvetica, 'Times New Roman', sans-serif; !important",
    },
    ".about-content p": {
        display: 'block',
        marginTop: '1em',
        marginBottom: '1em',
        marginLeft: '0',
        marginRight: '0'
    },
  }
}

delete Wordpress2016.googleFonts

const typography = new Typography(Wordpress2016)

// Hot reload typography in development.
if (process.env.NODE_ENV !== `production`) {
  typography.injectStyles()
}

export default typography
export const rhythm = typography.rhythm
export const scale = typography.scale
