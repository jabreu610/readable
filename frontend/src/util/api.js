const Authorization = "super-secret-key";
const baseUrl = `http://localhost:${process.env.port || 3001}`;

export function fetchCategories() {
    return fetch(`${baseUrl}/categories`, {
        headers: { Authorization },
    }).then(res => res.json());
}

export function fetchAllPosts() {
    return fetch(`${baseUrl}/posts`, { headers: { Authorization } })
        .then(res => res.json())
        .then(data => {
            let promises = data.map(post => {
                return fetchCommentsForPost(post.id).then(comments => {
                    post.number_of_comments = comments.length;
                    return post;
                });
            });
            return Promise.all(promises);
        });
}

export function fetchPostsByCategory(category) {
    return fetch(`${baseUrl}/${category}/posts`, { headers: { Authorization } })
        .then(res => res.json())
        .then(data => {
            let promises = data.map(post => {
                return fetchCommentsForPost(post.id).then(comments => {
                    post.number_of_comments = comments.length;
                    return post;
                });
            });
            return Promise.all(promises);
        });
}

export function fetchPostsDetails(id) {
    return fetch(`${baseUrl}/posts/${id}`, {
        headers: { Authorization },
    }).then(res => res.json());
}

export function fetchCommentDetails(id) {
    return fetch(`${baseUrl}/comments/${id}`, {
        headers: { Authorization },
    }).then(res => res.json());
}

export function fetchCommentsForPost(id) {
    return fetch(`${baseUrl}/posts/${id}/comments`, {
        headers: { Authorization },
    }).then(res => res.json());
}

export function postNewComment(body) {
    return fetch(`${baseUrl}/comments`, {
        headers: { Authorization, "Content-Type": "application/json" },
        method: "POST",
        body: JSON.stringify(body),
    }).then(res => res.json());
}

export function editComment(body) {
    const commentId = body["commentId"];
    return fetch(`${baseUrl}/comments/${commentId}`, {
        headers: { Authorization, "Content-Type": "application/json" },
        method: "PUT",
        body: JSON.stringify(body),
    }).then(res => res.json());
}

export function deleteComment(id) {
    return fetch(`${baseUrl}/comments/${id}`, {
        headers: { Authorization },
        method: "DELETE",
    }).then(res => res.json());
}

export function postNewPost(body) {
    return fetch(`${baseUrl}/posts`, {
        headers: { Authorization, "Content-Type": "application/json" },
        method: "POST",
        body: JSON.stringify(body),
    }).then(res => res.json());
}

export function editPost(body) {
    const { id } = body;
    delete body["id"];
    return fetch(`${baseUrl}/posts/${id}`, {
        headers: { Authorization, "Content-Type": "application/json" },
        method: "PUT",
        body: JSON.stringify(body),
    }).then(res => res.json());
}

export function deletePost(id) {
    return fetch(`${baseUrl}/posts/${id}`, {
        headers: { Authorization },
        method: "DELETE",
    }).then(res => res.json());
}

export function voteForComment(body) {
    const commentId = body["commentId"];
    delete body["parentId"];
    delete body["commentId"];
    return fetch(`${baseUrl}/comments/${commentId}`, {
        headers: { Authorization, "Content-Type": "application/json" },
        method: "POST",
        body: JSON.stringify(body),
    }).then(res => res.json());
}

export function voteForPost(body) {
    const postId = body["postId"];
    delete body["postId"];
    return fetch(`${baseUrl}/posts/${postId}`, {
        headers: { Authorization, "Content-Type": "application/json" },
        method: "POST",
        body: JSON.stringify(body),
    }).then(res => res.json());
}
