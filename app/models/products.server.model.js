var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    ShortId = require('mongoose-shortid-nodeps'),
    Category = mongoose.model('Category');

var ProductSchema = new Schema({
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
    },
    price: {
        type: Number,
        default: 0
    },
    stock: {
        type: Number,
        default: 0
    },
    imgURL: {
        type: String,
        trim: true
    },
    category: {
        type: Schema.Types.ObjectId,
        ref: Category
    }
});

ProductSchema.path('name').validate(function (value, done) {
    this.model('Product').count({name: value}, function (error, count) {
        // Return false if an error is thrown or count > 0
        done(!(error || count));
    });
}, 'unique');

mongoose.model('Product', ProductSchema);