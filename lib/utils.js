const utils = {
    connectToDatabase: async (mongoose, config) => {
        const dbPath = `mongodb+srv://${config.USER}:${config.PASS}@${config.HOST}/${config.DATABASE}?retryWrites=true&w=majority`;

        await mongoose.connect(dbPath, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        return mongoose.connection;
    }
};

module.exports = utils;
