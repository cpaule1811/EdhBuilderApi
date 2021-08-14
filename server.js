const cors = require("cors")
const helmet = require("helmet");
const knex = require('knex');
const express = require('express');
const bcrypt = require('bcrypt');
const nodemailer = require("nodemailer");

const app = express()

const signin = require('./controllers/signin')
const createdeck = require('./controllers/createdeck')
const addcard = require('./controllers/addcard')
const removecard = require('./controllers/removecard')
const removedeck = require('./controllers/removedeck')
const editdeck = require('./controllers/editdeck')
const profile = require('./controllers/profile')
const exceldecklist = require('./controllers/exceldecklist')
const username = require('./controllers/username')
const getdeck = require('./controllers/getdeck')
const recentDecks = require('./controllers/mostRecentDecks')
const addRating = require('./controllers/addrating')
const recommended = require('./controllers/recommended')
const leaderboard = require('./controllers/leaderboard')
const auth = require('./controllers/authorization')
const sideboard = require('./controllers/sideboard')
const search = require('./controllers/search')
const commanders = require('./controllers/commanders')
// const update = require('./controllers/updateEntries')
const sanitize = require('./controllers/sanitize')

const db = knex({ 
    client: 'pg', 
    connection : {
        host: process.env.HOSTNAME,
        user: process.env.USERNAME,
        database: process.env.DATABASE, 
        password: process.env.PASSWORD,
        port: process.env.DATABASE_PORT
    },
    ssl: {
        rejectUnauthorized: true,
        ca: process.env.CA_CERT
    }
})

app.use(express.urlencoded({extended: false}));
app.use(helmet())
app.use(express.json({limit: "1mb"}))
app.use(cors({ origin: 'https://edh-builder-luicu.ondigitalocean.app' }))

app.get('/', (req, res) => res.json("this is working"))
// app.post('/updateEntries', (req,res) => { update.updateEntries(req, res, db, cardlist.filteredCardlist) })
app.put('/username', sanitize.sanitizeData, auth.requireAuth, (req, res) => { username.handleUsername(req, res, db) })
app.post('/exceldecklist', auth.requireAuthEdit(db), (req, res) => { exceldecklist.handleExceldecklist(req, res, db) })
app.get('/profile/:userID', auth.requireAuth, (req, res) => {  profile.handleProfile(req, res, db) })
app.post('/createdeck', sanitize.sanitizeData, (req, res) => { createdeck.handleCreatedeck(req, res, db) })
app.post('/addcard', sanitize.sanitizeData, auth.requireAuthEdit(db), (req, res) => { addcard.handleAddcard(req, res, db) })
app.post('/removecard', auth.requireAuthEdit(db), (req, res) => { removecard.handleRemovecard(req, res, db) })
app.delete('/removedeck/:deckID', (req, res) => { removedeck.handleRemovedeck(req, res, db) })
app.post('/editdeck/:deckID', sanitize.sanitizeData, (req, res) => { editdeck.handleEditdeck(req, res, db) })
app.get('/requestdeck/:id/:userid', auth.requireAuthDecklist, (req, res) => { getdeck.handleGetdeck(req, res, db) })
app.get('/deckspub/:pn/:userid', (req, res) => { recentDecks.handleMostRecent(req, res, db) })
app.get('/deckspriv/:pn/:userid', (req, res) => { recentDecks.handleMostRecentPriv(req, res, db) })
app.get('/decknumpub/:userid', (req, res) => { recentDecks.getDecksLength(req, res, db) })
app.get('/decknumpriv/:userid', (req, res) => { recentDecks.getDecksLengthPriv(req, res, db) })
app.post('/rating', (req, res) => { addRating.handleAddRating(req,res,db) })
app.get('/recommend/:commander/:partner', (req, res) => { recommended.handleRecommended(req, res, db) })
app.get('/leaderboard', (req, res) => { leaderboard.handleLeaderboard(req,res,db) })
app.get('/signout', auth.requireAuth, (req, res) => { signin.signout(req,res) })
// app.post('/send', sanitize.sanitizeData, (req, res) => { mail.handleMail(req,res, nodemailer) })
app.put('/sideboard', auth.requireAuthEdit(db), (req, res) => { sideboard.handleSideboard(req, res, db) })

app.post('/signin', sanitize.sanitizeData, signin.signinAuthentication(db, bcrypt))
app.post('/register', sanitize.sanitizeData, signin.registerAuthentication(db, bcrypt))

app.get('/search', sanitize.sanitizeData, (req, res) => { search.search(req,res, db) })
app.get('/commanders', (req, res) => { commanders.getCommanders(req, res, db) })


app.listen(process.env.PORT, () => { console.log('listening to server port:'+ process.env.PORT)})