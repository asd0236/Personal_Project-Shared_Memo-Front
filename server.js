const express = require('express');
const app = express();
const port = 5000;

app.use(express.static(__dirname + "/src"));

app.get("/", (res) => {
    res.sendFile(__dirname + "/src/mainPage.html");
});

app.listen(port, () => {
    console.log(`서버 실행 http://localhost:${port}`)
})

