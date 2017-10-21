import React, { Component } from "react";
import { connect } from "react-redux";
import {
    Grid,
    Row,
    Col,
    Button,
    Panel,
    FormControl,
    FormGroup,
    HelpBlock,
} from "react-bootstrap";

class NewPost extends Component {
    state = {
        new_post_form: {
            title: {
                value: "",
                validation_state: null,
            },
            body: {
                value: "",
                validation_state: null,
            },
            author: {
                value: "",
                validation_state: null,
            },
            category: {
                value: "",
                validation_state: null,
            },
        },
    };
    render() {
        return "Hello World";
    }
}

export default NewPost;
