export async function fetchProperties(params = {}) {
    const query = new URLSearchParams(params).toString();
    const url = query
        ? `/api/properties?${query}`
        : '/api/properties';

    let response;

    try {
        response = await fetch(url);
    } catch (error) {
        throw new Error('Cannot connect to the server. Make sure Express is running.');
    }

    if (!response.ok) {
        throw new Error(`Request failed: ${response.status}`);
    }

    return response.json();
}

export async function fetchPropertyDetail(id) {
    let response;

    try {
        response = await fetch(`/api/properties/${id}`);
    } catch (error) {
        throw new Error('Cannot connect to the server. Make sure Express is running.');
    }

    if (!response.ok) {
        throw new Error(`Request failed: ${response.status}`);
    }

    return response.json();
}