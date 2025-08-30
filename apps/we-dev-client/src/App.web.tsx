import React, { useState } from 'react';

function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  const tabs = [
    { id: 'home', label: 'Home', icon: '🏠' },
    { id: 'features', label: 'Features', icon: '✨' },
    { id: 'download', label: 'Download', icon: '📥' },
    { id: 'about', label: 'About', icon: 'ℹ️' }
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return (
          <div className="text-center space-y-6">
            <div className="w-24 h-24 bg-gradient-to-br from-purple-600 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
              <span className="text-white text-4xl font-bold">WD</span>
            </div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              We Dev
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              AI-powered code generation and development tool. Build, debug, and deploy faster with intelligent assistance.
            </p>
            <div className="flex justify-center space-x-4">
              <button 
                onClick={() => setActiveTab('features')}
                className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
              >
                Explore Features
              </button>
              <button 
                onClick={() => setActiveTab('download')}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
              >
                Download Desktop
              </button>
            </div>
          </div>
        );

      case 'features':
        return (
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-8">
              Features
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
                <div className="text-3xl mb-3">🤖</div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">AI Code Generation</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Generate code snippets, functions, and complete applications using advanced AI models.
                </p>
              </div>
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
                <div className="text-3xl mb-3">💻</div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Integrated IDE</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Full-featured code editor with syntax highlighting, autocomplete, and debugging tools.
                </p>
              </div>
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
                <div className="text-3xl mb-3">🔧</div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Project Management</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Organize and manage your projects with built-in file system and version control.
                </p>
              </div>
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
                <div className="text-3xl mb-3">🚀</div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Deployment Tools</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Deploy your applications directly from the IDE to various platforms.
                </p>
              </div>
            </div>
          </div>
        );

      case 'download':
        return (
          <div className="text-center space-y-6">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
              Download Desktop Version
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto mb-8">
              Get the full We Dev experience with all features including the integrated IDE, file management, and advanced development tools.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
                <div className="text-4xl mb-4">🪟</div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Windows</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4">Windows 10/11 (64-bit)</p>
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors">
                  Download
                </button>
              </div>
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
                <div className="text-4xl mb-4">🍎</div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">macOS</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4">macOS 10.15+ (Intel/Apple Silicon)</p>
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors">
                  Download
                </button>
              </div>
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
                <div className="text-4xl mb-4">🐧</div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Linux</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4">Ubuntu 20.04+, Debian 11+</p>
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors">
                  Download
                </button>
              </div>
            </div>
          </div>
        );

      case 'about':
        return (
          <div className="text-center space-y-6">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
              About We Dev
            </h2>
            <div className="max-w-3xl mx-auto space-y-6 text-left">
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Our Mission</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  We Dev aims to revolutionize the way developers work by combining the power of artificial intelligence 
                  with intuitive development tools. Our platform helps developers write better code faster, 
                  debug more effectively, and deploy with confidence.
                </p>
              </div>
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Technology</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Built with modern technologies including React, TypeScript, and Electron. 
                  Our AI models are trained on millions of lines of code to provide intelligent 
                  suggestions and code generation capabilities.
                </p>
              </div>
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Community</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Join our growing community of developers. Share feedback, contribute to the project, 
                  and help shape the future of AI-powered development tools.
                </p>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'
    }`}>
      {/* Header */}
      <header className={`border-b transition-colors duration-300 ${
        isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white text-sm font-bold">WD</span>
              </div>
              <h1 className="text-xl font-bold">We Dev</h1>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={toggleDarkMode}
                className={`p-2 rounded-lg transition-colors ${
                  isDarkMode 
                    ? 'bg-gray-700 hover:bg-gray-600 text-yellow-400' 
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-600'
                }`}
              >
                {isDarkMode ? '☀️' : '🌙'}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <nav className={`border-b transition-colors duration-300 ${
        isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-purple-500 text-purple-600 dark:text-purple-400'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                }`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {renderContent()}
      </main>

      {/* Footer */}
      <footer className={`border-t transition-colors duration-300 ${
        isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center text-gray-500 dark:text-gray-400">
            <p>&copy; 2024 We Dev. All rights reserved.</p>
            <p className="mt-2 text-sm">
              This is the web version. For the full experience, download the desktop application.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;