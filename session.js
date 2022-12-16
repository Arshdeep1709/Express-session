const express = require('express');
const cookieParser = require('cookie-parser');
const expressSession = require('express-session');

const app = express();
const port = 3450;
const userName = 'user';
const passWord = 'password'
var session;

// To set up the session, you need to set a couple of Express-session options, as shown below.

var fiveSeconds = 5000;

app.use(expressSession({
    secret:"thisismysecretkey",
    saveUninitialized:true,
    cookie:{maxAge:fiveSeconds},
    resave:false

}))
// secret - a random unique string key used to authenticate a session. It is stored in an environment variable and can’t be exposed to the public. The key is usually long and randomly generated in a production environment.

// resave - takes a Boolean value. It enables the session to be stored back to the session store, even if the session was never modified during the request. This can result in a race situation in case a client makes two parallel requests to the server. Thus modification made on the session of the first request may be overwritten when the second request ends. The default value is true. However, this may change at some point. false is a better alternative.

// saveUninitialized - this allows any uninitialized session to be sent to the store. When a session is created but not modified, it is referred to as uninitialized.

// cookie: { maxAge: oneDay } - this sets the cookie expiry time. The browser will delete the cookie after the set duration elapses. The cookie will not be attached to any of the requests in the future. In this case, we’ve set the maxAge to a single day as computed by the following arithmetic.
// ------------------------------------------------------------------------------------------------------------

// To initialize the session, we will set the session middleware inside the routes of the individual HTTP requests.

// When a client sends a request, the server will set a session ID and set the cookie equal to that session ID. The cookie is then stored in the set cookie HTTP header in the browser. Every time the browser (client) refreshes, the stored cookie will be a part of that request.

app.use(express.json());
app.use(express.urlencoded({extended:true}));
// express methods to parse the data

app.use(express.static(__dirname));
// serving public file
app.use(cookieParser());    

// Set the authentication credentials
// In this example, we are using a simple login application. To authenticate the user, I’ve specified the username and password as user and password, respectively in this file as variables.

// In a production environment, these credentials are usually saved in a database. For the sake of simplicity in this tutorial, we are storing them in these variables.
// -----------------------------------------------------------------------------------------------------------

// Now we will add three end points

app.get('/', (req,res)=>{
    req.session.isAuth = true;
    session = req.session;
    if(session.userid){
        res.send("Welcome User<a href=\'/logout'>Click to log out</a>")
    } else {
        res.sendFile(__dirname+"/index.html")
    }
})

app.post('/user',(req,res) => {
    if(req.body.username == userName && req.body.password == passWord){
        session=req.session;
        session.userid=req.body.username;0
        console.log(req.session)
        console.log(req.session.id)
        res.send("Hey there, welcome <a href=\'/logout'>click to logout</a>");
    }
    else{
        res.send('Invalid username or password');
    }
})

app.get('/logout', (req,res)=>{
    req.session.destroy();
    res.redirect('/')
})













app.listen(port,()=> console.log("Connected"));

