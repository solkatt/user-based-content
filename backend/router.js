const express = require('express');
const imageRouter = express.Router();
const mongoose = require('mongoose');
const Post = require('./models/post.model');


// exempel 5eb962bccbb814d0f3ceccff

module.exports = (upload, gfs) => {
    const url = 'mongodb://localhost:27017/co-op-forum';
    const connect = mongoose.createConnection(url, { useNewUrlParser: true, useUnifiedTopology: true });


    connect.once('open', () => {
        // initialize stream
        /*
        gfs = new mongoose.mongo.GridFSBucket(connect.db, {
            bucketName: "uploads"
        });
        */
    });

    /*
        POST: Upload a single image/file to Image collection
    */
    imageRouter.route('/upload')
        .post(upload.single('image'), (req, res, next) => {
            // check for existing images
            Post.findOne({})
                .then((image) => {
                    console.log(req.file);
                    if (image) {
                        return res.status(200).json({
                            success: false,
                            message: 'Image already exists',
                        });
                    }

                    let newImage = new Post({
                        name: req.file.originalname,
                    });

                    newImage.save()
                        .then((image) => {

                            res.status(200).json({
                                success: true,
                                image,
                            });
                        })
                        .catch(err => res.status(500).json(err));
                })
                .catch(err => res.status(500).json(err));
        })
        .get((req, res, next) => {
            Post.find({})
                .then(images => {
                    res.status(200).json({
                        success: true,
                        images,
                    });
                })
                .catch(err => res.status(500).json(err));
        });

    /*
        GET: Delete an image from the collection
    */
    imageRouter.route('/delete/:id')
        .get((req, res, next) => {
            Post.findOne({ _id: req.params.id })
                .then((image) => {
                    if (image) {
                        Post.deleteOne({ _id: req.params.id })
                            .then(() => {
                                return res.status(200).json({
                                    success: true,
                                    message: `File with ID: ${req.params.id} deleted`,
                                });
                            })
                            .catch(err => { return res.status(500).json(err) });
                    } else {
                        res.status(200).json({
                            success: false,
                            message: `File with ID: ${req.params.id} not found`,
                        });
                    }
                })
                .catch(err => res.status(500).json(err));
        });

    /*
        GET: Fetch most recently added record
    */
    imageRouter.route('/recent')
        .get((req, res, next) => {
            Post.findOne({}, {}, { sort: { '_id': -1 } })
                .then((image) => {
                    console.log(image)
                    res.status(200).json({
                        success: true,
                        image,
                    });
                })
                .catch(err => res.status(500).json(err));
        });

    /*
        GET: Fetches all the files in the uploads collection
    */
    imageRouter.route('/file')
        .get((req, res, next) => {
            console.log(gfs)
            /*
            gfs.find().toArray((err, files) => {
                if (!files || files.length === 0) {
                    return res.status(200).json({
                        success: false,
                        message: 'No files available'
                    });
                }
                console.log(files)
                files.map(file => {
                    if (file.contentType === 'image/jpeg' || file.contentType === 'image/png' || file.contentType === 'image/svg') {
                        file.isImage = true;
                    } else {
                        file.isImage = false;
                    }
                });*/
            res.status(200).send(
                readstream.pipe(res)
            );
            // console.log(readstream.pipe(res)

            
        });

    /*
        GET: Fetches a particular file by filename
    */
    imageRouter.route('/file/:filename')
        .get((req, res, next) => {
            gfs.find({ filename: req.params.filename }).toArray((err, files) => {
                if (!files[0] || files.length === 0) {
                    return res.status(200).json({
                        success: false,
                        message: 'No files available',
                    });
                }

                res.status(200).json({
                    success: true,
                    file: files[0],
                });
            });
        });

    /* 
        GET: Fetches a particular image and render on browser
    */
    imageRouter.route('/image/:filename')
        .get((req, res, next) => {
            gfs.find({ filename: req.params.filename }).toArray((err, files) => {
                if (!files[0] || files.length === 0) {
                    return res.status(200).json({
                        success: false,
                        message: 'No files available',
                    });
                }

                if (files[0].contentType === 'image/jpeg' || files[0].contentType === 'image/png' || files[0].contentType === 'image/svg+xml') {
                    // render image to browser
                    gfs.openDownloadStreamByName(req.params.filename).pipe(res);
                } else {
                    res.status(404).json({
                        err: 'Not an image',
                    });
                }
            });
        });

    /*
        DELETE: Delete a particular file by an ID
    */
    imageRouter.route('/file/del/:id')
        .post((req, res, next) => {
            console.log(req.params.id);
            gfs.delete(new mongoose.Types.ObjectId(req.params.id), (err, data) => {
                if (err) {
                    return res.status(404).json({ err: err });
                }

                res.status(200).json({
                    success: true,
                    message: `File with ID ${req.params.id} is deleted`,
                });
            });
        });

    return imageRouter;
};