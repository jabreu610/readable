const Authorization = 'super-secret-key';
const baseUrl = `http://localhost:${process.env.port || 3001}`;

export function fetchCategories() {
    return fetch(`${baseUrl}/categories`, { headers: { Authorization } })
        .then((res) => res.json());
}