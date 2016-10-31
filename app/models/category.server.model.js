var mongoose = require('mongoose'),
    ShortId = require('mongoose-shortid-nodeps'),
    Schema = mongoose.Schema;


var CategorySchema = new Schema({
    _id: {
        type: ShortId,
        len: 9,     // Length 7 characters
        base: 32,   // Web-safe base 64 encoded string
        alphabet: undefined, // Use default alphabet for base
        index: true
    },
    name: {
        type: String,
        unique: true,
        trim: true
    },
    description: {
        type: String,
        trim: true
    }
});

CategorySchema.path('name').validate(function (value, done) {
    this.model('Category').count({name: value}, function (error, count) {
        // Return false if an error is thrown or count > 0
        done(!(error || count));
    });
}, 'unique');

mongoose.model('Category', CategorySchema);