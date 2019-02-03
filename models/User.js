module.exports = mongoose => {
    const Schema = mongoose.Schema;
    const UserSchema = new Schema({
        username: {
            type: String,
            required: true
        },
        password: {
            type: String,
            required: true
        }
    });

    return mongoose.model('User', UserSchema);
};
