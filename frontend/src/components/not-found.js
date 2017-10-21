import React from "react";
import { Grid, Row, Col, Jumbotron } from "react-bootstrap";
import { Link } from "react-router-dom";

const NotFound = () => {
    return (
        <Grid>
            <Row>
                <Col xs={12}>
                    <Jumbotron>
                        <h1>404 Not Found</h1>
                        <p>
                            It appears the resource you are seeking is no longer
                            available.
                        </p>
                        <p>
                            <Link to="/">Go to Homepage</Link>
                        </p>
                    </Jumbotron>
                </Col>
            </Row>
        </Grid>
    );
};

export default NotFound;
