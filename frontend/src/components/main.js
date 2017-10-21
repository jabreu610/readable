import React, { Component } from "react";
import { connect } from "react-redux";
import { 
    fetchCategories,
    fetchPosts, 
    fetchPostByCategory, 
    fetchPostDetails, 
    fetchPostComments,
} from "../actions";
import { LinkContainer } from "react-router-bootstrap";
import * as utils from '../util/utils';
import {
  Grid,
  Row,
  Col,
  Button,
  ListGroup,
  ListGroupItem,
  FormControl
} from "react-bootstrap";
import moment from "moment";

class Main extends Component {
  state = {
    sort: "voteScore",
    selectedCategory:
      this.props.location.pathname === "/"
        ? null
        : this.props.location.pathname.replace("/", "")
  };
  componentDidMount() {
    this.props.fetchCategories();
    if (!this.state.selectedCategory) {
      this.props.fetchPosts();
    } else {
      this.props.fetchPostByCategory(this.state.selectedCategory);
    }
  }
  componentWillReceiveProps(nextProps) {
    const { location } = nextProps;
    if (location.pathname !== this.props.location.pathname) {
      const selectedCategory =
        location.pathname === "/" ? null : location.pathname.replace("/", "");
      if (selectedCategory) {
        this.props.fetchPostByCategory(selectedCategory);
      } else {
        this.props.fetchPosts();
      }
      this.setState({
        selectedCategory
      });
    }
  }
  handleSortChange = e => {
    this.setState({
      sort: e.target.value
    });
  };
  sortByVoteScore = (a, b) => {
    return b.voteScore - a.voteScore;
  };
  sortByTimestamp = (a, b) => {
    return b.timestamp - a.timestamp;
  };
  render() {
    const { categories, posts } = this.props;
    const { sort } = this.state;
    let sortFunction;
    if (sort === "voteScore") {
      sortFunction = this.sortByVoteScore;
    }
    if (sort === "date") {
      sortFunction = this.sortByTimestamp;
    }
    const postList = posts
      .sort((a, b) => sortFunction(a, b))
      .map(post => (
        <LinkContainer key={post.id} to={`/post/${post.id}`}>
          <ListGroupItem
            header={`${post.title} - ${moment(post.timestamp).format(
              "MMM DD, YYYY hh:mma"
            )}`}
          >
            {post.body}
          </ListGroupItem>
        </LinkContainer>
      ));
    return (
        <Grid>
            <Row>
            <Col xs={3}>
                <h3>Categories</h3>
                <ListGroup>
                {categories.map(category => (
                    <LinkContainer key={category.name} to={`/${category.name}`}>
                    <ListGroupItem>{utils.capitalize(category.name)}</ListGroupItem>
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
                    componentClass="select"
                    >
                    <option value="voteScore">Sort by Vote Score</option>
                    <option value="date">Sort by Date</option>
                    </FormControl>
                </Col>
                <Col xs={2}>
                    <Button className="new-post-btn" bsStyle="primary">
                    New Post
                    </Button>
                </Col>
                </Row>
                <ListGroup>
                {posts.length > 0 ? postList : <h4>No Posts Found</h4>}
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
    posts: state.posts
  };
};

const mapDispatchToProps = dispatch => {
  return {
    fetchCategories: () => dispatch(fetchCategories()),
    fetchPosts: () => dispatch(fetchPosts()),
    fetchPostByCategory: category => dispatch(fetchPostByCategory(category)),
    fetchPostDetails: id => dispatch(fetchPostDetails(id)),
    fetchPostComments: id => dispatch(fetchPostComments(id)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Main);