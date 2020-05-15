# Co-op Forum!
This is a simple forum exploring the MERN stack. The content on the site is user based meaning every post is created, updated and removed by the author/logged in user. On the frontend-side, the client can register a new user, log in, create a post and attach an image, post to the forum, update the post, remove the post and log out. Every CRUD-change is updated and saved in the database.

Other packages used are bcrypt for encrypting passwords, multer for handling binary data and gridfs for saving image (binary data) in mongoDB

## Available endpoints
* POST http://{host}:{port}/api/account/signup Sign up.
* POST http://{host}:{port}/api/account/signin Sign in.
* GET http://{host}:{port}/api/account/verify Verify user token.
* GET http://{host}:{port}/api/account/logout Log out.
* DELETE http://{host}:{port}/"/api/post/remove/:id Delete post by ObjectId.
* POST http://{host}:{port}/api/post/new Create and save post to mongoDB
* GET http://{host}:{port}/api/post/all Get all saved posts in database.
* GET http://{host}:{port}/api/post/image/:filename Get saved image by saved filename.


## How to run
1. Download/Fork project
2. Open project folder in IDE and run `npm i` or `npm install`
3. Run `npm run watch` to run the dev server
4. Go to http://localhost:3000/ or the link showing up in the terminal.
5. Have fun!