export function welcomeHtml(message: string, callbackurl: string) {
  return `<!DOCTYPE html>
<html>
<head>
<style>
  body {
    font-family: Arial, sans-serif;
    background-color: #f0f0f0;
    margin: 0;
    padding: 20px;
  }
  .message {
    background-color: #ffffff;
    border: 1px solid #cccccc;
    padding: 10px;
    margin-bottom: 10px;
  }
  .editable {
    border: 1px solid #999999;
    padding: 5px;
  }
  a {
    color: #0066cc;
    text-decoration: none;
  }
</style>
</head>
<body>

<div class="message">
  <p>${message}</p>
</div>

<div class="message">
  <p>or follow this link to verify:</p>
  <a href=${callbackurl}>verify email</a>
</div>

</body>
</html>
`;
}

export function resetPasswordHtml(message: string, callbackurl: string) {
  return `<!DOCTYPE html>
<html>
<head>
<style>
  body {
    font-family: Arial, sans-serif;
    background-color: #f0f0f0;
    margin: 0;
    padding: 20px;
  }
  .message {
    background-color: #ffffff;
    border: 1px solid #cccccc;
    padding: 10px;
    margin-bottom: 10px;
  }
  .editable {
    border: 1px solid #999999;
    padding: 5px;
  }
  a {
    color: #0066cc;
    text-decoration: none;
  }
</style>
</head>
<body>

<div class="message">
  <p>${message}</p>
</div>



</body>
</html>
`;
}
