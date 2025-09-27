# OAuth2 Integration Implementation Guide for n8n

## Complete File Analysis

This guide provides a detailed walkthrough of implementing OAuth2 integrations in n8n, including all files involved and their specific roles in the OAuth2 ecosystem.

## All Files Involved in OAuth2 Integration

### 1. Core OAuth2 Client Library (`@n8n/client-oauth2`)

**`/packages/@n8n/client-oauth2/src/ClientOAuth2.ts`**
- **Role**: Main OAuth2 client class
- **Key Methods**:
  - `constructor()` - Initialize OAuth2 client with options
  - `createToken()` - Create token from OAuth2 response data
  - `request()` - Make authenticated HTTP requests
  - `parseResponseBody()` - Parse OAuth2 response (JSON/query string)

**`/packages/@n8n/client-oauth2/src/ClientOAuth2Token.ts`**
- **Role**: Token management and lifecycle
- **Key Methods**:
  - `constructor()` - Initialize token with data and expiration
  - `sign()` - Add OAuth2 authentication to requests
  - `refresh()` - Automatically refresh expired tokens
  - `expired()` - Check if token needs refresh

**`/packages/@n8n/client-oauth2/src/CodeFlow.ts`**
- **Role**: Authorization Code flow implementation
- **Key Methods**:
  - `getAuthorizationUri()` - Generate authorization URL
  - `getToken()` - Exchange authorization code for access token

**`/packages/@n8n/client-oauth2/src/CredentialsFlow.ts`**
- **Role**: Client Credentials flow implementation
- **Key Methods**:
  - `getToken()` - Request token using client credentials

**`/packages/@n8n/client-oauth2/src/types.ts`**
- **Role**: TypeScript type definitions
- **Key Types**:
  - `OAuth2CredentialData` - Credential configuration structure
  - `OAuth2GrantType` - Supported grant types (pkce, authorizationCode, clientCredentials)
  - `Headers` - HTTP header type definitions

**`/packages/@n8n/client-oauth2/src/utils.ts`**
- **Role**: OAuth2 utility functions
- **Key Functions**:
  - `auth()` - Generate Basic Auth header
  - `expects()` - Parameter validation
  - `getAuthError()` - Parse OAuth2 error responses

### 2. Credential System Files

**`/packages/nodes-base/credentials/OAuth2Api.credentials.ts`**
- **Role**: Base OAuth2 credential template
- **Properties**:
  - Grant type selection (Authorization Code, Client Credentials, PKCE)
  - Authorization URL configuration
  - Access Token URL configuration
  - Client ID/Secret fields
  - Scope configuration
  - Authentication method (Header/Body)
  - SSL settings

**Service-Specific Credential Examples:**
- `GoogleOAuth2Api.credentials.ts` - Google services
- `FacebookLeadAdsOAuth2Api.credentials.ts` - Facebook Lead Ads
- `GitlabOAuth2Api.credentials.ts` - GitLab integration
- `MicrosoftOAuth2Api.credentials.ts` - Microsoft services
- `SlackOAuth2Api.credentials.ts` - Slack integration

### 3. OAuth2 HTTP Endpoints

**`/packages/cli/src/controllers/oauth/abstract-oauth.controller.ts`**
- **Role**: Base OAuth controller with common functionality
- **Key Methods**:
  - `getCredential()` - Retrieve credential from database
  - `createCsrfState()` - Generate CSRF protection tokens
  - `getAdditionalData()` - Get workflow execution context

**`/packages/cli/src/controllers/oauth/oauth2-credential.controller.ts`**
- **Role**: OAuth2-specific HTTP request handlers
- **Routes**:
  - `GET /oauth2-credential/auth` - Initialize OAuth2 authorization flow
  - `GET /oauth2-credential/callback` - Handle OAuth2 provider callback
- **Key Methods**:
  - `getAuthUri()` - Generate and return authorization URL
  - `handleCallback()` - Process OAuth2 callback and store tokens

### 4. Node Execution Functions

**`/packages/core/src/NodeExecuteFunctions.ts`**
- **Role**: OAuth2 request execution and token management
- **Key Functions**:
  - `requestOAuth2()` - Main function for OAuth2-authenticated requests
  - `requestWithAuthentication()` - Generic authentication wrapper
- **Token Management**:
  - Automatic token refresh on expiration
  - Error handling and retry logic
  - Support for different grant types

### 5. Constants and Configuration

**`/packages/cli/src/constants.ts`**
- **Key Constants**:
  - `GENERIC_OAUTH2_CREDENTIALS_WITH_EDITABLE_SCOPE` - Credentials allowing user-defined scopes
  - `OAUTH2_CREDENTIAL_TEST_SUCCEEDED/FAILED` - Test result messages

### 6. Templates and UI

**`/packages/cli/templates/oauth-callback.handlebars`**
- **Role**: Success callback page template
- **Content**: User-friendly success message after OAuth2 authorization

**`/packages/cli/templates/oauth-error-callback.handlebars`**
- **Role**: Error callback page template  
- **Content**: Error messages and troubleshooting guidance

## Step-by-Step Implementation Process

### Step 1: Create Service-Specific Credential File

Create `/packages/nodes-base/credentials/YourServiceOAuth2Api.credentials.ts`:

```typescript
import type { ICredentialType, INodeProperties } from 'n8n-workflow';

export class YourServiceOAuth2Api implements ICredentialType {
    name = 'yourServiceOAuth2Api';
    extends = ['oAuth2Api'];
    displayName = 'Your Service OAuth2 API';
    documentationUrl = 'yourservice';
    icon = 'file:icons/YourService.svg'; // Optional
    
    properties: INodeProperties[] = [
        {
            displayName: 'Grant Type',
            name: 'grantType',
            type: 'hidden',
            default: 'authorizationCode', // or 'clientCredentials'
        },
        {
            displayName: 'Authorization URL',
            name: 'authUrl',
            type: 'hidden',
            default: 'https://yourservice.com/oauth/authorize',
            required: true,
        },
        {
            displayName: 'Access Token URL',
            name: 'accessTokenUrl',
            type: 'hidden',
            default: 'https://yourservice.com/oauth/token',
            required: true,
        },
        {
            displayName: 'Scope',
            name: 'scope',
            type: 'hidden',
            default: 'read write',
        },
        {
            displayName: 'Auth URI Query Parameters',
            name: 'authQueryParameters',
            type: 'hidden',
            default: 'access_type=offline',
        },
        {
            displayName: 'Authentication',
            name: 'authentication',
            type: 'hidden',
            default: 'header', // or 'body'
        },
    ];
}
```

### Step 2: Add to Constants (if needed)

If your service requires user-editable scopes, add to `/packages/cli/src/constants.ts`:

```typescript
export const GENERIC_OAUTH2_CREDENTIALS_WITH_EDITABLE_SCOPE = [
    'oAuth2Api',
    'googleOAuth2Api',
    'microsoftOAuth2Api',
    'highLevelOAuth2Api',
    'yourServiceOAuth2Api', // Add your service here
];
```

### Step 3: Implement Node Using OAuth2

Create your node and use OAuth2 authentication:

```typescript
import type { INodeExecutionData, IExecuteFunctions } from 'n8n-workflow';

export class YourServiceNode implements INodeType {
    description: INodeTypeDescription = {
        // Node configuration
        credentials: [
            {
                name: 'yourServiceOAuth2Api',
                required: true,
            },
        ],
    };
    
    async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
        const requestOptions = {
            method: 'GET',
            url: 'https://api.yourservice.com/endpoint',
            json: true,
        };
        
        // This automatically handles OAuth2 authentication and token refresh
        const responseData = await this.helpers.requestOAuth2.call(
            this,
            'yourServiceOAuth2Api',
            requestOptions,
            { tokenType: 'Bearer' }
        );
        
        return [this.helpers.returnJsonArray(responseData)];
    }
}
```

## OAuth2 Flow Logic Deep Dive

### Authorization Code Flow (Most Common)

1. **Initialization** (`oauth2-credential.controller.ts:getAuthUri()`)
   - User clicks "Connect" in n8n UI
   - System retrieves credential configuration
   - Generates CSRF state token for security
   - Creates OAuth2 client with service endpoints
   - Constructs authorization URL with parameters

2. **Authorization** (External Provider)
   - User redirected to OAuth2 provider
   - User grants permissions to application
   - Provider redirects to n8n callback URL

3. **Callback Processing** (`oauth2-credential.controller.ts:handleCallback()`)
   - n8n receives authorization code
   - Validates CSRF state token
   - Exchanges authorization code for access token
   - Stores encrypted tokens in database

4. **Request Execution** (`NodeExecuteFunctions.ts:requestOAuth2()`)
   - Node execution triggers OAuth2 request
   - System retrieves stored tokens
   - Signs HTTP request with access token
   - Handles token refresh if expired

### Client Credentials Flow

1. **Direct Token Request**
   - No user interaction required
   - Application requests token using client ID/secret
   - Used for server-to-server communication

2. **Token Management**
   - Tokens automatically refreshed when expired
   - No authorization code exchange needed

### PKCE Flow (Enhanced Security)

1. **Code Challenge Generation**
   - System generates random code verifier
   - Creates SHA256 code challenge
   - Includes challenge in authorization URL

2. **Code Verification**
   - Provider validates code challenge
   - Prevents authorization code interception

## Testing OAuth2 Integrations

### Unit Tests
- Test credential configuration parsing
- Validate OAuth2 flow methods
- Mock external OAuth2 providers

### Integration Tests  
- Test complete OAuth2 flows
- Validate token refresh mechanisms
- Test error handling scenarios

### Manual Testing
1. Create test OAuth2 application with provider
2. Configure credentials in n8n
3. Test authorization flow
4. Verify token refresh
5. Test API calls with stored tokens

## Security Considerations

### CSRF Protection
- State parameter prevents cross-site request forgery
- Unique state generated per authorization request
- State validated in callback handler

### Token Security
- All tokens encrypted before database storage
- Automatic token expiration handling
- Secure token transmission over HTTPS

### SSL/TLS Verification
- Production environments require valid certificates
- Development mode can disable SSL checks
- Configurable per credential

## Troubleshooting Common Issues

### Invalid Redirect URI
- Ensure callback URL matches OAuth2 app configuration
- Format: `https://your-n8n.com/rest/oauth2-credential/callback`

### Token Refresh Failures
- Check if provider supports refresh tokens
- Verify client credentials are correct
- Review scope requirements

### Authentication Method Issues
- Some providers require 'body' authentication
- Others require 'header' authentication
- Check provider documentation

This comprehensive guide covers all aspects of OAuth2 integration in n8n, from the underlying architecture to practical implementation steps.