import net from 'node:net';
import http from 'node:http';
import https from 'node:https';
import { appendFileSync } from 'node:fs';
import { syncBuiltinESMExports } from 'node:module';

// `09` §10.4 item 12: fail at the transport, including libraries which bypass
// fetch. NODE_OPTIONS loads this in the prerender worker and Node subprocesses.
function blocked() {
	if (process.env.BIOBRAWL_NETWORK_AUDIT) appendFileSync(process.env.BIOBRAWL_NETWORK_AUDIT, 'blocked network attempt\n');
	throw new Error('Outbound network is blocked by the archive build check');
}
globalThis.fetch = async () => blocked();
net.Socket.prototype.connect = blocked;
http.request = blocked;
http.get = blocked;
https.request = blocked;
https.get = blocked;
syncBuiltinESMExports();
