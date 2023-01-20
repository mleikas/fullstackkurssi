```mermaid
  sequenceDiagram
    participant browser
    participant server
    Note over browser: Click save
    browser-->>server: GET https://studies.cs.helsinki.fi/exampleapp/spa
    server-->>browser: HTML file

    browser-->>server: GET https://studies.cs.helsinki.fi/exampleapp/main.js
    server-->>browser: main.js

    browser-->>server: GET https://studies.cs.helsinki.fi/exampleapp/spa.js
    server-->>browser: spa.js

    Note right of browser: JS code executed

    browser->>server: GET https://studies.cs.helsinki.fi/exampleapp/data.json
    server-->>browser: json data
```