import React, { Component } from "react";
import { connect } from "react-redux";
import {
    fetchPostDetails,
    fetchPostComments,
    postComment,
    deleteComment,
    deletePost,
    postVoteForComment,
    postVoteForPost,
    clearPostDetails,
    showCommentsEditModal,
    hideCommentsEditModal,
    fetchCommentDetails,
    clearCommentDetails,
    editComment,
} from "../actions";
import { LinkContainer } from "react-router-bootstrap";
import {
    Grid,
    Row,
    Col,
    Button,
    Panel,
    FormControl,
    FormGroup,
    HelpBlock,
    Modal,
} from "react-bootstrap";
import moment from "moment";
import uuid from "uuid";

class PostDetails extends Component {
    state = {
        selected_post_id: this.props.match.params.id,
        new_comment_form: {
            name: {
                value: "",
                validation_state: null,
            },
            comment: {
                value: "",
                validation_state: null,
            },
        },
        edit_comment_form: {
            comment: {
                value: "",
                validation_state: null,
            },
        },
    };
    componentDidMount() {
        const { selected_post_id } = this.state;
        this.props.fetchPostDetails(selected_post_id);
        this.props.fetchPostComments(selected_post_id);
    }
    componentWillReceiveProps(nextProps) {
        if (nextProps.comment_details.id) {
            this.setState({
                edit_comment_form: {
                    comment: {
                        ...this.state.edit_comment_form.comment,
                        value: nextProps.comment_details.body,
                    },
                },
            });
        }
    }
    componentWillUnmount() {
        this.props.clearPostDetails();
    }
    handleFormChange = e => {
        const value = e.target.value;
        const field = e.target.id;
        const validation_state = null;
        this.setState({
            new_comment_form: {
                ...this.state.new_comment_form,
                [field]: {
                    validation_state,
                    value,
                },
            },
        });
    };
    handleEditFormChange = e => {
        const value = e.target.value;
        const field = e.target.id;
        const validation_state = null;
        this.setState({
            edit_comment_form: {
                [field]: {
                    validation_state,
                    value,
                },
            },
        });
    };
    handleCommentVote = (commentId, e) => {
        const option = e.target.value;
        this.props.postVoteForComment({
            option,
            parentId: this.state.selected_post_id,
            commentId,
        });
    };
    handleCommentDelete = (commentId, e) => {
        if (window.confirm("Are you sure you want to delete this comment?")) {
            this.props.deleteComment({
                parentId: this.state.selected_post_id,
                commentId,
            });
        }
    };
    handlePostVote = e => {
        const option = e.target.value;
        this.props.postVoteForPost({
            option,
            postId: this.state.selected_post_id,
        });
    };
    handlePostDelete = e => {
        if (window.confirm("Are you sure you want to delete this post?")) {
            this.props.deletePost({ id: this.state.selected_post_id });
            this.props.history.push("/");
        }
    };
    clearForm = () => {
        this.setState({
            new_comment_form: {
                name: {
                    value: "",
                    validation_state: null,
                },
                comment: {
                    value: "",
                    validation_state: null,
                },
            },
        });
    };
    handleCommentEdit = e => {
        const { comment } = this.state.edit_comment_form;
        if (comment.value === "") {
            this.setState({
                edit_comment_form: {
                    ...this.state.edit_comment_form,
                    comment: {
                        ...this.state.edit_comment_form.comment,
                        validation_state: "error",
                    },
                },
            });
        } else {
            const updated_comment = {
                id: this.props.comment_details.id,
                timestamp: parseInt(moment().format("x"), 10),
                body: comment.value,
                parentId: this.state.selected_post_id,
            };
            this.props.editComment(updated_comment);
            this.closeEditCommentModal();
        }
    };
    handleNewComment = e => {
        const { name, comment } = this.state.new_comment_form;
        if (name.value === "" || comment.value === "") {
            if (name.value === "" && comment.value === "") {
                this.setState({
                    new_comment_form: {
                        name: {
                            ...this.state.new_comment_form.name,
                            validation_state: "error",
                        },
                        comment: {
                            ...this.state.new_comment_form.comment,
                            validation_state: "error",
                        },
                    },
                });
            } else if (name.value === "") {
                this.setState({
                    new_comment_form: {
                        ...this.state.new_comment_form,
                        name: {
                            ...this.state.new_comment_form.name,
                            validation_state: "error",
                        },
                    },
                });
            } else if (comment.value === "") {
                this.setState({
                    new_comment_form: {
                        ...this.state.new_comment_form,
                        comment: {
                            ...this.state.new_comment_form.comment,
                            validation_state: "error",
                        },
                    },
                });
            }
        } else {
            const new_comment = {
                id: uuid.v4(),
                timestamp: parseInt(moment().format("x"), 10),
                body: comment.value,
                author: name.value,
                parentId: this.state.selected_post_id,
            };
            this.props.postComment(new_comment);
            this.clearForm();
        }
        e.preventDefault();
    };
    openEditCommentModal = (id, e) => {
        this.props.fetchCommentDetails(id);
        this.props.showCommentsEditModal();
    };
    closeEditCommentModal = (id, e) => {
        this.props.clearCommentDetails();
        this.props.hideCommentsEditModal();
    };
    render() {
        const { details, comments } = this.props;
        const { new_comment_form } = this.state;
        const { name, comment } = new_comment_form;
        const commentsPanels = comments
            .sort((a, b) => b.voteScore - a.voteScore)
            .map(comment => (
                <Panel
                    key={comment.id}
                    header={`${comment.author} commented on ${moment(
                        comment.timestamp
                    ).format("MMM DD, YYYY hh:mma")}`}
                    footer={
                        <div>
                            {`Vote Score: ${comment.voteScore} `}
                            {" - "}
                            <Button
                                bsSize="xsmall"
                                value="upVote"
                                bsStyle="success"
                                onClick={this.handleCommentVote.bind(
                                    this,
                                    comment.id
                                )}>
                                Upvote
                            </Button>{" "}
                            <Button
                                bsSize="xsmall"
                                value="downVote"
                                bsStyle="warning"
                                onClick={this.handleCommentVote.bind(
                                    this,
                                    comment.id
                                )}>
                                Downvote
                            </Button>
                            <div className="pull-right">
                                <Button
                                    onClick={this.openEditCommentModal.bind(
                                        this,
                                        comment.id
                                    )}
                                    bsSize="xsmall">
                                    Edit
                                </Button>{" "}
                                <Button
                                    bsSize="xsmall"
                                    bsStyle="danger"
                                    onClick={this.handleCommentDelete.bind(
                                        this,
                                        comment.id
                                    )}>
                                    Delete
                                </Button>
                            </div>
                            <div className="clearfix" />
                        </div>
                    }>
                    {comment.body}
                </Panel>
            ));
        const editCommentsModal = (
            <Modal
                show={this.props.showModal}
                onHide={this.closeEditCommentModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Edit Comment</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <FormGroup
                        controlId="comment"
                        validationState={
                            this.state.edit_comment_form.comment
                                .validation_state
                        }>
                        <FormControl
                            onChange={this.handleEditFormChange}
                            value={this.state.edit_comment_form.comment.value}
                            componentClass="textarea"
                            placeholder="Comment"
                        />
                        {this.state.edit_comment_form.comment
                            .validation_state ? (
                            <HelpBlock>Comments may not be blank</HelpBlock>
                        ) : null}
                    </FormGroup>
                </Modal.Body>
                <Modal.Footer>
                    <Button bsStyle="primary" onClick={this.handleCommentEdit}>
                        Submit
                    </Button>
                    <Button onClick={this.closeEditCommentModal}>Close</Button>
                </Modal.Footer>
            </Modal>
        );
        return (
            <Grid>
                <Row>
                    <Col xs={8}>
                        {editCommentsModal}
                        <h2>
                            {details.title}{" "}
                            <small className="text-capitalize">
                                {details.category}
                            </small>
                        </h2>
                    </Col>
                    <Col xs={4}>
                        <div className="post-controls">
                            <LinkContainer to={`/post/form/${details.id}`}>
                                <Button>Edit</Button>
                            </LinkContainer>{" "}
                            <Button
                                bsStyle="danger"
                                onClick={this.handlePostDelete}>
                                Delete
                            </Button>
                        </div>
                    </Col>
                </Row>
                <Row>
                    <Col xs={12}>
                        <h4>{`by ${details.author} - ${moment(
                            details.timestamp
                        ).format("MMM DD, YYYY hh:mma")}`}</h4>
                        <div className="vote-controls">
                            {`Vote Score: ${details.voteScore} `}
                            {" - "}
                            <Button
                                bsSize="xsmall"
                                value="upVote"
                                bsStyle="success"
                                onClick={this.handlePostVote}>
                                Upvote
                            </Button>{" "}
                            <Button
                                bsSize="xsmall"
                                value="downVote"
                                bsStyle="warning"
                                onClick={this.handlePostVote}>
                                Downvote
                            </Button>
                        </div>
                        <p>{details.body}</p>
                        <hr />
                        {comments.length > 0 ? (
                            commentsPanels
                        ) : (
                            <h4>No comments on this post</h4>
                        )}
                    </Col>
                </Row>
                <Row>
                    <Col xs={4}>
                        <form onSubmit={this.handleNewComment}>
                            <h5>New Comment</h5>
                            <FormGroup
                                controlId="name"
                                validationState={name.validation_state}>
                                <FormControl
                                    onChange={this.handleFormChange}
                                    value={name.value}
                                    type="text"
                                    placeholder="Name"
                                />
                                {name.validation_state ? (
                                    <HelpBlock>
                                        A name must be provided
                                    </HelpBlock>
                                ) : null}
                            </FormGroup>
                            <FormGroup
                                controlId="comment"
                                validationState={comment.validation_state}>
                                <FormControl
                                    onChange={this.handleFormChange}
                                    value={comment.value}
                                    componentClass="textarea"
                                    placeholder="Comment"
                                />
                                {comment.validation_state ? (
                                    <HelpBlock>
                                        Comments may not be blank
                                    </HelpBlock>
                                ) : null}
                            </FormGroup>
                            <Button bsStyle="primary" type="submit">
                                Post Comment
                            </Button>
                        </form>
                    </Col>
                </Row>
            </Grid>
        );
    }
}

const mapStateToProps = ({
    post_details,
    comment_details,
    show_comments_edit_modal,
}) => {
    return {
        details: post_details.details,
        comments: post_details.comments,
        comment_details,
        showModal: show_comments_edit_modal,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        fetchPostDetails: id => dispatch(fetchPostDetails(id)),
        fetchPostComments: id => dispatch(fetchPostComments(id)),
        fetchCommentDetails: id => dispatch(fetchCommentDetails(id)),
        postComment: comment => dispatch(postComment(comment)),
        deleteComment: comment => dispatch(deleteComment(comment)),
        deletePost: postId => dispatch(deletePost(postId)),
        postVoteForComment: vote => dispatch(postVoteForComment(vote)),
        postVoteForPost: vote => dispatch(postVoteForPost(vote)),
        clearPostDetails: () => dispatch(clearPostDetails()),
        showCommentsEditModal: () => dispatch(showCommentsEditModal()),
        hideCommentsEditModal: () => dispatch(hideCommentsEditModal()),
        clearCommentDetails: () => dispatch(clearCommentDetails()),
        editComment: (comment) => dispatch(editComment(comment)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(PostDetails);
