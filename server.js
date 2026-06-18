const http = require("http");
const fs = require("fs");
const path = require("path");

const preferredPort = Number(process.env.PORT) || 5173;
const maxPort = preferredPort + 10;
const root = __dirname;

const types = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon"
};

function resolveRequestPath(urlPath) {
  const decodedPath = decodeURIComponent(urlPath.split("?")[0]);
  const safePath = path.normalize(decodedPath).replace(/^(\.\.[/\\])+/, "");
  const requestedPath = path.join(root, safePath);

  if (!requestedPath.startsWith(root)) {
    return null;
  }

  return requestedPath;
}

const server = http.createServer((req, res) => {
  const requestedPath = resolveRequestPath(req.url || "/");

  if (!requestedPath) {
    res.writeHead(403);
    res.end("Forbidden");
    return;
  }

  const filePath = fs.statSync(requestedPath, { throwIfNoEntry: false })?.isDirectory()
    ? path.join(requestedPath, "index.html")
    : requestedPath;

  fs.readFile(filePath, (error, data) => {
    if (error) {
      res.writeHead(404);
      res.end("Not found");
      return;
    }

    const type = types[path.extname(filePath).toLowerCase()] || "application/octet-stream";
    res.writeHead(200, { "Content-Type": type });
    res.end(data);
  });
});

function listen(port) {
  server.once("error", (error) => {
    if (error.code === "EADDRINUSE" && port < maxPort) {
      listen(port + 1);
      return;
    }

    if (error.code === "EADDRINUSE") {
      console.error(`Ports ${preferredPort}-${maxPort} are already in use.`);
      console.error("Close an existing server window, or set a different port with: $env:PORT=5190; npm run dev");
      process.exit(1);
    }

    throw error;
  });

  server.listen(port, () => {
    console.log(`Portfolio running at http://localhost:${port}`);
  });
}

listen(preferredPort);
