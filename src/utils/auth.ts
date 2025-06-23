export const OAUTH_CONFIG = {
  google: {
    clientId: import.meta.env.VITE_GOOGLE_CLIENT_ID,
    redirectUri: import.meta.env.VITE_REDIRECT_URI,
    scope: 'openid email profile',
  },
  discord: {
    clientId: import.meta.env.VITE_DISCORD_CLIENT_ID,
    redirectUri: import.meta.env.VITE_REDIRECT_URI,
    scope: 'identify email',
  },
};

export const generateGoogleAuthUrl = () => {
  const params = new URLSearchParams({
    client_id: OAUTH_CONFIG.google.clientId,
    redirect_uri: OAUTH_CONFIG.google.redirectUri,
    response_type: 'code',
    scope: OAUTH_CONFIG.google.scope,
    access_type: 'offline',
    prompt: 'consent',
  });
  
  return `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
};

export const generateDiscordAuthUrl = () => {
  const params = new URLSearchParams({
    client_id: OAUTH_CONFIG.discord.clientId,
    redirect_uri: OAUTH_CONFIG.discord.redirectUri,
    response_type: 'code',
    scope: OAUTH_CONFIG.discord.scope,
  });
  
  return `https://discord.com/api/oauth2/authorize?${params.toString()}`;
};