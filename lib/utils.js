const utils = {
    connectToDatabase: (mongoose, config, cb) => {
        const dbPath = `mongodb://${config.USER}:${config.PASS}@${config.HOST + ((config.PORT.length > 0) ? ":" : "")}${config.PORT}/${config.DATABASE}`;

        return mongoose.connect(dbPath, {
            useNewUrlParser: true
        }, cb);
    }
};

module.exports = utils;
