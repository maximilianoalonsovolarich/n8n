# n8n OAuth2 Architecture Analysis

## Overview

This document provides a comprehensive analysis of n8n's OAuth2 integration architecture, detailing all components, files, and the complete flow for implementing OAuth2 integrations.

## Architecture Components

### 1. Core OAuth2 Library - `@n8n/client-oauth2`

Location: `/packages/@n8n/client-oauth2/`

**Key Files:**
- `src/ClientOAuth2.ts` - Main OAuth2 client class
- `src/ClientOAuth2Token.ts` - Token management and refresh logic
- `src/CodeFlow.ts` - Authorization Code flow implementation
- `src/CredentialsFlow.ts` - Client Credentials flow implementation
- `src/types.ts` - TypeScript type definitions
- `src/utils.ts` - Utility functions for OAuth2 operations

**Purpose:** 
This is n8n's custom OAuth2 client implementation that handles:
- Authorization Code flow (most common for user authentication)
- Client Credentials flow (for app-to-app authentication)
- PKCE (Proof Key for Code Exchange) support
- Token refresh and management
- Request signing with OAuth2 tokens

### 2. Base Credential Classes

Location: `/packages/nodes-base/credentials/`

**Base OAuth2 Credential:**
- `OAuth2Api.credentials.ts` - Generic OAuth2 credential template

**Service-Specific Extensions:**
Examples of OAuth2 implementations extending the base:
- `GoogleOAuth2Api.credentials.ts`
- `FacebookLeadAdsOAuth2Api.credentials.ts`
- `GitlabOAuth2Api.credentials.ts`
- `MicrosoftOAuth2Api.credentials.ts`
- And 50+ other OAuth2 integrations

### 3. OAuth2 Controllers

Location: `/packages/cli/src/controllers/oauth/`

**Key Files:**
- `abstract-oauth.controller.ts` - Base OAuth controller with common functionality
- `oauth2-credential.controller.ts` - OAuth2-specific request handling
- `oauth1-credential.controller.ts` - OAuth1 support (legacy)

**Routes Handled:**
- `/oauth2-credential/auth` - Initialize OAuth2 flow
- `/oauth2-credential/callback` - Handle OAuth2 callback

### 4. Node Execution Functions

Location: `/packages/core/src/NodeExecuteFunctions.ts`

**Key Functions:**
- `requestOAuth2()` - Main function for making OAuth2-authenticated requests
- `requestWithAuthentication()` - Generic authentication wrapper
- Token refresh logic and error handling

### 5. OAuth2 Templates

Location: `/packages/cli/templates/`

**Files:**
- `oauth-callback.handlebars` - Success callback page template
- `oauth-error-callback.handlebars` - Error callback page template

## OAuth2 Flow Architecture

### 1. Authorization Code Flow (Most Common)

```
1. User initiates OAuth2 connection in n8n UI
2. n8n generates authorization URL with CSRF token
3. User redirected to OAuth2 provider (e.g., Google, Facebook)
4. User grants permissions
5. Provider redirects back to n8n callback URL
6. n8n exchanges authorization code for access token
7. Token stored encrypted in n8n database
8. Subsequent API calls use stored token
9. Token automatically refreshed when expired
```

### 2. Client Credentials Flow

```
1. n8n directly requests access token using client ID/secret
2. No user interaction required
3. Used for app-to-app authentication
4. Token refresh handled automatically
```

### 3. PKCE Flow

```
1. Similar to Authorization Code but with additional security
2. Uses dynamically generated code_challenge/code_verifier
3. Prevents authorization code interception attacks
4. Required by some modern OAuth2 providers
```

## File Structure and Relationships

```
n8n/
├── packages/
│   ├── @n8n/client-oauth2/           # Core OAuth2 client library
│   │   ├── src/
│   │   │   ├── ClientOAuth2.ts       # Main OAuth2 client
│   │   │   ├── ClientOAuth2Token.ts  # Token management
│   │   │   ├── CodeFlow.ts           # Authorization code flow
│   │   │   ├── CredentialsFlow.ts    # Client credentials flow
│   │   │   ├── types.ts              # Type definitions
│   │   │   └── utils.ts              # Utility functions
│   │   └── package.json
│   │
│   ├── cli/src/controllers/oauth/    # OAuth2 HTTP endpoints
│   │   ├── abstract-oauth.controller.ts
│   │   ├── oauth2-credential.controller.ts
│   │   └── oauth1-credential.controller.ts
│   │
│   ├── cli/templates/                # OAuth2 callback pages
│   │   ├── oauth-callback.handlebars
│   │   └── oauth-error-callback.handlebars
│   │
│   ├── core/src/                     # OAuth2 execution logic
│   │   └── NodeExecuteFunctions.ts  # requestOAuth2() function
│   │
│   └── nodes-base/credentials/       # Service-specific credentials
│       ├── OAuth2Api.credentials.ts  # Base OAuth2 credential
│       ├── GoogleOAuth2Api.credentials.ts
│       ├── FacebookLeadAdsOAuth2Api.credentials.ts
│       └── [50+ other OAuth2 credentials]
```

## Implementation Patterns

### 1. Service-Specific Credential Pattern

All OAuth2 integrations follow this pattern:

```typescript
import type { ICredentialType, INodeProperties } from 'n8n-workflow';

export class ServiceNameOAuth2Api implements ICredentialType {
    name = 'serviceNameOAuth2Api';
    extends = ['oAuth2Api'];                    // Extend base OAuth2
    displayName = 'Service Name OAuth2 API';
    
    properties: INodeProperties[] = [
        {
            displayName: 'Grant Type',
            name: 'grantType',
            type: 'hidden',
            default: 'authorizationCode',       // Most common
        },
        {
            displayName: 'Authorization URL',
            name: 'authUrl',
            type: 'hidden',
            default: 'https://provider.com/oauth/authorize',
            required: true,
        },
        {
            displayName: 'Access Token URL',
            name: 'accessTokenUrl',
            type: 'hidden',
            default: 'https://provider.com/oauth/token',
            required: true,
        },
        {
            displayName: 'Scope',
            name: 'scope',
            type: 'hidden',
            default: 'read write',              // Service-specific scopes
        },
        // Additional service-specific configuration
    ];
}
```

### 2. Node Implementation Pattern

Nodes using OAuth2 credentials:

```typescript
import type { INodeExecutionData, INodeProperties } from 'n8n-workflow';

export class ServiceNameNode implements INodeType {
    description: INodeTypeDescription = {
        // Node configuration
        credentials: [
            {
                name: 'serviceNameOAuth2Api',
                required: true,
            },
        ],
    };
    
    async execute(): Promise<INodeExecutionData[][]> {
        // Use OAuth2 authentication
        const responseData = await this.helpers.requestOAuth2.call(
            this,
            'serviceNameOAuth2Api',
            requestOptions,
            { tokenType: 'Bearer' }
        );
    }
}
```

## Key Components Deep Dive

### ClientOAuth2 Class

The main OAuth2 client handles:
- Multiple OAuth2 flows (code, credentials, PKCE)
- Token creation and management
- HTTP request signing
- SSL certificate handling (for development)

### OAuth2 Token Management

- Automatic token refresh when expired
- Secure token storage with encryption
- Support for different token types (Bearer, MAC, etc.)
- Error handling and token validation

### Security Features

- CSRF protection using state parameters
- PKCE support for enhanced security
- Encrypted credential storage
- SSL/TLS verification (can be disabled for dev)

## Adding New OAuth2 Integrations

To add a new OAuth2 integration (e.g., Exact Online):

1. **Create credential file**: `ExactOnlineOAuth2Api.credentials.ts`
2. **Configure OAuth2 endpoints**: Authorization URL, Token URL, Scopes
3. **Define credential properties**: Hide/show relevant fields
4. **Test OAuth2 flow**: Verify authorization and token exchange
5. **Implement node**: Create node that uses the credential
6. **Add to constants**: If editable scopes needed

## Dependencies and Libraries

- **axios**: HTTP client for OAuth2 requests
- **querystring**: URL encoding for OAuth2 parameters
- **crypto**: For PKCE challenge generation and CSRF tokens
- **pkce-challenge**: PKCE code generation
- **n8n-workflow**: Core workflow types and interfaces

## Error Handling

The OAuth2 system handles:
- Network timeouts and connection errors
- Invalid credentials and authentication failures
- Token expiration and automatic refresh
- Provider-specific error responses
- CSRF token validation failures

## Testing and Validation

OAuth2 integrations are tested through:
- Unit tests for individual components
- Integration tests for complete OAuth2 flows
- End-to-end tests with real OAuth2 providers
- Manual testing with actual credentials

This architecture provides a robust, secure, and extensible foundation for OAuth2 integrations in n8n, supporting over 50 different services with a consistent implementation pattern.