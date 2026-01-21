// Web-specific configuration
export const webConfig = {
  // Application settings
  app: {
    name: 'We Dev',
    version: '1.0.0',
    description: 'AI-powered code generation and development tool',
    baseUrl: 'https://we0.ai',
    downloadUrl: 'https://we0.ai/download',
  },

  // Feature flags for web version
  features: {
    aiChat: true,
    fileEditor: false,
    terminal: false,
    pwa: true,
    darkMode: true,
    userAuth: true,
  },

  // API endpoints
  api: {
    baseUrl: 'https://we0.ai/api',
    chat: 'https://we0.ai/api/chat',
    auth: 'https://we0.ai/api/auth',
    models: 'https://we0.ai/api/models',
    tokens: 'https://we0.ai/api/tokens',
  },

  // UI configuration
  ui: {
    theme: {
      primary: '#7c3aed',
      secondary: '#3b82f6',
      success: '#10b981',
      warning: '#f59e0b',
      error: '#ef4444',
    },
    layout: {
      headerHeight: '64px',
      sidebarWidth: '300px',
      maxContentWidth: '1200px',
    },
  },

  // Web-specific limitations
  limitations: {
    message: 'This is the web version with limited features. Download the desktop app for the full experience.',
    features: [
      'AI Chat (Full functionality)',
      'Code Editor (Limited - Desktop only)',
      'File Management (Desktop only)',
      'Terminal (Desktop only)',
      'WeChat Integration (Desktop only)',
    ],
  },
};

export default webConfig;