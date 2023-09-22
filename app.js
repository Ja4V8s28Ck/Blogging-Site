import {credModel,blogModel} from './server.js';
import { nanoid } from 'nanoid'
import bcrypt from "bcryptjs"

function isExist(jsonstr){
  return credModel.exists(jsonstr).exec();
}

function showStuff(uid){
  return credModel.findOne({_id:uid}).exec();
}

function showStuffs(uid){
  return blogModel.find({uid:uid}).sort({ ts: 'desc'}).exec();
}

function showBlog(bid){
  return blogModel.findOne({_id:bid}).exec();
}

function createBlog(uid){
  return blogModel({
  "_id" : nanoid(),
  "uid": uid,
  "ts": new Date().getTime(),
  "blog_title":"Add a title",
  "blog_content":"Type the blog content here"
  }).save().then((data)=> data._id.toString());
}

function saveBlog(bid,jsonstr){
  return blogModel.findByIdAndUpdate(bid).set(jsonstr).exec();
}

function deleteBlog(bid){
  return blogModel.deleteOne({_id:bid});
}

async function hasher(paswd){
  return await bcrypt.hash(paswd,4);
  // return Bun.password.hashSync(paswd, {algorithm: "bcrypt",cost:4});
}

async function isHashMatch(paswd,hash){
  return await bcrypt.compare(paswd, hash);
  // return Bun.password.verifySync(paswd, hash);
}

async function createBlogList(uid){
  const lst = await showStuffs(uid);
  var html = ""
  var trim = ""
  //  Should i add??  style="height: 200px;"
  for(var i = 0;i < lst.length;i++){
    trim = lst[i].blog_content.match(/\b\w+\b/g)
    trim = trim.length <= 6  ? lst[i].blog_content.toString() : trim.slice(0,6).join(' ');
    html +=  '<div class="col-4 p-3"><div class="card border border-5 border-dark">'
    html += `<img src="uploads/${lst[i].uid}/${lst[i]._id}" class="border border-5 border-dark" alt="">`
    html += `<div class="card-body"><h5 class="card-title">${lst[i].blog_title}</h5>`
    html += `<p class="card-text">${trim}</p>`
    html += `<a href="/edit/${lst[i]._id}" class="btn btn-success rounded m-1">Edit</a>`
    html += `<a href="/read/${lst[i]._id}" class="btn btn-primary rounded m-1">Read</a>`
    html += `<a href="/delete/${lst[i]._id}" class="btn btn-danger rounded m-1">Delete</a>`
    html += "</div></div></div>"
  }
  return html;
}

async function createBlogHome(){
  const lst = await blogModel.find().sort({ ts: 'desc'}).exec();
  var html = ""
  var trim = ""
  if(lst.length == 0){
    html = '<div class="row gx-5 my-5"><h5>Be the first to post a blog</h5</div>'
  }
  for(var i = 0;i < lst.length;i++){
    trim = lst[i].blog_content.match(/\b\w+\b/g)
    trim = trim.length <= 69  ? lst[i].blog_content.toString() : trim.slice(0, 69).join(' ');
    html += '<div class="row gx-5 my-5"><div class="col">'
    html += `<img src="uploads/${lst[i].uid}/${lst[i]._id}" class="rounded-4 card-img">`
    html += `</div><div class="col"><h4>${lst[i].blog_title}</h4>`
    html += `<p class="jtfy">${trim} `
    html += `<a class="text-primary" href="/read/${lst[i]._id}">Read more</a></p></div></div>`
  }
  return html;
}

export {
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
}