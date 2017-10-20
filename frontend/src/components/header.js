import React from 'react';
import { LinkContainer } from 'react-router-bootstrap';
import { Navbar } from 'react-bootstrap';

const Header = () => {
    return (
        <Navbar>
          <Navbar.Header>
            <Navbar.Brand>
              <LinkContainer to="/">
                <a>Readable</a>
              </LinkContainer>
            </Navbar.Brand>
          </Navbar.Header>
        </Navbar>
    )
}

export default Header;