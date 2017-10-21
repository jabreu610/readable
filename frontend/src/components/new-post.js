import React, { Component } from "react";
import { connect } from "react-redux";
import {
    fetchCategories,
    postPost,
    fetchPostDetails,
    editPost,
} from "../actions";
import * as utils from "../util/utils";
import {
    Grid,
    Row,
    Col,
    Button,
    FormControl,
    FormGroup,
    HelpBlock,
} from "react-bootstrap";
import moment from "moment";
import uuid from "uuid";

class NewPost extends Component {
    state = {
        post_id: this.props.match.params["id"]
            ? this.props.match.params["id"]
            : null,
        edit_mode: false,
        new_post_form: {
            title: {
                value: "",
                validation_state: null,
                disabled: false,
            },
            body: {
                value: "",
                validation_state: null,
                disabled: false,
            },
            author: {
                value: "",
                validation_state: null,
                disabled: false,
            },
            category: {
                value: "",
                validation_state: null,
                disabled: false,
            },
        },
    };
    componentDidMount() {
        this.props.fetchCategories();
        if (this.state.post_id) {
            this.props.fetchPostDetails(this.state.post_id);
        }
    }
    componentWillReceiveProps(nextProps) {
        if (this.state.post_id === nextProps.id) {
            this.setState({
                ...this.state,
                edit_mode: true,
                new_post_form: {
                    title: {
                        ...this.state.new_post_form.title,
                        value: nextProps.title,
                    },
                    body: {
                        ...this.state.new_post_form.body,
                        value: nextProps.body,
                    },
                    author: {
                        ...this.state.new_post_form.author,
                        value: nextProps.author,
                        disabled: true,
                    },
                    category: {
                        ...this.state.new_post_form.category,
                        value: nextProps.category,
                        disabled: true,
                    },
                },
            });
        }
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
            if (this.state.edit_mode) {
                const post = {
                    id: this.state.post_id,
                    title: title.value,
                    body: body.value,
                };
                this.props.editPost(post);
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
            }
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
                            <h2>
                                {this.state.edit_mode
                                    ? "Edit Post"
                                    : "New Post"}
                            </h2>
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
                                    disabled={author.disabled}
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
                                    disabled={category.disabled}
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

const mapStateToProps = ({ categories, post_details }) => {
    return {
        categories,
        id: post_details.details.id,
        title: post_details.details.title,
        body: post_details.details.body,
        category: post_details.details.category,
        author: post_details.details.author,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        fetchCategories: () => dispatch(fetchCategories()),
        postPost: post => dispatch(postPost(post)),
        fetchPostDetails: id => dispatch(fetchPostDetails(id)),
        editPost: post => dispatch(editPost(post)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(NewPost);
