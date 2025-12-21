const API_BASE = "/api/1.0";
const LOGIN_API = "http://localhost:8080/login";

// Helper function for API requests
async function apiRequest(url, options = {}) {
    const response = await fetch(url, {
        ...options,
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
            ...options.headers,
        },
    });

    if (!response.ok) {
        const error = await response.json().catch(() => ({ message: "Network error" }));
        throw new Error(error.message || "Request failed");
    }

    return response.json();
}

// Auth
export async function login(username, password) {
    const formData = new URLSearchParams();
    formData.append("username", username);
    formData.append("password", password);
    console.log("ОТПРАВЛЯЕМ ДАННЫЕ ДЛЯ ВХОДА: login:" + username + " ПАРОЛЬ: " + password);
    const response = await fetch(LOGIN_API, {
        method: "POST",
        credentials: "include",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: formData,
    });

    if (!response.ok) {
        throw new Error("Invalid credentials");
    }

    return response;
}

export async function logout() {
    const response = await fetch("/logout", {
        method: "POST",
        credentials: "include",
    });
    return response;
}

export async function register(userData) {
    return apiRequest(`${API_BASE}/users/register`, {
        method: "POST",
        body: JSON.stringify(userData),
    });
}

// Users
export async function getCurrentUser() {
    return apiRequest(`${API_BASE}/users/me`);
}

export async function getUsers(page = 1, size = 2) {
    return apiRequest(`${API_BASE}/users?page=${page}&size=${size}`);
}

export async function getUserById(id) {
    return apiRequest(`${API_BASE}/users/${id}`);
}

export async function deleteUser(id) {
    return apiRequest(`${API_BASE}/users/${id}`, { method: "DELETE" });
}

export async function updatePassword(passwordData) {
    return apiRequest(`${API_BASE}/users/password`, {
        method: "PUT",
        body: JSON.stringify(passwordData),
    });
}

export async function subscribeToUser(id) {
    const response = await fetch(`${API_BASE}/users/${id}/subscribe`, {
        method: "POST",
        credentials: "include",
    });
    if (!response.ok) throw new Error("Subscribe failed");
    return response;
}

export async function unsubscribeFromUser(id) {
    const response = await fetch(`${API_BASE}/users/${id}/unsubscribe`, {
        method: "POST",
        credentials: "include",
    });
    if (!response.ok) throw new Error("Unsubscribe failed");
    return response;
}

// Posts
export async function getPosts(page = 1, size = 2) {
    return apiRequest(`${API_BASE}/posts?page=${page}&size=${size}`);
}

export async function getPostById(id) {
    return apiRequest(`${API_BASE}/posts/${id}`);
}

export async function getPostsByCategory(categoryId, page = 1, size = 2) {
    return apiRequest(`${API_BASE}/posts/category/${categoryId}?page=${page}&size=${size}`);
}

export async function createPost(postData) {
    return apiRequest(`${API_BASE}/posts`, {
        method: "POST",
        body: JSON.stringify(postData),
    });
}

export async function updatePost(id, postData) {
    return apiRequest(`${API_BASE}/posts/${id}`, {
        method: "PUT",
        body: JSON.stringify(postData),
    });
}

export async function deletePost(id) {
    const response = await fetch(`${API_BASE}/posts/${id}`, {
        method: "DELETE",
        credentials: "include",
    });
    if (!response.ok) throw new Error("Delete failed");
    return response;
}

// Comments
export async function getCommentsByPost(postId, page = 1, size = 100) {
    return apiRequest(`${API_BASE}/comments/post/${postId}?page=${page}&size=${size}`);
}

export async function createComment(commentData) {
    return apiRequest(`${API_BASE}/comments`, {
        method: "POST",
        body: JSON.stringify(commentData),
    });
}

export async function updateComment(id, commentData) {
    return apiRequest(`${API_BASE}/comments/${id}`, {
        method: "PUT",
        body: JSON.stringify(commentData),
    });
}

export async function deleteComment(id) {
    const response = await fetch(`${API_BASE}/comments/${id}`, {
        method: "DELETE",
        credentials: "include",
    });
    if (!response.ok) throw new Error("Delete failed");
    return response;
}

// Categories
export async function getCategories(page = 1, size = 2) {
    return apiRequest(`${API_BASE}/categories?page=${page}&size=${size}`);
}

export async function createCategory(categoryData) {
    return apiRequest(`${API_BASE}/categories`, {
        method: "POST",
        body: JSON.stringify(categoryData),
    });
}

export async function updateCategory(id, categoryData) {
    return apiRequest(`${API_BASE}/categories/${id}`, {
        method: "PUT",
        body: JSON.stringify(categoryData),
    });
}

export async function deleteCategory(id) {
    const response = await fetch(`${API_BASE}/categories/${id}`, {
        method: "DELETE",
        credentials: "include",
    });
    if (!response.ok) throw new Error("Delete failed");
    return response;
}
