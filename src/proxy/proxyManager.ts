import {
    ConfigurationTarget,
    StatusBarItem,
    workspace,
    window,
    env,
    Uri,
    QuickPickItem,
    QuickPickItemKind,
} from 'vscode';
import { getFormattedProxyOptions } from './proxyUtils';
import {
    CONFIG_HTTP_PROXY,
    STATUS_BAR_TEXT_NO_PROXY,
    STATUS_BAR_TEXT_ACTIVE_PROXY,
    STATUS_BAR_TOOLTIP_NO_PROXY,
    COMMAND_SHOW_PROXY_LIST,
    OPTION_VALUE_ABOUT,
    OPTION_LABEL_ABOUT,
    OPTION_DESCRIPTION_ABOUT,
    PORTFOLIO_URL,
} from './constants';

// ---------------------------------------------------------------------------
// Status bar helpers (exported for testing)
// ---------------------------------------------------------------------------

/**
 * Updates the status bar item to reflect the current proxy state.
 *
 * @param statusBar - The status bar item to update.
 * @param proxyUrl  - The active proxy URL, or empty string if disabled.
 */
export function updateStatusBarForProxy(statusBar: StatusBarItem, proxyUrl: string): void {
    const hasProxy = proxyUrl !== '';

    statusBar.text = hasProxy ? STATUS_BAR_TEXT_ACTIVE_PROXY : STATUS_BAR_TEXT_NO_PROXY;
    statusBar.tooltip = hasProxy ? `Current Proxy: ${proxyUrl}` : STATUS_BAR_TOOLTIP_NO_PROXY;
}

/**
 * Applies the selected proxy to VS Code settings and updates the status bar.
 *
 * @param statusBar  - The status bar item to update.
 * @param proxyUrl   - The proxy URL to apply (empty string to disable).
 * @param proxyLabel - Display label used in notification messages.
 */
export async function applyProxy(
    statusBar: StatusBarItem,
    proxyUrl: string,
    proxyLabel: string,
): Promise<void> {
    await workspace
        .getConfiguration()
        .update(CONFIG_HTTP_PROXY, proxyUrl, ConfigurationTarget.Global);

    updateStatusBarForProxy(statusBar, proxyUrl);

    if (proxyUrl === '') {
        window.showInformationMessage('Proxy disabled.');
    } else {
        window.showInformationMessage(`Proxy configured: ${proxyLabel}.`);
    }
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * Shows the quick pick menu with all configured proxies and applies
 * the user's selection to the VS Code global HTTP proxy setting.
 *
 * @param statusBar - The status bar item to update after selection.
 */
export async function showProxyList(statusBar: StatusBarItem): Promise<void> {
    const proxyOptions = await getFormattedProxyOptions();

    const quickPickItems: QuickPickItem[] = [
        ...proxyOptions,
        { label: '', kind: QuickPickItemKind.Separator },
        {
            label: OPTION_LABEL_ABOUT,
            description: OPTION_DESCRIPTION_ABOUT,
            value: OPTION_VALUE_ABOUT,
        },
    ];

    const selectedOption = await window.showQuickPick(quickPickItems, {
        placeHolder: 'Select Proxy from list',
    });

    if (!selectedOption) {
        window.showInformationMessage('No proxy selected.');
        return;
    }

    const optionValue = (selectedOption as QuickPickItem & { value?: string }).value;

    if (optionValue === OPTION_VALUE_ABOUT) {
        await env.openExternal(Uri.parse(PORTFOLIO_URL));
        return;
    }

    if (optionValue !== undefined) {
        try {
            await applyProxy(statusBar, optionValue, selectedOption.label);
        } catch (error) {
            window.showErrorMessage(`Error configuring proxy: ${error}.`);
        }
    }
}

/**
 * Initializes the proxy status bar item based on the current VS Code
 * proxy configuration.
 *
 * Reads the `http.proxy` setting and configures the item with the
 * appropriate icon, tooltip, and click command.
 *
 * @param statusBar - The status bar item to configure.
 */
export function setUpProxyStatusBar(statusBar: StatusBarItem): void {
    const currentProxy = workspace.getConfiguration().get<string>(CONFIG_HTTP_PROXY) ?? '';

    updateStatusBarForProxy(statusBar, currentProxy);

    statusBar.command = COMMAND_SHOW_PROXY_LIST;
    statusBar.show();
}
