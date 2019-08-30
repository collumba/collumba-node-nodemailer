const express = require('express');
const bodyParser = require('body-parser');
const exphbs = require('express-handlebars');
const nodemailer = require('nodemailer');

const app = express();

app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

async function send(output){
    let transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true, // true for 465, false for other ports
        auth: {
            user: "XXXXXXXXX@gmail.com", // generated ethereal user
            pass: "XXXXXXXXX" // generated ethereal password
        },
        tls: {
            rejectUnauthorized:true
        }
    });

    // send mail with defined transport object
    let info = await transporter.sendMail({
        from: '"FORM@123 - Contato 👻" xxxxxxxxxxxxxxxxx@gmail.com', // sender address
        to: "xxxxxxxxxxxx@gmail.com", // list of receivers        
        subject: "Hello ✔", // Subject line
        text: "Hello world?", // plain text body
        html: output // html body
    });

    console.log("Message sent: %s", info.messageId);
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
}

app.get('/', (req, res) => {
    res.send('Mailer Server 1.3 - RUNNING');
});

app.post('/send', (req, res) => {
    const output = `
    <h2>Novo e-mail de contato</h2>
    <h3>Detalhes do contato:</h3>
    <ul>
        <li>Nome: ${req.body.name}</li>
        <li>Email: ${req.body.email}</li>
    </ul>
    <h3>Mensagem:</h3>
    <p>${req.body.message}</p>
    `
    try {
        send(output);
        res.status(200).send('ok');
    }
     catch (e) {
        res.status(400).send(e); 
    }
    // send(output).catch(console.error);
    res.end();
});

app.listen(3001, () => console.log('Server started...'));

