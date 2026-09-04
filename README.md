# Bengali Blush

A beauty boutique storefront built with React, Vite, and pnpm workspaces.

## Run Locally from Git Bash

Install the dependencies:

```bash
pnpm install
```

Start the storefront:

```bash
PORT=25910 BASE_PATH=/ pnpm --filter @workspace/bengali-blush run dev
```

Open <http://localhost:25910> in your browser.

To run the optional API server, open another Git Bash terminal and run:

```bash
PORT=8080 pnpm --filter @workspace/api-server run dev
```

The API health endpoint is available at <http://localhost:8080/api/healthz>.
