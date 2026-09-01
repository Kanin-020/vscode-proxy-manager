import { strictEqual } from 'assert';
import { ConfigurationTarget, StatusBarItem, StatusBarAlignment, window, workspace } from 'vscode';
import { setUpProxyStatusBar, updateStatusBarForProxy, applyProxy } from '../../proxy/proxyManager';
import {
    CONFIG_HTTP_PROXY,
    CONFIG_PROXY_LIST,
    COMMAND_SHOW_PROXY_LIST,
    STATUS_BAR_TEXT_NO_PROXY,
    STATUS_BAR_TEXT_ACTIVE_PROXY,
    STATUS_BAR_TOOLTIP_NO_PROXY,
    STATUS_BAR_PRIORITY,
} from '../../proxy/constants';

suite('proxyManager Test Suite', () => {
    function createStatusBarItem(): StatusBarItem {
        return window.createStatusBarItem(StatusBarAlignment.Left, STATUS_BAR_PRIORITY);
    }

    teardown(async () => {
        await workspace
            .getConfiguration()
            .update(CONFIG_HTTP_PROXY, undefined, ConfigurationTarget.Global);
        await workspace
            .getConfiguration()
            .update(CONFIG_PROXY_LIST, [], ConfigurationTarget.Global);
    });

    // -------------------------------------------------------------------
    // updateStatusBarForProxy
    // -------------------------------------------------------------------

    suite('updateStatusBarForProxy', () => {
        test('should show "No Proxy" when proxy is empty', () => {
            const statusBar = createStatusBarItem();
            updateStatusBarForProxy(statusBar, '');

            strictEqual(statusBar.text, STATUS_BAR_TEXT_NO_PROXY);
            strictEqual(statusBar.tooltip, STATUS_BAR_TOOLTIP_NO_PROXY);

            statusBar.dispose();
        });

        test('should show "Proxy" with URL when proxy is set', () => {
            const statusBar = createStatusBarItem();
            updateStatusBarForProxy(statusBar, 'http://proxy:8080');

            strictEqual(statusBar.text, STATUS_BAR_TEXT_ACTIVE_PROXY);
            strictEqual(statusBar.tooltip, 'Current Proxy: http://proxy:8080');

            statusBar.dispose();
        });
    });

    // -------------------------------------------------------------------
    // applyProxy
    // -------------------------------------------------------------------

    suite('applyProxy', () => {
        test('should disable proxy and update status bar', async () => {
            const statusBar = createStatusBarItem();
            await applyProxy(statusBar, '', 'None');

            const currentProxy = workspace.getConfiguration().get<string>(CONFIG_HTTP_PROXY);
            strictEqual(currentProxy, '');
            strictEqual(statusBar.text, STATUS_BAR_TEXT_NO_PROXY);

            statusBar.dispose();
        });

        test('should set proxy and update status bar', async () => {
            const statusBar = createStatusBarItem();
            await applyProxy(statusBar, 'http://proxy:8080', 'http://proxy:8080');

            const currentProxy = workspace.getConfiguration().get<string>(CONFIG_HTTP_PROXY);
            strictEqual(currentProxy, 'http://proxy:8080');
            strictEqual(statusBar.text, STATUS_BAR_TEXT_ACTIVE_PROXY);

            statusBar.dispose();
        });
    });

    // -------------------------------------------------------------------
    // setUpProxyStatusBar
    // -------------------------------------------------------------------

    suite('setUpProxyStatusBar', () => {
        test('should show "No Proxy" when http.proxy is empty', async () => {
            await workspace
                .getConfiguration()
                .update(CONFIG_HTTP_PROXY, '', ConfigurationTarget.Global);

            const statusBar = createStatusBarItem();
            setUpProxyStatusBar(statusBar);

            strictEqual(statusBar.text, STATUS_BAR_TEXT_NO_PROXY);
            strictEqual(statusBar.tooltip, STATUS_BAR_TOOLTIP_NO_PROXY);
            strictEqual(statusBar.command, COMMAND_SHOW_PROXY_LIST);

            statusBar.dispose();
        });

        test('should show "Proxy" with URL when http.proxy is set', async () => {
            const proxyUrl = 'http://my-proxy:8080';
            await workspace
                .getConfiguration()
                .update(CONFIG_HTTP_PROXY, proxyUrl, ConfigurationTarget.Global);

            const statusBar = createStatusBarItem();
            setUpProxyStatusBar(statusBar);

            strictEqual(statusBar.text, STATUS_BAR_TEXT_ACTIVE_PROXY);
            strictEqual(statusBar.tooltip, `Current Proxy: ${proxyUrl}`);
            strictEqual(statusBar.command, COMMAND_SHOW_PROXY_LIST);

            statusBar.dispose();
        });

        test('should always assign the showProxyList command', () => {
            const statusBar = createStatusBarItem();
            setUpProxyStatusBar(statusBar);

            strictEqual(statusBar.command, COMMAND_SHOW_PROXY_LIST);

            statusBar.dispose();
        });
    });
});
