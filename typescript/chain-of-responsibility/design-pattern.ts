import type { Request } from "./types";

interface IHandler {
  setNext(handler: IHandler): IHandler;
  handle(request: Request): Request | null;
}

abstract class AbstractHandler implements IHandler {
  protected nextHandler: IHandler | null = null;

  public setNext(handler: IHandler): IHandler {
    this.nextHandler = handler;
    return handler;
  }

  public handle(request: Request): Request | null {
    if (this.nextHandler) {
      return this.nextHandler.handle(request);
    }
    return request;
  }
}

class LoggingHandler extends AbstractHandler {
  public handle(request: Request): Request | null {
    console.log(`[LOG]: Received request for ${request.path}`);
    return super.handle(request);
  }
}

class AuthenticationHandler extends AbstractHandler {
  public handle(request: Request): Request | null {
    console.log("[AUTH]: Checking authentication...");

    if (request.headers["Authorization"] !== "valid-token") {
      console.log("--> [AUTH]: FAILED! Invalid token.");
      return null;
    }

    console.log("--> [AUTH]: SUCCESS! Token is valid.");
    return super.handle(request);
  }
}

class AdminAuthorizationHandler extends AbstractHandler {
  public handle(request: Request): Request | null {
    console.log("[ADMIN]: Checking admin authorization...");

    if (request.path === "/admin") {
      if (request.headers["Role"] === "admin") {
        console.log("--> [ADMIN]: SUCCESS! Access granted.");
        return super.handle(request);
      } else {
        console.log("--> [ADMIN]: FAILED! Insufficient privileges.");
        return null;
      }
    }

    // For non-admin paths, just pass it along.
    return super.handle(request);
  }
}

// --- Let's run it! ---

const adminChain = new LoggingHandler();
adminChain
  .setNext(new AuthenticationHandler())
  .setNext(new AdminAuthorizationHandler());

console.log("--- 1. Processing a valid Admin request ---");
const adminRequest: Request = {
  path: "/admin",
  headers: { Authorization: "valid-token", Role: "admin" },
};
adminChain.handle(adminRequest);

console.log("\n--- 2. Processing a request with a bad token ---");
const badAuthRequest: Request = {
  path: "/admin",
  headers: { Authorization: "invalid-token" },
};
adminChain.handle(badAuthRequest);

console.log("\n--- 3. Processing a request with insufficient privileges ---");
const userRequest: Request = {
  path: "/admin",
  headers: { Authorization: "valid-token", Role: "user" },
};
adminChain.handle(userRequest);
