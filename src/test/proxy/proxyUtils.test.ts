import { strictEqual } from 'assert';
import { ConfigurationTarget, workspace } from 'vscode';
import { getFormattedProxyOptions, detectProtocol } from '../../proxy/proxyUtils';
import {
    CONFIG_PROXY_LIST,
    OPTION_LABEL_NONE,
    OPTION_DESCRIPTION_NONE,
} from '../../proxy/constants';

suite('proxyUtils Test Suite', () => {
    teardown(async () => {
        await workspace
            .getConfiguration()
            .update(CONFIG_PROXY_LIST, [], ConfigurationTarget.Global);
    });

    // -------------------------------------------------------------------
    // detectProtocol
    // -------------------------------------------------------------------

    suite('detectProtocol', () => {
        test('should return "HTTP" for http:// URLs', () => {
            strictEqual(detectProtocol('http://proxy:8080'), 'HTTP');
        });

        test('should return "HTTPS" for https:// URLs', () => {
            strictEqual(detectProtocol('https://proxy:443'), 'HTTPS');
        });

        test('should return "Unknown" for other protocols', () => {
            strictEqual(detectProtocol('socks5://localhost:1080'), 'Unknown');
        });

        test('should be case insensitive', () => {
            strictEqual(detectProtocol('HTTP://proxy:8080'), 'HTTP');
            strictEqual(detectProtocol('HTTPS://proxy:443'), 'HTTPS');
        });
    });

    // -------------------------------------------------------------------
    // getFormattedProxyOptions
    // -------------------------------------------------------------------

    suite('getFormattedProxyOptions', () => {
        async function setProxyList(proxies: string[]): Promise<void> {
            await workspace
                .getConfiguration()
                .update(CONFIG_PROXY_LIST, proxies, ConfigurationTarget.Global);
        }

        test('should return only "None" option when proxy list is empty', async () => {
            await setProxyList([]);

            const options = await getFormattedProxyOptions();

            strictEqual(options.length, 1);
            strictEqual(options[0].label, OPTION_LABEL_NONE);
            strictEqual(options[0].description, OPTION_DESCRIPTION_NONE);
            strictEqual(options[0].value, '');
        });

        test('should detect HTTP protocol correctly', async () => {
            await setProxyList(['http://proxy:8080']);

            const options = await getFormattedProxyOptions();

            strictEqual(options.length, 2);
            strictEqual(options[0].label, 'http://proxy:8080');
            strictEqual(options[0].description, 'HTTP');
            strictEqual(options[0].value, 'http://proxy:8080');
        });

        test('should detect HTTPS protocol correctly', async () => {
            await setProxyList(['https://secure-proxy:3128']);

            const options = await getFormattedProxyOptions();

            strictEqual(options.length, 2);
            strictEqual(options[0].label, 'https://secure-proxy:3128');
            strictEqual(options[0].description, 'HTTPS');
        });

        test('should detect unknown protocol for non-http URLs', async () => {
            await setProxyList(['socks5://localhost:1080']);

            const options = await getFormattedProxyOptions();

            strictEqual(options.length, 2);
            strictEqual(options[0].label, 'socks5://localhost:1080');
            strictEqual(options[0].description, 'Unknown');
        });

        test('should format multiple proxies correctly', async () => {
            await setProxyList([
                'http://proxy1:8080',
                'https://proxy2:3128',
                'socks5://proxy3:1080',
            ]);

            const options = await getFormattedProxyOptions();

            strictEqual(options.length, 4);
            strictEqual(options[3].label, OPTION_LABEL_NONE);
            strictEqual(options[3].value, '');
        });

        test('should preserve original proxy value in label and value', async () => {
            const proxy = 'http://my-custom.proxy.io:9090';
            await setProxyList([proxy]);

            const options = await getFormattedProxyOptions();

            strictEqual(options[0].label, proxy);
            strictEqual(options[0].value, proxy);
        });
    });
});
