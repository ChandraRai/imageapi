// Copyright IBM Corp. 2016,2019. All Rights Reserved.
// Node module: loopback-workspace
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

'use strict';

module.exports = function(server) {
  // Install a `/` route that returns server status
  const router = server.loopback.Router();
  // router.get('/', server.loopback.status());
  router.get('/', function(req, res) {
    res.json({'hello': 'world!', 'welcome to': 'imageapi',
      'created_by': 'Chandra', 'time:': Date()});
  });
  server.use(router);
};
