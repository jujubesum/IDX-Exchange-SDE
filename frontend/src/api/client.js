// Drop '', null and undefined so the backend never receives empty params.
// A value of 0 is kept (e.g. offset=0).
function removeEmpty(params) {
    return Object.fromEntries(
        Object.entries(params).filter(([, value]) => value !== '' && value != null)
    );
}

export async function fetchProperties(params = {}) {
    const query = new URLSearchParams(removeEmpty(params)).toString();
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