import React, { Component } from "react";
import { connect } from "react-redux";
import {
    fetchCategories,
    fetchPosts,
    fetchPostByCategory,
    fetchPostDetails,
    fetchPostComments,
    postVoteForPost,
    deletePost,
    setPostsSort,
} from "../actions";
import { LinkContainer } from "react-router-bootstrap";
import { Link } from "react-router-dom";
import * as utils from "../util/utils";
import {
    Grid,
    Row,
    Col,
    Button,
    ListGroup,
    ListGroupItem,
    FormControl,
    Panel,
} from "react-bootstrap";

class Main extends Component {
    state = {};
    componentDidMount() {
        this.props.fetchCategories();
        if (!this.props.match.params['category']) {
            this.props.fetchPosts();
        } else {
            this.props.fetchPostByCategory(this.props.match.params['category']);
        }
    }
    componentWillReceiveProps(nextProps) {
        const { category } = nextProps.match.params;
        if (category !== this.props.match.params['category']) {
            if (category) {
                this.props.fetchPostByCategory(category);
            } else {
                this.props.fetchPosts();
            }
        }
    }
    handlePostVote = (id, e) => {
        const option = e.target.value;
        this.props.postVoteForPost({
            option,
            postId: id,
            location: "root",
            category: this.props.match.params['category'],
        });
    };
    handlePostDelete = (id, e) => {
        if (window.confirm("Are you sure you want to delete this post?")) {
            this.props.deletePost({
                id,
                location: "root",
                category: this.props.match.params['category'],
            });
        }
    };
    handleSortChange = e => {
        this.props.setPostsSort(e.target.value);
    };
    sortByVoteScore = (a, b) => {
        return b.voteScore - a.voteScore;
    };
    sortByTimestamp = (a, b) => {
        return b.timestamp - a.timestamp;
    };
    render() {
        const { categories, posts } = this.props;
        const { sort } = this.props;
        let sortFunction;
        if (sort === "voteScore") {
            sortFunction = this.sortByVoteScore;
        }
        if (sort === "date") {
            sortFunction = this.sortByTimestamp;
        }
        const postList = posts.sort((a, b) => sortFunction(a, b)).map(post => (
            <Panel
                key={post.id}
                footer={
                    <div>
                        {`Vote Score: ${post.voteScore} `}
                        {" - "}
                        <Button
                            bsSize="xsmall"
                            value="upVote"
                            bsStyle="success"
                            onClick={this.handlePostVote.bind(this, post.id)}>
                            Upvote
                        </Button>{" "}
                        <Button
                            bsSize="xsmall"
                            value="downVote"
                            bsStyle="warning"
                            onClick={this.handlePostVote.bind(this, post.id)}>
                            Downvote
                        </Button>
                        <div className="pull-right">
                            <LinkContainer to={`/post/form/${post.id}`}>
                                <Button bsSize="xsmall">Edit</Button>
                            </LinkContainer>
                            {" "}
                            <Button
                                bsSize="xsmall"
                                bsStyle="danger"
                                onClick={this.handlePostDelete.bind(
                                    this,
                                    post.id
                                )}>
                                Delete
                            </Button>
                        </div>
                        <div className="clearfix" />
                    </div>
                }>
                <Link to={`/${post.category}/${post.id}`}>
                    <h3>{`${post.title} by ${post.author}`}</h3>
                </Link>
                <p>{`Number of comments: ${post.number_of_comments}`}</p>
            </Panel>
        ));
        return (
            <Grid>
                <Row>
                    <Col xs={3}>
                        <h3>Categories</h3>
                        <ListGroup>
                            {categories.map(category => (
                                <LinkContainer
                                    key={category.name}
                                    to={`/${category.name}`}>
                                    <ListGroupItem>
                                        {utils.capitalize(category.name)}
                                    </ListGroupItem>
                                </LinkContainer>
                            ))}
                        </ListGroup>
                    </Col>
                    <Col xs={9}>
                        <Row>
                            <Col xs={6}>
                                <h3>Posts</h3>
                            </Col>
                            <Col xs={4}>
                                <FormControl
                                    value={sort}
                                    onChange={this.handleSortChange}
                                    className="sort-select"
                                    componentClass="select">
                                    <option value="voteScore">
                                        Sort by Vote Score
                                    </option>
                                    <option value="date">Sort by Date</option>
                                </FormControl>
                            </Col>
                            <Col xs={2}>
                                <LinkContainer to="/post/form/new">
                                    <Button
                                        className="new-post-btn"
                                        bsStyle="primary">
                                        New Post
                                    </Button>
                                </LinkContainer>
                            </Col>
                        </Row>
                        <ListGroup>
                            {posts.length > 0 ? (
                                postList
                            ) : (
                                <h4>No Posts Found</h4>
                            )}
                        </ListGroup>
                    </Col>
                </Row>
            </Grid>
        );
    }
}

const mapStateToProps = state => {
    return {
        categories: state.categories,
        posts: state.posts,
        sort: state.sort_posts_by,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        fetchCategories: () => dispatch(fetchCategories()),
        fetchPosts: () => dispatch(fetchPosts()),
        fetchPostByCategory: category =>
            dispatch(fetchPostByCategory(category)),
        fetchPostDetails: id => dispatch(fetchPostDetails(id)),
        fetchPostComments: id => dispatch(fetchPostComments(id)),
        postVoteForPost: vote => dispatch(postVoteForPost(vote)),
        deletePost: id => dispatch(deletePost(id)),
        setPostsSort: sort_by => dispatch(setPostsSort(sort_by)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Main);
