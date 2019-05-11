import React from "react"
import { Link } from "gatsby"

const HeaderNav = ({ menuLinks }) => (
  <nav>
    <ul style={{ display: "flex", flex: 1, listStyle: "none" }}>
      {menuLinks.map(link => (
        <li style={{margin: '10px', fontFamily: `Nunito, sans-serif`}}
        key={link.link}>
          <Link to={link.link} style={{ textDecoration: "none !important"}}>{link.name}</Link>
        </li>
      ))}
    </ul>
  </nav>
)


export default HeaderNav
