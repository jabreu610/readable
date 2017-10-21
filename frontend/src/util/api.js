const Authorization = 'super-secret-key';
const baseUrl = `http://localhost:${process.env.port || 3001}`;

export function fetchCategories() {
    return fetch(`${baseUrl}/categories`, { headers: { Authorization } })
        .then((res) => res.json());
}

export function fetchAllPosts() {
    return fetch(`${baseUrl}/posts`, { headers: { Authorization } })
        .then((res) => res.json());
}

export function fetchPostsByCategory(category) {
    return fetch(`${baseUrl}/${category}/posts`, { headers: { Authorization } })
        .then((res) => res.json());
}

export function fetchPostsDetails(id) {
    return fetch(`${baseUrl}/posts/${id}`, { headers: { Authorization } })
        .then(res => res.json());
}

export function fetchCommentsForPost(id) {
    return fetch(`${baseUrl}/posts/${id}/comments`, { headers: { Authorization } })
        .then(res => res.json());
}

