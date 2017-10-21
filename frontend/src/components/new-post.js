import React, { Component } from "react";
import { connect } from "react-redux";
import { fetchCategories, postPost } from "../actions";
import * as utils from "../util/utils";
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
import moment from "moment";
import uuid from "uuid";

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
    componentDidMount() {
        this.props.fetchCategories();
    }
    handleFormChange = e => {
        const value = e.target.value;
        const field = e.target.id;
        const validation_state = null;
        this.setState({
            new_post_form: {
                ...this.state.new_post_form,
                [field]: {
                    validation_state,
                    value,
                },
            },
        });
    };
    handleSubmit = e => {
        const { title, body, author, category } = this.state.new_post_form;
        if (
            title.value === "" ||
            body.value === "" ||
            author.value === "" ||
            category.value === ""
        ) {
            let stateStage = {
                new_post_form: {
                    ...this.state.new_post_form,
                },
            };
            for (const field of ["title", "body", "author", "category"]) {
                if (this.state.new_post_form[field]["value"] === "") {
                    stateStage.new_post_form[field]["validation_state"] =
                        "error";
                }
            }
            this.setState(stateStage);
        } else {
            const post = {
                id: uuid.v4(),
                timestamp: parseInt(moment().format("x"), 10),
                body: body.value,
                title: title.value,
                author: author.value,
                category: category.value,
            };
            this.props.postPost(post);
            this.props.history.push("/");
        }
        e.preventDefault();
    };
    render() {
        const { title, body, author, category } = this.state.new_post_form;
        const { categories } = this.props;
        const categoryOptions = categories.map(category => {
            const { name } = category;
            return (
                <option key={name} value={name}>
                    {utils.capitalize(name)}
                </option>
            );
        });
        return (
            <Grid>
                <Row>
                    <Col xs={6}>
                        <form onSubmit={this.handleSubmit}>
                            <h2>New Post</h2>
                            <FormGroup
                                controlId="title"
                                validationState={title.validation_state}>
                                <FormControl
                                    onChange={this.handleFormChange}
                                    value={title.value}
                                    type="text"
                                    placeholder="Title"
                                />
                                {title.validation_state ? (
                                    <HelpBlock>A title is required</HelpBlock>
                                ) : null}
                            </FormGroup>
                            <FormGroup
                                controlId="author"
                                validationState={author.validation_state}>
                                <FormControl
                                    onChange={this.handleFormChange}
                                    value={author.value}
                                    type="text"
                                    placeholder="Author"
                                />
                                {author.validation_state ? (
                                    <HelpBlock>An author is required</HelpBlock>
                                ) : null}
                            </FormGroup>
                            <FormGroup
                                controlId="category"
                                validationState={category.validation_state}>
                                <FormControl
                                    onChange={this.handleFormChange}
                                    value={category.value}
                                    componentClass="select">
                                    <option value="">Select a Category</option>
                                    {categoryOptions}
                                </FormControl>
                                {category.validation_state ? (
                                    <HelpBlock>
                                        A category is required
                                    </HelpBlock>
                                ) : null}
                            </FormGroup>
                            <FormGroup
                                controlId="body"
                                validationState={body.validation_state}>
                                <FormControl
                                    onChange={this.handleFormChange}
                                    componentClass="textarea"
                                    rows={10}
                                    value={body.value}
                                    placeholder="Post Content"
                                />
                                {body.validation_state ? (
                                    <HelpBlock>
                                        Post content is required
                                    </HelpBlock>
                                ) : null}
                            </FormGroup>
                            <Button type="submit" bsStyle="primary">
                                Submit
                            </Button>
                        </form>
                    </Col>
                </Row>
            </Grid>
        );
    }
}

const mapStateToProps = ({ categories }) => {
    return {
        categories,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        fetchCategories: () => dispatch(fetchCategories()),
        postPost: post => dispatch(postPost(post)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(NewPost);
