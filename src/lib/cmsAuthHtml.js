function renderGithubTokenPage(res, token) {
  const authPayload = JSON.stringify({
    token,
    provider: "github",
  });

  const content = `<!DOCTYPE html>
<html lang="ko">
  <head>
    <meta charset="utf-8" />
    <title>Authenticating...</title>
  </head>
  <body>
    <script>
      (function () {
        const payload = ${JSON.stringify(authPayload)};
        const message = "authorization:github:success:" + payload;

        function notifyOpener() {
          if (!window.opener) return false;
          window.opener.postMessage(message, window.location.origin);
          return true;
        }

        if (notifyOpener()) {
          window.close();
          return;
        }

        function receiveMessage() {
          if (notifyOpener()) {
            window.removeEventListener("message", receiveMessage, false);
            window.close();
          }
        }

        window.addEventListener("message", receiveMessage, false);
        if (window.opener) {
          window.opener.postMessage("authorizing:github", window.location.origin);
        }
      })();
    </script>
  </body>
</html>`;

  res.setHeader("Content-Type", "text/html; charset=utf-8");
  return res.status(200).send(content);
}

export { renderGithubTokenPage };
