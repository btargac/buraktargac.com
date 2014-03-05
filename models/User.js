module.exports = function (mongoose) {
            var Schema = mongoose.Schema,
                UserSchema;

    UserSchema = new Schema({
        username:{
            type:String,
            required:true
        },
        password:{
            type:String,
            required:true
        }    
    });

    return mongoose.model('User', UserSchema);
}