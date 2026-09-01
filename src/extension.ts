import { ExtensionContext, StatusBarAlignment, window, commands } from 'vscode';
import { showProxyList, setUpProxyStatusBar, openAddProxySettings } from './proxy/proxyManager';
import { COMMAND_SHOW_PROXY_LIST, COMMAND_ADD_PROXY, STATUS_BAR_PRIORITY } from './proxy/constants';

/**
 * Activates the VSCode Proxy Manager extension.
 *
 * Creates a status bar item displaying the current proxy status
 * and registers the command to show the proxy selection list.
 *
 * @param context - The extension context provided by VS Code.
 */
export function activate(context: ExtensionContext): void {
    const proxyStatusBar = window.createStatusBarItem(StatusBarAlignment.Left, STATUS_BAR_PRIORITY);

    setUpProxyStatusBar(proxyStatusBar);

    const showProxyListCommand = commands.registerCommand(COMMAND_SHOW_PROXY_LIST, async () =>
        showProxyList(proxyStatusBar),
    );

    const addProxyCommand = commands.registerCommand(COMMAND_ADD_PROXY, () =>
        openAddProxySettings(),
    );

    context.subscriptions.push(proxyStatusBar);
    context.subscriptions.push(showProxyListCommand);
    context.subscriptions.push(addProxyCommand);
}

/**
 * Deactivates the VSCode Proxy Manager extension.
 * Currently performs no cleanup.
 */
export function deactivate(): void {}
