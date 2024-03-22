export const requestCarbon = async (
    secret: string | null,
    method: string,
    endpoint: string,
    body?: { [key: string]: any },
): Promise<Response> => {
    let headers: HeadersInit = {}
    if (secret) {
        headers["Authorization"] = `Bearer ${secret}`;
    }
    if (method === "POST") {
        headers["Content-Type"] = "application/json";
    }

    return await fetch(`${process.env.NEXT_PUBLIC_API_URL}${endpoint}`, {
        method,
        headers,
        body: body ? JSON.stringify(body) : undefined,
    });
}