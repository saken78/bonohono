import { describe, test, expect, beforeAll } from "bun:test";

const BASE_URL = "http://localhost:9999/api";
async function request(
  path: string,
  options: {
    method?: string;
    body?: Record<string, unknown>;
    headers?: Record<string, string>;
    cookies?: string;
  } = {},
): Promise<{ status: number; data: any; cookies?: string[] }> {
  const { method = "GET", body, headers = {}, cookies } = options;

  const cookieHeader = cookies ? { Cookie: cookies } : {};

  const response = await fetch(`${BASE_URL}${path}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...headers,
      ...cookieHeader,
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  const setCookies = response.headers.getSetCookie?.() || [];
  const data = await response.json();

  return {
    status: response.status,
    data,
    cookies: setCookies,
  };
}

function extractCookies(cookies: string[]): string {
  return cookies
    .map((c) => c.split(";").at(0))
    .filter(Boolean)
    .join("; ");
}

describe("Auth Endpoints", () => {
  test("POST /auth - Register Success", async () => {
    const uniqueEmail = `test_${Date.now()}@example.com`;
    const res = await request("/auth", {
      method: "POST",
      body: {
        email: uniqueEmail,
        password: "password123",
        first_name: "Test",
        last_name: "User",
      },
    });

    expect(res.status).toBe(201);
    expect(res.data.status_code).toBe(201);
    expect(res.data.data).toMatchObject({
      email: uniqueEmail,
    });
  });
  test("POST /auth - Register Error (duplicate email)", async () => {
    const res = await request("/auth", {
      method: "POST",
      body: {
        email: "duplicate@example.com",
        password: "password123",
        first_name: "Test",
        last_name: "User",
      },
    });

    expect(res.status).toBe(409);
    expect(res.data.errors).toContain(
      "There is a unique constraint violation, a new user cannot be created with this email",
    );
  });

  test("POST /auth - Register Error (invalid email)", async () => {
    const res = await request("/auth", {
      method: "POST",
      body: {
        email: "invalid-email",
        password: "password123",
        first_name: "Test",
      },
    });

    expect(res.status).toBe(400);
    expect(res.data.errors).toBeDefined();
  });

  test("POST /auth - Register Error (password too short)", async () => {
    const res = await request("/auth", {
      method: "POST",
      body: {
        email: `short_${Date.now()}@example.com`,
        password: "short",
        first_name: "Test",
      },
    });

    expect(res.status).toBe(400);
    expect(res.data.errors).toBeDefined();
  });

  test("POST /auth - Register Error (first_name too short)", async () => {
    const res = await request("/auth", {
      method: "POST",
      body: {
        email: `name_${Date.now()}@example.com`,
        password: "password123",
        first_name: "ab",
      },
    });

    expect(res.status).toBe(400);
    expect(res.data.errors).toBeDefined();
  });

  test("POST /auth/login - Login Success", async () => {
    // const uniqueEmail = `logintest_${Date.now()}@example.com`;
    // await request("/auth", {
    //   method: "POST",
    //   body: {
    //     email: uniqueEmail,
    //     password: "password123",
    //     first_name: "Login",
    //     last_name: "Test",
    //   },
    // });

    const res = await request("/auth/login", {
      method: "POST",
      body: {
        email: "snowman@gmail.com",
        password: "sakenspot",
      },
    });

    expect(res.status).toBe(200);
    expect(res.data.data).toMatchObject({
      email: "snowman@gmail.com",
      first_name: "snowman",
    });
    expect(res.cookies).toBeDefined();
  });

  test("POST /auth/login - Login Error (wrong password)", async () => {
    const res = await request("/auth/login", {
      method: "POST",
      body: {
        email: "nonexistent@example.com",
        password: "wrongpassword",
      },
    });

    expect(res.status).toBe(401);
  });

  test("POST /auth/login - Login Error (missing email)", async () => {
    const res = await request("/auth/login", {
      method: "POST",
      body: {
        password: "password123",
      },
    });

    expect(res.status).toBe(400);
    expect(res.data.errors).toBeDefined();
  });

  test("GET /auth/me - Success (authenticated)", async () => {
    // const uniqueEmail = `metest_${Date.now()}@example.com`;
    // await request("/auth", {
    //   method: "POST",
    //   body: {
    //     email: uniqueEmail,
    //     password: "password123",
    //     first_name: "Me",
    //     last_name: "Test",
    //   },
    // });

    const loginRes = await request("/auth/login", {
      method: "POST",
      body: {
        email: "snowman@gmail.com",
        password: "sakenspot",
      },
    });

    const cookie = extractCookies(loginRes.cookies || []);

    const res = await request("/auth/me", {
      method: "GET",
      cookies: cookie,
    });

    expect(res.status).toBe(200);
    expect(res.data.data).toMatchObject({
      email: "snowman@gmail.com",
    });
  });

  test("GET /auth/me - Error (not authenticated)", async () => {
    const res = await request("/auth/me", {
      method: "GET",
    });

    expect(res.status).toBe(401);
  });
  test("PATCH /auth/current - Reset Password Success", async () => {
    const uniqueEmail = `reset_${Date.now()}@example.com`;
    await request("/auth", {
      method: "POST",
      body: {
        email: uniqueEmail,
        password: "password123",
        first_name: "Reset",
        last_name: "Test",
      },
    });

    const loginRes = await request("/auth/login", {
      method: "POST",
      body: {
        email: uniqueEmail,
        password: "password123",
      },
    });

    const cookie = extractCookies(loginRes.cookies || []);

    const res = await request("/auth/current", {
      method: "PATCH",
      body: { email: uniqueEmail, password: "newpassword123" },
      cookies: cookie,
    });

    // await request("/auth/delete_account", {
    //   method: "DELETE",
    // });

    expect(res.status).toBe(200);
    expect(res.data.message).toBe("Pasword changed succesfully");
  });

  test("PATCH /auth/current - Error (password too short)", async () => {
    const uniqueEmail = `reset2_${Date.now()}@example.com`;
    await request("/auth", {
      method: "POST",
      body: {
        email: uniqueEmail,
        password: "password123",
        first_name: "Reset2",
        last_name: "Test",
      },
    });

    const loginRes = await request("/auth/login", {
      method: "POST",
      body: {
        email: uniqueEmail,
        password: "password123",
      },
    });

    const cookie = extractCookies(loginRes.cookies || []);

    const res = await request("/auth/current", {
      method: "PATCH",
      body: { password: "short" },
      cookies: cookie,
    });

    expect(res.status).toBe(400);
  });

  test("DELETE /auth/current - Logout Success", async () => {
    const uniqueEmail = `logout_${Date.now()}@example.com`;
    await request("/auth", {
      method: "POST",
      body: {
        email: uniqueEmail,
        password: "password123",
        first_name: "Logout",
        last_name: "Test",
      },
    });

    const loginRes = await request("/auth/login", {
      method: "POST",
      body: {
        email: uniqueEmail,
        password: "password123",
      },
    });

    const cookie = extractCookies(loginRes.cookies || []);

    const res = await request("/auth/current", {
      method: "DELETE",
      cookies: cookie,
    });

    expect(res.status).toBe(200);
    expect(res.data.message).toBe("Cookies cleared succesfully");
  });
});
