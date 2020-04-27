'use strict';

module.exports = function(Image) {

  // Operation hook
  Image.observe('before save', function(context, next) {
    if (context.instance) context.instance.updated = new Date();
    next();
  });

  // Virtual property added
  Image.afterRemote('findById', function(context, image, next) {
    image.copyright = 'This image is under copyright.';
    next();
  });

  // RemoteMethod call - custom method added
  Image.isFree = function(id, cb) {
    Image.findById(id, function(err, image) {
      if (err) return cb('error', null);
      if (!image) return cb('Image not found', null);
      let _isfree = false;
      if (image.comments == 'Test') {
        _isfree = true;
        cb(null, _isfree);
      }
    });
  };

  Image.remoteMethod('isFree', {
    accepts: {arg: 'id', type: 'any'},
    returns: {arg: 'isFree', type: 'boolean'}
  });

  // Add validation
  Image.validatesNumericalityOf('likes', {int: true});
  Image.validate('likes', function(err) {
    if (this.likes < 3) err();
  }, {message: 'Must be a positive number.'});
};
