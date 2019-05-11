import React from "react"
import { Link } from "gatsby"

class HeaderNav extends React.Component {
  render() {
    const { menuLinks } = this.props

    return (
      <nav>
        <ul style={{ display: "flex", flex: 1, listStyle: "none" }}>
          {menuLinks.map(link => (
            <li
              style={{ margin: "10px", fontFamily: `Nunito, sans-serif` }}
              key={link.link}
            >
              <Link
                to={link.link}
                style={{ textDecoration: "none !important" }}
              >
                {link.name}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    )
  }
}

export default HeaderNav
