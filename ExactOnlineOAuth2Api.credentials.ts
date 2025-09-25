import type { ICredentialType, INodeProperties } from 'n8n-workflow';

/**
 * Exact Online OAuth2 API Credentials
 * 
 * This credentials class provides OAuth2 integration for Exact Online,
 * following n8n's standard OAuth2 implementation pattern.
 * 
 * Exact Online OAuth2 Documentation:
 * - Authorization Endpoint: https://start.exactonline.nl/api/oauth2/auth
 * - Token Endpoint: https://start.exactonline.nl/api/oauth2/token
 * - API Base URL: https://start.exactonline.nl/api/v1/{division}/
 * 
 * Required OAuth2 Configuration in Exact Online:
 * 1. Register your application in Exact Online Developer Portal
 * 2. Set redirect URI to: https://your-n8n-instance.com/rest/oauth2-credential/callback
 * 3. Note down Client ID and Client Secret
 * 4. Configure required scopes based on your needs
 * 
 * Common Scopes:
 * - read: Read access to all data
 * - write: Write access to all data
 * - full: Full access (read + write + delete)
 */
export class ExactOnlineOAuth2Api implements ICredentialType {
	name = 'exactOnlineOAuth2Api';

	extends = ['oAuth2Api'];

	displayName = 'Exact Online OAuth2 API';

	documentationUrl = 'exactonline';

	icon = 'file:icons/ExactOnline.svg';

	properties: INodeProperties[] = [
		{
			displayName: 'Grant Type',
			name: 'grantType',
			type: 'hidden',
			default: 'authorizationCode',
		},
		{
			displayName: 'Authorization URL',
			name: 'authUrl',
			type: 'hidden',
			default: 'https://start.exactonline.nl/api/oauth2/auth',
			required: true,
		},
		{
			displayName: 'Access Token URL',
			name: 'accessTokenUrl',
			type: 'hidden',
			default: 'https://start.exactonline.nl/api/oauth2/token',
			required: true,
		},
		{
			displayName: 'Scope',
			name: 'scope',
			type: 'hidden',
			default: 'read',
			description: 'Default scope is read-only access. Contact your Exact Online administrator for additional permissions.',
		},
		{
			displayName: 'Auth URI Query Parameters',
			name: 'authQueryParameters',
			type: 'hidden',
			default: 'response_type=code&force_login=0',
			description: 'Additional parameters for Exact Online OAuth2 flow',
		},
		{
			displayName: 'Authentication',
			name: 'authentication',
			type: 'hidden',
			default: 'body',
			description: 'Exact Online requires credentials in request body',
		},
		{
			displayName: 'Base URL',
			name: 'baseUrl',
			type: 'hidden',
			default: 'https://start.exactonline.nl/api/v1',
			description: 'Base URL for Exact Online API calls',
		},
	];
}