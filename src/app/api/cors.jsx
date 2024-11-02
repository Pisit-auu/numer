// Add this to your API handler
import Cors from 'cors';

// Initialize the cors middleware
const cors = Cors({
    methods: ['GET', 'POST', 'DELETE', 'PUT', 'OPTIONS'],
    origin: '*', // Adjust this to restrict origins if needed
});

// Helper method to wait for middleware to run before returning a response
function runMiddleware(req, res, fn) {
    return new Promise((resolve, reject) => {
        fn(req, res, result => {
            if (result instanceof Error) {
                return reject(result);
            }
            return resolve(result);
        });
    });
}

// Example API route
export async function POST(request, res) {
    await runMiddleware(request, res, cors);
    
    // Your existing code...
}
