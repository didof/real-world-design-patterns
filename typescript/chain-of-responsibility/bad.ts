// The "bad" way: one giant function

import type { Request } from "./types"

function handleRequest(req: Request) {
    // 1. Logging
    console.log(`Request Path: ${req.path}`);

    // 2. Authentication
    if (req.headers['Authorization'] === 'valid-token') {
        // 3. Authorization for a specific path
        if (req.path === '/admin') {
            if (req.headers['Role'] === 'admin') {
                console.log('Welcome, Admin!');
                // ... process admin request
            } else {
                console.log('Error: Insufficient privileges');
            }
        } else {
            console.log('Request successful');
            // ... process general request
        }
    } else {
        console.log('Error: Unauthorized');
    }
}