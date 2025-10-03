// Guard clauses: a step in the right direction, but still not perfect.
// TikTok: https://www.tiktok.com/@didof.dev/video/7540585693223914774

import type { Request } from "./types"

function handleRequestWithGuards(req: Request) {
  // 1. Logging
  console.log(`Request Path: ${req.path}`);

  // 2. Authentication Guard
  if (req.headers['Authorization'] !== 'valid-token') {
    console.log('Error: Unauthorized');
    return;
  }

  // 3. Authorization Guard (for admin path)
  if (req.path === '/admin' && req.headers['Role'] !== 'admin') {
    console.log('Error: Insufficient privileges');
    return;
  }

  console.log('Request successful');
  // ... process request
}