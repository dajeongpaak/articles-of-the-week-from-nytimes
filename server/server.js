require('dotenv').config();
const express = require('express');
const path = require('path');
const cors = require('cors');
const axios = require('axios');
const client = require("@mailchimp/mailchimp_marketing");
const nodemailer = require('nodemailer');
const cron = require('node-cron');
const moment = require('moment-timezone');

const apiKey = process.env.NY_TIMES_API_KEY;
const mailChimpAPIKey = process.env.MAILCHIMP_API_KEY;
const mailChimpListId = process.env.MAILCHIMP_LIST_ID;
const mailChimpServer = process.env.MAILCHIMP_SERVER;
const gmailAppPass = process.env.GMAILAPP_PASS;

    // start server with Express
const app = express();

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => { 
    console.log(`Server started on ${PORT}`);
});

    // Serve Frontend
app.use(express.static(path.join(__dirname, '../build')))

app.get('*', (req, res) => res.sendFile(__dirname, '../', 'build', 'index.html'))

    // Middleware
    // every incoming request body will be parsed in JSON format through app.use middleware function
app.use(express.json());

    // Cross-Origin Resources Sharing 
    // when making HTTP request from domain to another(client side) the cross origin resources sharing is blocked by nature due to security restrictions

    // this middleware enables CORS by allowing specific domains to access resources from my server
app.use(cors());

    // this allows communication between its client-side and this server and access the server's resources, ensuring security 
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', 'http://articles-of-the-week.dajeongpark.com');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    next();
  });

client.setConfig({
apiKey: mailChimpAPIKey,
server: mailChimpServer,
});

    // a POST request is sent to /signup route
    // again by setting header it helps communicate between client and server
app.post('/signup', async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', 'http://articles-of-the-week.dajeongpark.com');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    try {

        const { mail } = req.body;

            // add the emails that is inputed by user to the mailing list provided by MailChimp
        const response = await client.lists.batchListMembers(mailChimpListId, {
            members: [
                {
                    email_address: mail,
                    status: 'subscribed',
                    merge_fields: {
                        EMAIL: mail
                    }
                }
            ]
            });
        
                // based on its success or failure, send status code to the client to display different feedbacks
        if (response.error_count === 0) {
            res.status(200).json({ status: 200 });
        } else {
            res.status(500).json({ status: 500 });
        }

    } catch (error) {
        console.error('Mailchimp error:', error);
    }

});

const timeZone = 'America/Vancouver';

cron.schedule('0 13 * * 0', () => {

        // retrieve the email addresses through MailChimp API
    const getMembersEmails = async () => {

        try {
            const response = await client.lists.getListMembersInfo(mailChimpListId);
                // extract respective email addresses and store them in an array
            const memberEmails = response.members.map(member => member.email_address);

            return memberEmails;
        
        } catch (error) {
            console.error(error);
        }

    };

        // fetch NY Times data in order to complete an email content with the data for weekly updates 
    const fetchData = async () => {

        try {
            const response = await axios.get(`https://api.nytimes.com/svc/mostpopular/v2/viewed/7.json?api-key=${apiKey}`);
            const result = response.data.results;
  
            return result;

        } catch(error) {
            console.log(error);
        }

    };

    const emailContent = async () => {

        try {

                // create a part of email content as needed
            const results = await fetchData();
            const result = results?.map((item) => (`
            <div class="card">
                <h2 class="title">${item.title}</h2>
                <p class="abstract">${item.abstract}</p>
                <p><a class="read-more-link" href="${item.url}">Read More</a></p>
            </div>
            `)).join('');
            
                // inject the created part in the email template
            const htmlContent = `
            <!doctype html>
            <html>
            <head>
            <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
            <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
            <title>Weekly Updates - The Most Viewed Articles from New York Times</title>
            <style>
            /* -------------------------------------
            GLOBAL RESETS
            ------------------------------------- */

            /*All the styling goes here*/

            img {
            border: none;
            -ms-interpolation-mode: bicubic;
            max-width: 100%; 
            }

            body {
            background-color: #f6f6f6;
            font-family: sans-serif;
            -webkit-font-smoothing: antialiased;
            font-size: 14px;
            line-height: 1.4;
            margin: 0;
            padding: 0;
            -ms-text-size-adjust: 100%;
            -webkit-text-size-adjust: 100%; 
            }

            table {
            border-collapse: separate;
            mso-table-lspace: 0pt;
            mso-table-rspace: 0pt;
            width: 100%; }
            table td {
            font-family: sans-serif;
            font-size: 14px;
            vertical-align: top; 
            }

            /* -------------------------------------
            BODY & CONTAINER
            ------------------------------------- */

            .body {
            background-color: #f6f6f6;
            width: 100%; 
            }

            /* Set a max-width, and make it display as block so it will automatically stretch to that width, but will also shrink down on a phone or something */
            .container {
            display: block;
            margin: 0 auto !important;
            /* makes it centered */
            max-width: 580px;
            padding: 10px;
            width: 580px; 
            }

            /* This should also be a block element, so that it will fill 100% of the .container */
            .content {
            box-sizing: border-box;
            display: block;
            margin: 0 auto;
            max-width: 580px;
            padding: 10px; 
            margin-top: 3rem;
            }


            .card {
            border: 1px solid #cccccc;
            border-radius: 4px;
            padding: 20px;
            margin-bottom: 20px;
            }

            .title {
            font-size: 20px;
            color: #333333;
            margin-bottom: 10px;
            }

            .image-container {
            text-align: center;
            margin-bottom: 10px;
            }

            .image {
            width: 100%;
            max-width: 400px;
            height: auto;
            text-align: center;
            margin-bottom: 10px;
            }

            .abstract {
            color: #666666;
            font-size: 16px;
            margin-bottom: 10px;
            }

            .read-more-link {
            color: #0088cc;
            text-decoration: none;
            }

            .read-more-link:hover {
            text-decoration: underline;
            }
            /* -------------------------------------
            HEADER, FOOTER, MAIN
            ------------------------------------- */
            .main {
            background: #ffffff;
            border-radius: 3px;
            width: 100%; 
            }

            .wrapper {
            box-sizing: border-box;
            padding: 20px; 
            }

            .content-block {
            padding-bottom: 10px;
            padding-top: 10px;
            }

            .footer {
            clear: both;
            margin-top: 10px;
            text-align: center;
            width: 100%; 
            }
            .footer td,
            .footer p,
            .footer span,
            .footer a {
            color: #999999;
            font-size: 12px;
            text-align: center; 
            }

            /* -------------------------------------
            TYPOGRAPHY
            ------------------------------------- */
            h1,
            h2,
            h3,
            h4 {
            color: #000000;
            font-family: sans-serif;
            font-weight: 400;
            line-height: 1.4;
            margin: 0;
            margin-bottom: 30px; 
            }

            h1 {
            font-size: 35px;
            font-weight: 300;
            padding: 30px 0;
            text-transform: capitalize; 
            }

            p,
            ul,
            ol {
            font-family: sans-serif;
            font-size: 14px;
            font-weight: normal;
            margin: 0;
            margin-bottom: 15px; 
            }
            p li,
            ul li,
            ol li {
            list-style-position: inside;
            margin-left: 5px; 
            }

            a {
            color: #3498db;
            text-decoration: underline; 
            }

            /* -------------------------------------
            BUTTONS
            ------------------------------------- */
            .btn {
            box-sizing: border-box;
            width: 100%; }
            .btn > tbody > tr > td {
            padding-bottom: 15px; }
            .btn table {
            width: auto; 
            }
            .btn table td {
            background-color: #ffffff;
            border-radius: 5px;
            text-align: center; 
            }
            .btn a {
            background-color: #ffffff;
            border: solid 1px #3498db;
            border-radius: 5px;
            box-sizing: border-box;
            color: #3498db;
            cursor: pointer;
            display: inline-block;
            font-size: 14px;
            font-weight: bold;
            margin: 0;
            padding: 12px 25px;
            text-decoration: none;
            text-transform: capitalize; 
            }

            .btn-primary table td {
            background-color: #3498db; 
            }

            .btn-primary a {
            background-color: #3498db;
            border-color: #3498db;
            color: #ffffff; 
            }

            /* -------------------------------------
            OTHER STYLES THAT MIGHT BE USEFUL
            ------------------------------------- */
            .last {
            margin-bottom: 0; 
            }

            .first {
            margin-top: 0; 
            }

            .align-center {
            text-align: center; 
            }

            .align-right {
            text-align: right; 
            }

            .align-left {
            text-align: left; 
            }

            .clear {
            clear: both; 
            }

            .mt0 {
            margin-top: 0; 
            }

            .mb0 {
            margin-bottom: 0; 
            }

            .preheader {
            color: transparent;
            display: none;
            height: 0;
            max-height: 0;
            max-width: 0;
            opacity: 0;
            overflow: hidden;
            mso-hide: all;
            visibility: hidden;
            width: 0; 
            }

            .powered-by a {
            text-decoration: none; 
            }

            hr {
            border: 0;
            border-bottom: 1px solid #f6f6f6;
            margin: 20px 0; 
            }

            /* -------------------------------------
            RESPONSIVE AND MOBILE FRIENDLY STYLES
            ------------------------------------- */
            @media only screen and (max-width: 620px) {
            table.body h1 {
            font-size: 28px !important;
            margin-bottom: 10px !important; 
            }
            table.body p,
            table.body ul,
            table.body ol,
            table.body td,
            table.body span,
            table.body a {
            font-size: 16px !important; 
            }
            table.body .wrapper,
            table.body .article {
            padding: 10px !important; 
            }
            table.body .content {
            padding: 0 !important; 
            }
            table.body .container {
            padding: 0 !important;
            width: 100% !important; 
            }
            table.body .main {
            border-left-width: 0 !important;
            border-radius: 0 !important;
            border-right-width: 0 !important; 
            }
            table.body .btn table {
            width: 100% !important; 
            }
            table.body .btn a {
            width: 100% !important; 
            }
            table.body .img-responsive {
            height: auto !important;
            max-width: 100% !important;
            width: auto !important; 
            }
            }

            /* -------------------------------------
            PRESERVE THESE STYLES IN THE HEAD
            ------------------------------------- */
            @media all {
            .ExternalClass {
            width: 100%; 
            }
            .ExternalClass,
            .ExternalClass p,
            .ExternalClass span,
            .ExternalClass font,
            .ExternalClass td,
            .ExternalClass div {
            line-height: 100%; 
            }
            .apple-link a {
            color: inherit !important;
            font-family: inherit !important;
            font-size: inherit !important;
            font-weight: inherit !important;
            line-height: inherit !important;
            text-decoration: none !important; 
            }
            #MessageViewBody a {
            color: inherit;
            text-decoration: none;
            font-size: inherit;
            font-family: inherit;
            font-weight: inherit;
            line-height: inherit;
            }
            .btn-primary table td:hover {
            background-color: #34495e !important; 
            }
            .btn-primary a:hover {
            background-color: #34495e !important;
            border-color: #34495e !important; 
            } 
            }

            </style>
            </head>
            <body>
            <span class="preheader">Here's the most viewed articles for the last 7 days...</span>
            <table role="presentation" border="0" cellpadding="0" cellspacing="0" class="body">
            <tr>
            <td>&nbsp;</td>
            <td class="container">
            <div class="content">

            <!-- START CENTERED WHITE CONTAINER -->
            <table role="presentation" class="main">

            <!-- START MAIN CONTENT AREA -->
            <tr>
            <td class="wrapper">
            <table role="presentation" border="0" cellpadding="0" cellspacing="0">
                <tr>
                <td>
                    <h1>The Most Viewed Article of The Week</h1>
                    <hr>
                    <p>Dear Subscriber,</p>
                    <p>I hope this email finds you well. Thank you for subscribing to our weekly updates featuring the most viewed article from the New York Times.</p>
                    <br>
                    <p>Here's the most viewed article of the week:</p>
                        ${result}
                    <p>To read the full article, please visit the New York Times website through <span class="read-more-link">Read More</span> button at the bottom of each article.</p>
                    <p>Thank you for subscribing to weekly newsletter and staying informed with the latest news from the New York Times.</p>
                    <p>If you have any feedback or suggestions, I would love to hear from you. Simply reply to this email or reach out to me at <a href="mailTo:hello@dajeongpark.com">hello@dajeongpark.com</a>.</p>
                    <p>Wishing you a wonderful week ahead!</p>
                    <p>Warm regards,</p>
                </td>
                </tr>
            </table>
            </td>
            </tr>

            <!-- END MAIN CONTENT AREA -->
            </table>
            <!-- END CENTERED WHITE CONTAINER -->

            <!-- START FOOTER -->
            <div class="footer">
            <table role="presentation" border="0" cellpadding="0" cellspacing="0">
            <tr>
            <td class="content-block">
                <span>Developed by <a href="https://www.dajeongpark.com">Dajeong Park</a></span>
                <br> Don't like these emails? <a href="mailto:hello@dajeongpark.com">Please Contact DJ!!</a>.
            </td>
            </tr>
            <tr>
                <td class="powered-by">
                Template by <a href="https://github.com/leemunroe/responsive-html-email-template">leemunroe</a>.
                </td>
            </tr>
            </table>
            </div>
            <!-- END FOOTER -->

            </div>
            </td>
            <td>&nbsp;</td>
            </tr>
            </table>
            </body>
            </html>
            `;

            return htmlContent;

        } catch (error) {
            console.log(error);
        }

    };

        // nodemailer setup 
    const transporter = nodemailer.createTransport({

        service: 'gmail',
        host: "smtp.gmail.com",
        port: 587,
        secure: false,
        auth: {
            user: 'dajeong2019@gmail.com',
            pass: gmailAppPass
        }
        
    });

    const sendEmail = async () => {

        try {
                // prepare retrieved email addresses and content to send weekly updates
            const emails = await getMembersEmails();
            const content = await emailContent();

            const mailOptions = {
            from: 'DJ Park',
            bcc: emails,
            subject: 'Weekly Updates with the most viewed articles',
            html: content
            };

            const info = await transporter.sendMail(mailOptions);
            console.log('Email sent: ' + info.response);

        } catch (error) {
            console.log(error);
        }
    };
  

    sendEmail();

}, {
    timezone: timeZone
});

