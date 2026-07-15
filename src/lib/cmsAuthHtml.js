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
        const target = window.location.origin;

        function completeAuth() {
          const message = "authorization:github:success:" + payload;
          if (window.opener) {
            window.opener.postMessage(message, target);
            window.close();
          }
        }

        function onParentReply(event) {
          if (event.origin !== target) return;
          if (event.data !== "authorizing:github") return;
          window.removeEventListener("message", onParentReply, false);
          completeAuth();
        }

        window.addEventListener("message", onParentReply, false);

        if (window.opener) {
          window.opener.postMessage("authorizing:github", target);
        }
      })();
    </script>
  </body>
</html>`;

  res.setHeader("Content-Type", "text/html; charset=utf-8");
  return res.status(200).send(content);
}

export { renderGithubTokenPage };
