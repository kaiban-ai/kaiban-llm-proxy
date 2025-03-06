import { headers } from "next/headers";

const TARGET_SERVER_URL = "https://api.duffel.com/air/";
const API_KEY = `Bearer ${process.env.DUFFEL_API_KEY}`;

// Helper to setup common headers
function getCommonHeaders() {
  return {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "*"
  };
}

// Helper to build the target URL
function buildTargetUrl(request) {
  const url = new URL(request.url);
  const duffelPath = url.pathname.replace("/integrations/duffel", "");
  return `${TARGET_SERVER_URL}${duffelPath}${url.search}`;
}

export async function POST(request) {
  console.log("POST request received");

  let requestBody;
  try {
    requestBody = await request.json();
    console.log({ requestBody });
  } catch (error) {
    console.error("Failed to parse JSON:", error);
    return new Response(
      JSON.stringify({ error: "Bad Request: Invalid JSON" }),
      {
        status: 400,
        headers: getCommonHeaders()
      }
    );
  }

  const targetUrl = buildTargetUrl(request);
  console.log({ targetUrl });
  const apiKey = API_KEY;
  if (!apiKey) {
    return new Response(
      JSON.stringify({ error: "Unauthorized: API key is missing" }),
      {
        status: 401,
        headers: getCommonHeaders()
      }
    );
  }

  try {
    const response = await fetch(targetUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: apiKey,
        "Duffel-Version": "v1",
        Accept: "application/json",
        "Accept-Encoding": "gzip"
      },
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      const errorResponse = await response.text();
      console.log({ errorResponse });
      return new Response(JSON.stringify({ error: errorResponse }), {
        status: response.status,
        headers: getCommonHeaders()
      });
    }

    const responseData = await response.json();
    console.log({ responseData });
    return new Response(JSON.stringify(responseData), {
      status: 200,
      headers: getCommonHeaders()
    });
  } catch (error) {
    console.error("Failed to fetch from Duffel API:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
      headers: getCommonHeaders()
    });
  }
}

export async function GET(request) {
  console.log("GET request received");

  const targetUrl = buildTargetUrl(request);

  const apiKey = API_KEY;
  if (!apiKey) {
    return new Response(
      JSON.stringify({ error: "Unauthorized: API key is missing" }),
      {
        status: 401,
        headers: getCommonHeaders()
      }
    );
  }

  try {
    const response = await fetch(targetUrl, {
      method: "GET",
      headers: {
        Authorization: apiKey,
        "Duffel-Version": "v1",
        Accept: "application/json",
        "Accept-Encoding": "gzip"
      }
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
    console.error("Failed to fetch from Duffel API:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
      headers: getCommonHeaders()
    });
  }
}

export function OPTIONS(request) {
  console.log("OPTIONS request received");
  return new Response(null, {
    status: 200, // Changed from 204 to 200 for better CORS compatibility
    headers: {
      ...getCommonHeaders(),
      "Access-Control-Max-Age": "86400" // 24 hours
    }
  });
}
