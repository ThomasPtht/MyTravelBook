import "@testing-library/jest-dom";

import { TextEncoder, TextDecoder } from 'util';

const fetch = require('node-fetch');
const { Request, Response, Headers } = fetch;

if (typeof global.fetch === 'undefined') {
    global.fetch = fetch;
}
if (typeof global.Request === 'undefined') {
    global.Request = Request;
}
if (typeof global.Response === 'undefined') {
    global.Response = Response;
}
if (typeof global.Headers === 'undefined') {
    global.Headers = Headers;
}

if (typeof global.TextEncoder === 'undefined') {
    global.TextEncoder = TextEncoder as any;
}
if (typeof global.TextDecoder === 'undefined') {
    global.TextDecoder = TextDecoder as any;
}