/**
 * Centralized constants for the VSCode Proxy Manager extension.
 * Eliminates magic strings and provides a single source of truth.
 */

// ---------------------------------------------------------------------------
// Command identifiers
// ---------------------------------------------------------------------------

/** Command ID registered by the extension to show the proxy quick pick list. */
export const COMMAND_SHOW_PROXY_LIST = 'vscode-proxy-manager.showProxyList';

/** Command ID to open settings at the proxy list configuration. */
export const COMMAND_ADD_PROXY = 'vscode-proxy-manager.addProxy';

// ---------------------------------------------------------------------------
// Configuration keys
// ---------------------------------------------------------------------------

/** VS Code built-in setting for the global HTTP proxy URL. */
export const CONFIG_HTTP_PROXY = 'http.proxy';

/** Extension-specific setting that holds the list of available proxies. */
export const CONFIG_PROXY_LIST = 'vscode-proxy-manager.proxyList';

// ---------------------------------------------------------------------------
// Status bar
// ---------------------------------------------------------------------------

/** Priority value for the proxy status bar item (higher = further left). */
export const STATUS_BAR_PRIORITY = -1_000_000;

/** Codicon and label shown when no proxy is active. */
export const STATUS_BAR_TEXT_NO_PROXY = '$(debug-disconnect) No Proxy';

/** Codicon and label shown when a proxy is active. */
export const STATUS_BAR_TEXT_ACTIVE_PROXY = '$(plug) Proxy';

/** Tooltip shown when no proxy is configured. */
export const STATUS_BAR_TOOLTIP_NO_PROXY = 'Select Proxy from list';

// ---------------------------------------------------------------------------
// Quick pick options
// ---------------------------------------------------------------------------

/** Label for the option that disables the proxy. */
export const OPTION_LABEL_NONE = 'None';

/** Description for the option that disables the proxy. */
export const OPTION_DESCRIPTION_NONE = 'Disable proxy';

// ---------------------------------------------------------------------------
// About
// ---------------------------------------------------------------------------

/** Label for the About option in the quick pick menu. */
export const OPTION_LABEL_ABOUT = 'About';

/** Description for the About option. */
export const OPTION_DESCRIPTION_ABOUT = 'Meet the author ♥';

/** Special value marker for the About option. */
export const OPTION_VALUE_ABOUT = '__ABOUT__';

/** URL to open when the About option is selected. */
export const PORTFOLIO_URL = 'https://jesus-alvarez-portfolio.web.app/';
