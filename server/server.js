// Copyright IBM Corp. 2016,2019. All Rights Reserved.
// Node module: loopback-workspace
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

'use strict';

const loopback = require('loopback');
const boot = require('loopback-boot');
const express = require('express');
const multer = require('multer');
const path = require('path');

const app = module.exports = loopback();

// image storage
const storage = multer.diskStorage({
  // for local
  destination: './upload',
  // destination: 'https://imageapis.herokuapp.com/imageurl',
  filename: (req, file, cb)=> {
  // eslint-disable-next-line max-len
    return cb(null, `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`);
  },
});

// upload
const upload = multer({
  storage: storage,
});

app.use('/imageurl', express.static('./upload'));
// route
// eslint-disable-next-line max-len
app.post('/api/images/upload', upload.single('image_file'), (req, res) => {
  res.json({
    success: 1,
    imageurl: `https://imageapis.herokuapp.com/imageurl/${req.file.filename}`,
  });
});

app.start = function() {
  // start the web server
  return app.listen(function() {
    app.emit('started');
    const baseUrl = app.get('url').replace(/\/$/, '');
    console.log('Web server listening at: %s', baseUrl);
    if (app.get('loopback-component-explorer')) {
      const explorerPath = app.get('loopback-component-explorer').mountPath;
      console.log('Browse your REST API at %s%s', baseUrl, explorerPath);
    }
  });
};

// Bootstrap the application, configure models, datasources and middleware.
// Sub-apps like REST API are mounted via boot scripts.
boot(app, __dirname, function(err) {
  if (err) throw err;

  // start the server if `$ node server.js`
  if (require.main === module)
    app.start();
});
