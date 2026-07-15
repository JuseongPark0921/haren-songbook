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

        function receiveMessage(e) {
          window.opener.postMessage(
            "authorization:github:success:" + payload,
            e.origin
          );
          window.removeEventListener("message", receiveMessage, false);
        }

        window.addEventListener("message", receiveMessage, false);
        window.opener.postMessage("authorizing:github", "*");
      })();
    </script>
  </body>
</html>`;

  res.setHeader("Content-Type", "text/html; charset=utf-8");
  return res.status(200).send(content);
}

export { renderGithubTokenPage };
