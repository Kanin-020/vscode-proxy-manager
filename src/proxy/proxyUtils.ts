import { workspace } from 'vscode';
import { CONFIG_PROXY_LIST, OPTION_LABEL_NONE, OPTION_DESCRIPTION_NONE } from './constants';

/**
 * Supported proxy protocol types displayed in the quick pick menu.
 */
type ProxyProtocol = 'HTTP' | 'HTTPS' | 'Unknown';

/**
 * Represents a proxy option displayed in the VS Code quick pick menu.
 */
export interface ProxyOption {
    /** Display label for the proxy (typically the proxy URL). */
    label: string;
    /** Protocol type description (HTTP, HTTPS, or Unknown). */
    description: ProxyProtocol | string;
    /** The actual proxy URL value to apply to VS Code settings. */
    value: string;
}

/**
 * Detects the protocol of a proxy URL string.
 *
 * @param proxyUrl - The proxy URL to classify.
 * @returns The detected protocol type.
 *
 * @example
 * ```ts
 * detectProtocol('http://proxy:8080');  // 'HTTP'
 * detectProtocol('https://proxy:443');  // 'HTTPS'
 * detectProtocol('socks5://localhost'); // 'Unknown'
 * ```
 */
export function detectProtocol(proxyUrl: string): ProxyProtocol {
    const lowercasedUrl = proxyUrl.toLowerCase();

    if (lowercasedUrl.startsWith('https://')) {
        return 'HTTPS';
    }
    if (lowercasedUrl.startsWith('http://')) {
        return 'HTTP';
    }
    return 'Unknown';
}

/**
 * Obscures credentials in a proxy URL for safe display in the UI.
 *
 * Replaces the userinfo portion (`user:pass@` or `user@`) with `***:***@` or `***@`.
 * URLs without credentials are returned unchanged.
 *
 * @param proxyUrl - The proxy URL potentially containing credentials.
 * @returns The URL with credentials masked.
 *
 * @example
 * ```ts
 * maskProxyUrl('http://user:pass@proxy:8080');  // 'http://***:***@proxy:8080'
 * maskProxyUrl('http://user@proxy:8080');       // 'http://***@proxy:8080'
 * maskProxyUrl('http://proxy:8080');            // 'http://proxy:8080'
 * ```
 */
export function maskProxyUrl(proxyUrl: string): string {
    // Match: protocol://  userinfo(@)  rest
    // userinfo may be `user:pass` or just `user`
    const match = proxyUrl.match(/^(\w+:\/\/)([^@]+)(@.*)$/);
    if (!match) {
        return proxyUrl;
    }

    const [, protocol, userinfo, rest] = match;
    const maskedUserinfo = userinfo.includes(':') ? '***:***' : '***';
    return `${protocol}${maskedUserinfo}${rest}`;
}

/**
 * Reads the configured proxy list from VS Code settings and formats
 * each entry into a {@link ProxyOption} for display in quick pick menus.
 *
 * Appends a "None" option at the end to allow disabling the proxy.
 *
 * @returns A formatted array of proxy options ready for quick pick display.
 *
 * @example
 * ```ts
 * const options = await getFormattedProxyOptions();
 * // [
 * //   { label: "http://proxy:8080", description: "HTTP", value: "http://proxy:8080" },
 * //   { label: "None", description: "Disable proxy", value: "" }
 * // ]
 * ```
 */
export async function getFormattedProxyOptions(): Promise<ProxyOption[]> {
    const rawProxyList = workspace.getConfiguration().get<string[]>(CONFIG_PROXY_LIST) ?? [];

    const formattedOptions: ProxyOption[] = rawProxyList.map((proxyUrl) => ({
        label: maskProxyUrl(proxyUrl),
        description: detectProtocol(proxyUrl),
        value: proxyUrl,
    }));

    formattedOptions.push({
        label: OPTION_LABEL_NONE,
        description: OPTION_DESCRIPTION_NONE,
        value: '',
    });

    return formattedOptions;
}
