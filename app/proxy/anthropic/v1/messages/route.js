import { headers } from 'next/headers';

const TARGET_SERVER_URL = 'https://api.anthropic.com/v1/messages';
const API_KEY = process.env.ANTHROPIC_API_KEY;

// Helper to setup common headers
function getCommonHeaders() {
    return {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': '*'
    };
}

export async function POST(request) {
    console.log("POST request received");

    let requestBody;
    try {
        requestBody = await request.json();
    } catch (error) {
        console.error("Failed to parse JSON:", error);
        return new Response(JSON.stringify({ error: "Bad Request: Invalid JSON" }), {
            status: 400,
            headers: getCommonHeaders()
        });
    }
    
    const headersList = headers();

    // ------------------------------------------------------------------------
    // If you want to pass the API key from the client, 
    // uncomment the following two lines.
    // This could be useful if you want to implement a 
    // Bring my own keys approach but keep the proxy
    // ------------------------------------------------------------------------
    
    // const apiKey = headersList.get('x-api-key') || API_KEY;
    
    const apiKey = API_KEY;

    if (!apiKey) {
        return new Response(JSON.stringify({ error: "Unauthorized: API key is missing" }), {
            status: 401,
            headers: getCommonHeaders()
        });
    }

    try {
        const response = await fetch(TARGET_SERVER_URL, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                "x-api-key": apiKey,
                "anthropic-version": headersList.get('anthropic-version') || "2023-06-01"
            },
            body: JSON.stringify(requestBody),
        });

        if (!response.ok) {
            const errorResponse = await response.text();
            return new Response(JSON.stringify({ error: errorResponse }), {
                status: response.status,
                headers: getCommonHeaders()
            });
        }

        const responseData = await response.json();
        return new Response(JSON.stringify(responseData), {
            status: 200,
            headers: getCommonHeaders()
        });
    } catch (error) {
        console.error("Failed to fetch from external API:", error);
        return new Response(JSON.stringify({ error: "Internal Server Error" }), {
            status: 500,
            headers: getCommonHeaders()
        });
    }
}

export function OPTIONS() {
    return new Response(null, {
        status: 204,
        headers: getCommonHeaders()
    });
}