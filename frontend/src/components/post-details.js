import React, { Component } from 'react';
import { connect } from "react-redux";
import {
  fetchPostDetails,
  fetchPostComments,
  postComment,
} from "../actions";
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
import uuid from 'uuid';

class PostDetails extends Component {
    state = {
        selected_post_id: this.props.match.params.id,
        new_comment_form: {
            name: {
                value: '',
                validation_state: null,
            },
            comment: {
                value: '',
                validation_state: null,
            },
        }
    }
    componentDidMount() {
        const { selected_post_id } = this.state;
        this.props.fetchPostDetails(selected_post_id);
        this.props.fetchPostComments(selected_post_id);
    }
    handleFormChange = (e) => {
        const value = e.target.value;
        const field = e.target.id;
        const validation_state = null;
        this.setState({
            new_comment_form: {
                ...this.state.new_comment_form,
                [field]: {
                    validation_state,
                    value,
                }
            }
        })
    }
    clearForm = () => {
        this.setState({
            new_comment_form: {
                name: {
                    value: '',
                    validation_state: null,
                },
                comment: {
                    value: '',
                    validation_state: null,
                },
            }
        });
    }
    handleNewComment = (e) => {
        const {name, comment} = this.state.new_comment_form;
        if (name.value === '' || comment.value === '') {
            if (name.value === '' && comment.value === '') {
                this.setState({
                    new_comment_form: {
                        name: {
                            ...this.state.new_comment_form.name,
                            validation_state: 'error'
                        },
                        comment: {
                            ...this.state.new_comment_form.comment,
                            validation_state: 'error'
                        },
                    }
                });
            } else if (name.value === '') {
                this.setState({
                    new_comment_form: {
                        ...this.state.new_comment_form,
                        name: {
                            ...this.state.new_comment_form.name,
                            validation_state: 'error'
                        },
                    }
                });
            } else if (comment.value === '') {
                this.setState({
                    new_comment_form: {
                        ...this.state.new_comment_form,
                        comment: {
                            ...this.state.new_comment_form.comment,
                            validation_state: 'error'
                        },
                    }
                });
            }
        } else {
            const new_comment = {
                id: uuid.v4(),
                timestamp: parseInt(moment().format('x'), 10),
                body: comment.value,
                author: name.value,
                parentId: this.state.selected_post_id,
            }
            this.props.postComment(new_comment);
            this.clearForm();
        }
        e.preventDefault();
    } 
    render() {
        const {details, comments} = this.props;
        const { new_comment_form } = this.state;
        const { name, comment } = new_comment_form;
        const commentsPanels = comments
            .sort((a, b) => b.voteScore - a.voteScore)
            .map(comment => (
                <Panel
                    key={comment.id} 
                    header={`${comment.author} commented on ${moment(comment.timestamp).format("MMM DD, YYYY hh:mma")}`}
                    footer={
                        <div>
                            {`Vote Score: ${comment.voteScore}`}
                            <div className="pull-right">
                                <Button bsSize="xsmall">Edit</Button>
                                {' '}
                                <Button bsSize="xsmall" bsStyle="danger">Delete</Button>
                            </div>
                            <div className="clearfix"></div>
                        </div>
                    }>
                    {comment.body}
                </Panel>
            ));
        return <Grid>
            <Row>
              <Col xs={8}>
                <h2>
                  {details.title} <small className="text-capitalize">
                    {details.category}
                  </small>
                </h2>
              </Col>
              <Col xs={4}>
                <div className="post-controls">
                  <Button>
                    Edit
                  </Button> <Button bsStyle="danger">Delete</Button>
                </div>
              </Col>
            </Row>
            <Row>
              <Col xs={12}>
                <h4>{`by ${details.author} - ${moment(details.timestamp).format("MMM DD, YYYY hh:mma")}`}</h4>
                <p>{details.body}</p>
                <hr />
                {comments.length > 0 ? commentsPanels : <h4>
                    No comments on this post
                  </h4>}
              </Col>
            </Row>
            <Row>
              <Col xs={4}>
                <form onSubmit={this.handleNewComment}>
                  <h5>New Comment</h5>
                  <FormGroup controlId="name" validationState={name.validation_state}>
                    <FormControl onChange={this.handleFormChange} value={name.value} type="text" placeholder="Name" />
                    {name.validation_state ? <HelpBlock>A name must be provided</HelpBlock> : null}
                  </FormGroup>
                  <FormGroup controlId="comment" validationState={comment.validation_state}>
                    <FormControl onChange={this.handleFormChange} value={comment.value} componentClass="textarea" placeholder="Comment" />
                    {comment.validation_state ? <HelpBlock>Comments may not be blank</HelpBlock> : null}
                  </FormGroup>
                  <Button type="submit">Post Comment</Button>
                </form>
              </Col>
            </Row>
          </Grid>;
    }
}

const mapStateToProps = ({ post_details }) => {
  return {
    details: post_details.details,
    comments: post_details.comments
  };
};

const mapDispatchToProps = dispatch => {
  return {
    fetchPostDetails: id => dispatch(fetchPostDetails(id)),
    fetchPostComments: id => dispatch(fetchPostComments(id)),
    postComment: comment => dispatch(postComment(comment)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(PostDetails);