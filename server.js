import { fileURLToPath } from 'url';
import path,{ dirname } from 'path';
import express from 'express';
import fileupload from 'express-fileupload';
import session from 'express-session';
import ejs from 'ejs';
import mongoose from 'mongoose';
import { nanoid } from 'nanoid';
import 'dotenv/config';

import {
	isExist,
	showStuff,
	showBlog,
	createBlog,
	saveBlog,
	deleteBlog,
	hasher,
	isHashMatch,
	createBlogList,
	createBlogHome
} from './app.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Custom function to implement string formatting

String.prototype.format = function () {
  var args = arguments;
  return this.replace(/{([0-9]+)}/g, function (match, index) {
    return typeof args[index] == 'undefined' ? match : args[index];
  });
};

const alert = '<script>alert("{0}");</script><meta http-equiv="refresh" content="0;url=/{1}"/>'

// ######################################

// Initializing DB and creating schemas

const db = mongoose.createConnection(`mongodb+srv://${process.env.m4ng0u53r}:${process.env.m4ng0p455}@${process.env.m4ng0n4m3}.csskoex.mongodb.net/${process.env.m4ng0d0c}`);

const blogcred = new mongoose.Schema({
  user: String,
  email: String,
  pass: String
});

export const credModel = db.model('_', blogcred,"blog_cred");

const blogdata = new mongoose.Schema({
	_id : Object,
  uid: String,
  ts: String,
  blog_title: String,
  blog_content: String
});

export const blogModel = db.model('_', blogdata,"blog_data");

console.log("Connected with DB")

// await db.dropDatabase().then(() => console.log("DB Dropped"))

const app = express();
app.use(express.static(__dirname));
app.use(fileupload({
	createParentPath:true,
	debug:false
}));
app.set('views', __dirname);
app.engine('html', ejs.renderFile); // Rendering engine for HTML
app.use(express.json())
app.disable('x-powered-by') // Avoids people from detecting express
app.use(express.urlencoded({ extended: true }))

// Setting up a session

app.use(
  session({
    secret: nanoid(512),
    resave: false,
    saveUninitialized: true,
    maxAge: 5 * 60 * 1000 // 5 mins
  })
);

// Routes

app.get('/', async (req, res) => {
	var way2go = "";
	if(req.session.userz != null){
		way2go += `<li class="nav-item"><a class="nav-link" href="/dashboard">Dashboard</a></li>`
    way2go += `<li class="nav-item"><a class="nav-link" href="/logout">Logout</a></li>`
	}
	else{
		way2go += `<li class="nav-item"><a class="nav-link">Hello !!!</a></li>`
    way2go += `<li class="nav-item"><a class="nav-link" href="/signup">Sign Up</a></li>`
    way2go += `<li class="nav-item"><a class="nav-link" href="/login">Login</a></li>`
	}
	res.render("home.html",{
		way2go:way2go,
		blog_space: await createBlogHome()
	});
})

app.route('/signup')
.get((req,res) => {
	res.sendFile(path.join(__dirname, "signup.html"));
})
.post(async (req,res) => {
	const user = req.body.user.toLowerCase();
	const email = req.body.email.toLowerCase();
	const pass = req.body.pass1;

	if (await isExist({"user":user}) != null)
		return res.send(alert.format("Username exists","signup"));
	else if(await isExist({"email":email}) != null)
		return res.send(alert.format("Email exists","signup"));

	// Store in the DB
	await credModel({
		"user":user,
		"email":email,
		"pass":await hasher(pass)
	}).save().then(() => console.log("Data Stored"));

	return res.redirect("/login");
})

app.route('/login')
.get((req, res) => {
	res.sendFile(path.join(__dirname, "login.html"));
})
.post(async(req,res) =>{
	const user = req.body.user.toLowerCase();
	const pass = req.body.pass1;
	const exist = await isExist({"user":user});
	if (exist == null)
		return res.send(alert.format("Username doesnt exists","login"));
	const {_id,user:userz,pass : hash} = await showStuff(exist)
	if(await isHashMatch(pass,hash)){
		req.session.userz = userz;
		req.session.uid = _id.toString();
		res.redirect("/");
	}
	else
		return res.send(alert.format("Incorrect Password","login"));
})

app.get('/dashboard', async(req, res) => {
	if(req.session.userz != null){
		req.session.bid = null;
		res.render("dashboard.html",{
			username:req.session.userz,
			blog_data:await createBlogList(req.session.uid)
		});
	}
	else
		res.send(alert.format("You are not logged in","login"))
})

app.get("/create", async(req,res)=>{
	if(req.session.userz != null){
		req.session.bid = await createBlog(req.session.uid)
		res.redirect(`/edit/${req.session.bid}`)
	}
	else
		res.send(alert.format("You are not logged in","login"))
})


app.get("/edit/:bid",async(req, res) => {
	if(req.session.userz != null){
		if((await showBlog(req.params.bid)).uid == req.session.uid){ // Checking if its the right user
			req.session.bid = req.params.bid // I want this
			const {blog_title,blog_content} = await showBlog(req.params.bid)
			res.render("edit.html",{
				"blog_img":`../uploads/${req.session.uid}/${req.params.bid}`,
				"blog_title":blog_title,
				"blog_content":blog_content
			});
		}
		else
			res.send(alert.format("No impersonations, Go back to ur dashboard","dashboard"))
	}
	else
		res.send(alert.format("You are not logged in","login"))
})

app.post("/edit",async(req,res)=>{
	if(req.session.userz != null){
		await saveBlog(req.session.bid,{blog_title:req.body.blog_title})
		await saveBlog(req.session.bid,{blog_content:req.body.blog_content})
		res.redirect(`/edit/${req.session.bid}`);
	}
	else
		res.send(alert.format("You are not logged in","login"))
})

app.post('/upload', async (req, res) => {
	if(req.session.userz != null){
		if (!req.files || Object.keys(req.files).length === 0)
			return res.status(400).send('No files were uploaded.');
	  let file = req.files.image;
	  let path = 'uploads/' + req.session.uid + "/" + req.session.bid;
	  file.mv(path,(err,success) => {
      if(err)
      	throw err;
      else
        res.json(path)
    })
	}
	else
		res.send(alert.format("Session ended","login"))
})
// ###################

app.get('/read/:bid', async(req, res) => {
	let way2go = ""
	if(req.session.userz != null)
		way2go = '<a class="nav-link" href="/dashboard">Back to Dashboard</a>';
	else
		way2go = '<a class="nav-link" href="/">Back to Home</a>';

	const {uid :userid,blog_title,blog_content} = await showBlog(req.params.bid)
	res.render("read.html",{
		"blog_img":`../uploads/${userid}/${req.params.bid}`,
		"blog_title":blog_title,
		"blog_content":blog_content,
		"way2go":way2go
	});
	// If you want people to read without logging in.
	// else
	// 	res.send(alert.format("You are not logged in","login"))
})

app.get('/delete/:bid', async(req, res) => {
	if(req.session.userz != null){
		if((await showBlog(req.params.bid)).uid == req.session.uid){
			await deleteBlog(req.params.bid)
			res.redirect("/dashboard")
		}
		else
			res.send(alert.format("No impersonations, Go back to ur dashboard","dashboard"))
	}
	else
		res.send(alert.format("You are not logged in","login"))
})

app.get('/logout', (req, res) => {
	req.session.destroy()
	console.log("Cleared")
	res.redirect("/");
})

app.use((req, res) => {
    res.status(404).send(alert.format("Page not found",""));
})

app.listen(8080, () => {
	console.log('listening on port 8080');
})