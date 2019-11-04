const handlebars = require('handlebars');
const fs = require('fs');
const hljs = require('highlightjs');

const express = require('express');
const app = express();
const PORT = process.env.PORT || 5000;

app.use('/nonce', (req, res, next) => {
    res.locals.nonce = require('uuid').v4();
    next();
})

app.use('/nonce', require('helmet-csp')({
    directives: {
        scriptSrc: [(req, res) => `'nonce-${ res.locals.nonce }'`]
    }
}))

app.get('/|/nonce', function (req, res) {
    const render = handlebars.compile(fs.readFileSync('./index.hbs', 'utf8'));
    const jscode = highlightedCode = hljs.highlightAuto(`
var scriptElement = document.createElement('script');
scriptElement.innerHTML = 'alert("Hi everyone!")';
document.body.append(scriptElement);
    `).value;

    res.send(render({ nonce: res.locals.nonce, jscode }));
})

app.listen(PORT, function () {
    console.log('Example app listening on port ' + PORT + '!');
});
