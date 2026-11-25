"""Test doubles for the Cloudflare API, shared by the script tests; no network is touched."""

import contextlib
import io
import json
import os
import urllib.error
from unittest import mock

import cloudflare_api

TOKEN_MARKER = "TOKEN-MARKER"
ZONE_MARKER = "ZONE-MARKER"
MESSAGE_MARKER = "MESSAGE-MARKER"


class FakeResponse:
    """Minimal stand-in for the object urlopen returns, supporting json.load."""

    def __init__(self, payload):
        self.payload = json.dumps(payload).encode()

    def read(self, *arguments):
        return self.payload

    def __enter__(self):
        return self

    def __exit__(self, *arguments):
        return False


def http_error(request, status):
    """A Cloudflare error response whose message must never be printed."""
    body = json.dumps({"errors": [{"code": 10000, "message": MESSAGE_MARKER}]}).encode()
    return urllib.error.HTTPError(request.full_url, status, "Error", {}, io.BytesIO(body))


def request_path(request):
    """The API path a request was sent to, without the API base URL."""
    return request.full_url[len(cloudflare_api.API) + 1 :]


def run_against(urlopen, function, *arguments):
    """Calls function with a fake token, zone and urlopen; returns (its result, what it printed)."""
    environment = {"CLOUDFLARE_SECURITY_TOKEN": TOKEN_MARKER, "CLOUDFLARE_ZONE_ID": ZONE_MARKER}
    buffer = io.StringIO()
    with mock.patch.dict(os.environ, environment), mock.patch.object(
        cloudflare_api.urllib.request, "urlopen", urlopen
    ), contextlib.redirect_stdout(buffer):
        result = function(*arguments)
    return result, buffer.getvalue()
