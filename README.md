<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Simple Page</title>
    <style>
        body {
            margin: 0;
            padding: 0;
            background-color: #2a2a2a;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
        }

        .container {
            text-align: center;
        }

        button {
            background-color: white;
            color: #2a2a2a;
            border: none;
            padding: 12px 32px;
            font-size: 16px;
            font-weight: 500;
            border-radius: 4px;
            cursor: pointer;
            transition: background-color 0.3s ease;
        }

        button:hover {
            background-color: #f0f0f0;
        }

        button:active {
            background-color: #e0e0e0;
        }
    </style>
</head>
<body>
    <div class="container">
        <button>Button</button>
    </div>
</body>
</html>
