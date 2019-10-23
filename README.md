# fox-server - A backend template with REST API and websocket gateway functionality

**fox-server doesn't seem to work in Windows powershell.** I have yet to find a cause to this problem, but I suspect it will be related to the console loading package that is being used.

## Features

-   Morgan HTTP logging
-   Custom WS event logging

## Usage

### FoxServer

```ts
new FoxServer(opts: ServerOptions)
```

-   `start()` - starts the server and initialises the WS and rest servers.
