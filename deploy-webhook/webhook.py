"""Minimal deploy webhook server."""
import http.server
import os
import subprocess
import json

TOKEN = os.environ.get("DEPLOY_TOKEN", "")
PORT = int(os.environ.get("PORT", "9000"))


class WebhookHandler(http.server.BaseHTTPRequestHandler):
    def do_POST(self):
        auth = self.headers.get("Authorization", "")
        if auth != f"Bearer {TOKEN}" or not TOKEN:
            self.send_response(403)
            self.end_headers()
            self.wfile.write(b'{"error":"unauthorized"}')
            return

        try:
            result = subprocess.run(
                ["/usr/local/bin/deploy.sh"],
                capture_output=True, text=True, timeout=300
            )
            body = json.dumps({
                "status": "ok" if result.returncode == 0 else "error",
                "stdout": result.stdout[-500:] if result.stdout else "",
                "stderr": result.stderr[-500:] if result.stderr else "",
            })
            self.send_response(200 if result.returncode == 0 else 500)
            self.send_header("Content-Type", "application/json")
            self.end_headers()
            self.wfile.write(body.encode())
        except Exception as e:
            self.send_response(500)
            self.end_headers()
            self.wfile.write(json.dumps({"error": str(e)}).encode())

    def log_message(self, fmt, *args):
        print(f"[webhook] {fmt % args}")


if __name__ == "__main__":
    print(f"Deploy webhook listening on :{PORT}")
    server = http.server.HTTPServer(("0.0.0.0", PORT), WebhookHandler)
    server.serve_forever()
