# Complete OAuth2 File Reference for n8n

This document provides an exhaustive list of all files involved in n8n's OAuth2 system, their purposes, and how they interact.

## Core OAuth2 Infrastructure (8 Key Areas)

### 1. OAuth2 Client Library - `/packages/@n8n/client-oauth2/`

```
@n8n/client-oauth2/
├── src/
│   ├── ClientOAuth2.ts          # Main OAuth2 client class
│   ├── ClientOAuth2Token.ts     # Token management & refresh
│   ├── CodeFlow.ts              # Authorization code flow
│   ├── CredentialsFlow.ts       # Client credentials flow  
│   ├── types.ts                 # TypeScript definitions
│   ├── utils.ts                 # OAuth2 utility functions
│   ├── constants.ts             # OAuth2 constants
│   └── index.ts                 # Package exports
├── test/                        # Unit tests
├── package.json                 # Package configuration
├── tsconfig.json               # TypeScript config
└── jest.config.js              # Test configuration
```

**Purpose**: Custom OAuth2 client implementation handling all OAuth2 flows, token management, and HTTP request signing.

### 2. Base Credentials - `/packages/nodes-base/credentials/`

**Base OAuth2 Template:**
- `OAuth2Api.credentials.ts` - Generic OAuth2 credential with all standard fields

**92 Service-Specific OAuth2 Credentials:**
```
ActiveCampaignOAuth2Api.credentials.ts    GitlabOAuth2Api.credentials.ts
AcuitySchedulingOAuth2Api.credentials.ts  GmailOAuth2Api.credentials.ts
AirtableOAuth2Api.credentials.ts          GoToWebinarOAuth2Api.credentials.ts
AsanaOAuth2Api.credentials.ts             GongOAuth2Api.credentials.ts
Auth0ManagementOAuth2Api.credentials.ts   GoogleAdsOAuth2Api.credentials.ts
BitlyOAuth2Api.credentials.ts             GoogleAnalyticsOAuth2Api.credentials.ts
BoxOAuth2Api.credentials.ts               GoogleBigQueryOAuth2Api.credentials.ts
CalendlyOAuth2Api.credentials.ts          GoogleBooksOAuth2Api.credentials.ts
CiscoWebexOAuth2Api.credentials.ts        GoogleBusinessProfileOAuth2Api.credentials.ts
ClickUpOAuth2Api.credentials.ts           GoogleCalendarOAuth2Api.credentials.ts
CrowdStrikeOAuth2Api.credentials.ts       GoogleCloudNaturalLanguageOAuth2Api.credentials.ts
DiscordOAuth2Api.credentials.ts           GoogleCloudStorageOAuth2Api.credentials.ts
DriftOAuth2Api.credentials.ts             GoogleContactsOAuth2Api.credentials.ts
DropboxOAuth2Api.credentials.ts           GoogleDocsOAuth2Api.credentials.ts
EventbriteOAuth2Api.credentials.ts        GoogleDriveOAuth2Api.credentials.ts
FacebookLeadAdsOAuth2Api.credentials.ts   GoogleFirebaseCloudFirestoreOAuth2Api.credentials.ts
FormstackOAuth2Api.credentials.ts         GoogleFirebaseRealtimeDatabaseOAuth2Api.credentials.ts
GithubOAuth2Api.credentials.ts            GoogleOAuth2Api.credentials.ts
GSuiteAdminOAuth2Api.credentials.ts       GooglePerspectiveOAuth2Api.credentials.ts
GetResponseOAuth2Api.credentials.ts       GoogleSheetsOAuth2Api.credentials.ts
GitlabOAuth2Api.credentials.ts            GoogleSheetsTriggerOAuth2Api.credentials.ts
GmailOAuth2Api.credentials.ts             GoogleSlidesOAuth2Api.credentials.ts
GongOAuth2Api.credentials.ts              GoogleTasksOAuth2Api.credentials.ts
GoToWebinarOAuth2Api.credentials.ts       GoogleTranslateOAuth2Api.credentials.ts
HarvestOAuth2Api.credentials.ts           HelpScoutOAuth2Api.credentials.ts
HighLevelOAuth2Api.credentials.ts         HubspotOAuth2Api.credentials.ts
KeapOAuth2Api.credentials.ts              LineNotifyOAuth2Api.credentials.ts
LinearOAuth2Api.credentials.ts            LinkedInCommunityManagementOAuth2Api.credentials.ts
LinkedInOAuth2Api.credentials.ts          MailchimpOAuth2Api.credentials.ts
MauticOAuth2Api.credentials.ts            MediumOAuth2Api.credentials.ts
MicrosoftDynamicsOAuth2Api.credentials.ts MicrosoftEntraOAuth2Api.credentials.ts
MicrosoftExcelOAuth2Api.credentials.ts    MicrosoftGraphSecurityOAuth2Api.credentials.ts
MicrosoftOAuth2Api.credentials.ts         MicrosoftOneDriveOAuth2Api.credentials.ts
MicrosoftOutlookOAuth2Api.credentials.ts  MicrosoftTeamsOAuth2Api.credentials.ts
MicrosoftToDoOAuth2Api.credentials.ts     MondayComOAuth2Api.credentials.ts
NextCloudOAuth2Api.credentials.ts         NotionOAuth2Api.credentials.ts
PagerDutyOAuth2Api.credentials.ts         PhilipsHueOAuth2Api.credentials.ts
PipedriveOAuth2Api.credentials.ts         PushbulletOAuth2Api.credentials.ts
QuickBooksOAuth2Api.credentials.ts        RaindropOAuth2Api.credentials.ts
RedditOAuth2Api.credentials.ts            SalesforceOAuth2Api.credentials.ts
SentryIoOAuth2Api.credentials.ts          ServiceNowOAuth2Api.credentials.ts
ShopifyOAuth2Api.credentials.ts           SlackOAuth2Api.credentials.ts
SpotifyOAuth2Api.credentials.ts           StravaOAuth2Api.credentials.ts
SurveyMonkeyOAuth2Api.credentials.ts      TodoistOAuth2Api.credentials.ts
TwistOAuth2Api.credentials.ts             TwitterOAuth2Api.credentials.ts
TypeformOAuth2Api.credentials.ts          WebflowOAuth2Api.credentials.ts
XeroOAuth2Api.credentials.ts              YouTubeOAuth2Api.credentials.ts
ZendeskOAuth2Api.credentials.ts           ZohoOAuth2Api.credentials.ts
ZoomOAuth2Api.credentials.ts
```

### 3. OAuth2 HTTP Controllers - `/packages/cli/src/controllers/oauth/`

```
oauth/
├── abstract-oauth.controller.ts          # Base OAuth functionality
├── oauth2-credential.controller.ts       # OAuth2 route handlers
├── oauth1-credential.controller.ts       # OAuth1 legacy support
└── __tests__/                           # Controller tests
    ├── oauth1-credential.controller.test.ts
    └── oauth2-credential.controller.test.ts
```

**Routes Handled:**
- `GET /oauth2-credential/auth` - Start OAuth2 flow
- `GET /oauth2-credential/callback` - Handle provider callback

### 4. Node Execution Engine - `/packages/core/src/`

```
core/src/
└── NodeExecuteFunctions.ts              # OAuth2 request execution
    ├── requestOAuth2()                  # Main OAuth2 request function
    ├── requestWithAuthentication()     # Authentication wrapper
    └── Token refresh logic             # Automatic token renewal
```

### 5. Configuration & Constants - `/packages/cli/src/`

```
cli/src/
├── constants.ts                         # OAuth2 constants
│   ├── GENERIC_OAUTH2_CREDENTIALS_WITH_EDITABLE_SCOPE
│   ├── OAUTH2_CREDENTIAL_TEST_SUCCEEDED
│   └── OAUTH2_CREDENTIAL_TEST_FAILED
└── services/
    └── jwt.service.ts                   # JWT handling for tokens
```

### 6. OAuth2 Templates - `/packages/cli/templates/`

```
templates/
├── oauth-callback.handlebars            # Success callback page
└── oauth-error-callback.handlebars      # Error callback page
```

### 7. Testing Infrastructure

```
# Integration Tests
packages/cli/test/integration/controllers/oauth/
└── oauth2.api.test.ts                   # OAuth2 API tests

# End-to-End Tests  
cypress/e2e/
└── 43-oauth-flow.cy.ts                  # OAuth2 flow tests

# Unit Tests
packages/@n8n/client-oauth2/test/        # OAuth2 client tests
packages/cli/src/controllers/oauth/__tests__/  # Controller tests
```

### 8. Supporting Files

```
# Type Definitions
packages/workflow/src/
├── Interfaces.ts                        # OAuth2 interfaces
└── WorkflowDataProxy.ts                # OAuth2 data handling

# Build Configuration
packages/@n8n/client-oauth2/
├── tsconfig.json                       # TypeScript config
├── tsconfig.build.json                 # Build config
└── jest.config.js                     # Test config
```

## OAuth2 Data Flow

```
1. User Interface → OAuth2 Credential Configuration
2. Credential Config → abstract-oauth.controller.ts
3. OAuth Controller → oauth2-credential.controller.ts
4. OAuth2 Controller → @n8n/client-oauth2 (ClientOAuth2)
5. Client OAuth2 → External OAuth2 Provider
6. Provider Callback → oauth2-credential.controller.ts
7. Token Storage → Encrypted Database
8. Node Execution → NodeExecuteFunctions.requestOAuth2()
9. Request OAuth2 → ClientOAuth2Token.sign()
10. Signed Request → External API
```

## File Modification Checklist

When adding a new OAuth2 integration:

**Required Files to Create/Modify:**
1. ✅ `YourServiceOAuth2Api.credentials.ts` - Credential configuration
2. ✅ Service icon in `packages/nodes-base/credentials/icons/`
3. ✅ Node implementation files using the credential
4. ✅ Tests for the new credential
5. ✅ Documentation updates

**Optional Files to Modify:**
1. ✅ `/packages/cli/src/constants.ts` - If editable scopes needed
2. ✅ Integration tests
3. ✅ End-to-end tests

## OAuth2 Security Architecture

**Encryption & Storage:**
- All tokens encrypted before database storage
- Uses n8n's credential encryption system
- JWT service handles token signing/validation

**CSRF Protection:**
- State parameter generated per authorization request  
- Validated in callback handler
- Prevents cross-site request forgery

**Token Lifecycle:**
- Automatic expiration detection
- Background refresh mechanisms
- Secure token transmission over HTTPS

## OAuth2 Error Handling Flow

```
Error Sources:
├── Network Errors (axios in ClientOAuth2)
├── OAuth2 Provider Errors (utils.ts:getAuthError())
├── Token Expiration (ClientOAuth2Token.expired())
├── Authentication Failures (NodeExecuteFunctions)
└── CSRF Validation (oauth2-credential.controller.ts)

Error Handlers:
├── ClientOAuth2.request() - Network/HTTP errors
├── ClientOAuth2Token.refresh() - Token refresh errors  
├── requestOAuth2() - Authentication errors
└── oauth2-credential.controller.ts - Flow errors
```

## Summary

n8n's OAuth2 system involves **approximately 120+ files** across 8 major areas:

1. **Core Library**: 8 files in `@n8n/client-oauth2`
2. **Credentials**: 93 files (1 base + 92 service-specific)  
3. **Controllers**: 3 main files + tests
4. **Execution**: 1 main file (`NodeExecuteFunctions.ts`)
5. **Configuration**: 2 files (`constants.ts`, `jwt.service.ts`)
6. **Templates**: 2 files (callback pages)
7. **Testing**: 10+ test files
8. **Supporting**: 5+ configuration/type files

This architecture provides a robust, secure, and highly extensible OAuth2 foundation supporting 92 different services with consistent patterns and automated token management.