const path = require('path');
const express = require('express');

const app = express();

// set static folder for frontend view

app.use(express.static(path.join(__dirname, 'public')));

const PORT = 5000 || process.env.PORT;

app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});