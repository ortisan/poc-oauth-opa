# Poc Oauth + OPA

This poc demonstrate the possibilities of Oauth and Opa into the authorization pipeline.

## Questions

Minha aplicaćão está tomando decisões pelo cliente?

O recurso que estou usando é um recurso de sistema ou de cliente?
    - Calendar API - Sistema
    - Authorization Server API - Sistama
    - Account API - Usuário
    - Cashout API - Usuário
    - Cashin API - Usuário
    

## Patterns

### Subject

- The **sub** is commonly used to identify who the token is issued for.

#### When is sub Important?

- API Authorization: The sub claim can be used to authorize API calls based on the user's identity.
- Session Management: Ensures user sessions can be managed across multiple logins.
- Multi-Tenant Systems: Helps distinguish between users in different tenants.
- Auditing: The sub claim allows tracking actions back to a specific user.

### Resource

n OAuth 2.0, a resource refers to a protected asset or data that a client wants to access on behalf of a user. These resources are typically hosted on a resource server.

### Key Concepts

1. Resource Owner (User):
The person who owns the data or resource (e.g., the user whose profile you want to access).

2. Resource Server (API):
The server that hosts the protected resources and validates access tokens to grant or deny access.
Example: An API like Google Drive or a banking service API.

3. Resource Identifier (Resource ID):
A specific entity or object being accessed, often identified by a unique ID.
Example: "user123" or "file456".

4. Access Token:
The token presented by the client to the resource server as proof of authorization to access the resource.

#### Types

- User Information: Name, email, profile picture.
- Files: Documents, media, etc.
- Financial Data: Bank accounts, transactions.
- Service Features: API endpoints (e.g., /api/data, /api/settings).

### Scopes

Scopes define what a client can access on the resource server.

Examples:

| **Scope Name**  | **Description**        |
| --------------- | ---------------------- |
| `read:profile`  | Read user's profile.   |
| `write:profile` | Modify user's profile. |
| `read:files`    | Access user's files.   |
| `write:files`   | Upload or edit files.  |

## Concepts

### [Client Credentials Flow](Client Credentials Flow)

The Client Credentials Flow (defined in [OAuth 2.0 RFC 6749, section 4.4](https://datatracker.ietf.org/doc/html/rfc6749#section-4.4)) involves an application exchanging its application credentials, such as client ID and client secret, for an access token.

This flow is best suited for **Machine-to-Machine (M2M) applications**, such as CLIs, daemons, or backend services, **because the system must authenticate and authorize the application instead of a user**.

### [Authorization Flow](https://auth0.com/docs/get-started/authentication-and-authorization-flow/authorization-code-flow)

### JSON Web Token Claims

JSON web tokens (JWTs) claims are pieces of information asserted about a subject. For example, an ID token (which is always a JWT) can contain a claim called name that asserts that the name of the user authenticating is "John Doe". In a JWT, a claim appears as a name/value pair where the name is always a string and the value can be any JSON value. Generally, when we talk about a claim in the context of a JWT, we are referring to the name (or key).

The JWT specification defines seven **reserved claims** that are not required, but are recommended to allow interoperability with third-party applications. These are:
- iss (issuer): Issuer of the JWT
- sub (subject): Subject of the JWT (the user)
- aud (audience): Recipient for which the JWT is intended
- exp (expiration time): Time after which the JWT expires
- nbf (not before time): Time before which the JWT must not be accepted for processing
- iat (issued at time): Time at which the JWT was issued; can be used to determine age of the JWT
- jti (JWT ID): Unique identifier; can be used to prevent the JWT from being replayed (allows a token to be used only once)

You can see a full list of registered claims at the [IANA JSON Web Token Claims Registry](https://www.iana.org/assignments/jwt/jwt.xhtml#claims).

You can define your own **custom claims** which you control and you can add them to a token using Actions. Here are some examples:
Add a user's email address to an access token and use that to uniquely identify the user.
Add custom information stored in an Auth0 user profile to an ID token.
As long as the Action is in place, the custom claims it adds will appear in new tokens issued when using a refresh token.

## Open Policy Agent (OPA)

Open Policy Agent (OPA) is an open-source policy engine developed by Styra and currently incubating at the Cloud Native Computing Foundation. It serves as a unified solution for implementing policies across various layers of the technology stack. OPA enables policy enforcement in various contexts, including microservices, Kubernetes, CI/CD pipelines, API gateways, data protection, SSH/Sudo and container exec control, and Terraform risk analysis.

A fundamental concept of OPA is the separation of policy decision-making from enforcement. This approach empowers architects, developers, and security professionals to express security policies as code, providing a robust framework for implementing and adhering to policies effectively across different environments.

OPA policies are expressed in a high-level declarative language called Rego. Rego (pronounced “ray-go”) is purpose-built for expressing policies over complex hierarchical data structures. This allows the implementation of policy-as-code.


## Runing Poc

Start auth server: 

```bash
node server.js
```

Start OPA:

```bash
docker compose up --build
```