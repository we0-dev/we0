// Web-compatible version of process utilities
// These functions provide mock implementations for web environments

export function runInstallScript(scriptPath: string): Promise<void> {
    // Mock implementation for web
    console.warn('Install script functionality is not available in web version');
    return Promise.resolve();
}

export async function getBinaryPath(name: string): Promise<string> {
    // Mock implementation for web
    console.warn('Binary path functionality is not available in web version');
    return name;
}

export async function isBinaryExists(name: string): Promise<boolean> {
    // Mock implementation for web
    console.warn('Binary existence check is not available in web version');
    return false;
}