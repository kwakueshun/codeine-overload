import React from "react"
import { Link } from "gatsby"

const HeaderNav = ({ menuLinks }) => (
  <nav>
    <ul style={{ display: "flex", flex: 1, listStyle: "none" }}>
      {menuLinks.map(link => (
        <li key={link.link}>
          <Link to={link.link}>{link.name}</Link>
        </li>
      ))}
    </ul>
  </nav>
)


export default HeaderNav
