import React from 'react';
import { rhythm } from '../utils/typography';

class Footer extends React.Component {
    render() {
      return (
        <footer
          style={{
            marginTop: rhythm(2.5),
            paddingTop: rhythm(1),
          }}
        >
          {/* <div style={{ float: 'right' }}>
            <a href="https://samueleshun.com/" target="_blank" rel="noopener noreferrer">
              samueleshun.com
            </a>
          </div> */}
          © {new Date().getFullYear()}
          {' '}&bull;{' '}
          <a
            href="https://mobile.twitter.com/samxeshun"
            target="_blank"
            rel="noopener noreferrer"
          >
            twitter
          </a>{' '}
          &bull;{' '}
          <a
            href="https://github.com/kwakueshun"
            target="_blank"
            rel="noopener noreferrer"
          >
            github
          </a>{' '}
          &bull;{' '}
          <a
            href="mailto:samuel.eshun13@gmail.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            email
          </a>{' '}
          {' '}
          &bull;{' '}
          <a
            href="https://www.linkedin.com/in/samuel-eshun-84186075/"
            target="_blank"
            rel="noopener noreferrer"
          >
            linkedin
          </a>{' '}

          {/* <a
            href="https://stackoverflow.com/users/458193/dan-abramov"
            target="_blank"
            rel="noopener noreferrer"
          >
            stack overflow
          </a> */}
        </footer>
      );
    }
  }

  export default Footer;