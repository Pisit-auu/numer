export const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, DELETE, PUT, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

export function jsonWithCors(data, init = {}) {
    return Response.json(data, {
        ...init,
        headers: {
            ...corsHeaders,
            ...(init.headers || {}),
        },
    });
}

export function optionsWithCors() {
    return new Response(null, {
        status: 204,
        headers: corsHeaders,
    });
}
