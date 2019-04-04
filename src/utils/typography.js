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
    "body p": {
        fontFamily: "'Open Sans', Helvetica, 'Times New Roman', sans-serif; !important",
    },
    "code[class*='language-'], pre[class*='language-']": {
        fontSize: "0.9em !important",
        fontFamily: "'SF Mono', Menlo, Consolas, Monaco, source-code-pro, Courier New, monospace !important",
    },
    ":not(pre) > code[class*='language-']": {
        background: "none !important",
        fontStyle: "italic !important"
    }
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
