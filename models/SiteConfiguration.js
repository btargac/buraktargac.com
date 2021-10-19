module.exports = mongoose => {
    const Schema = mongoose.Schema;

    const PortfolioSchema = new Schema({
        company: {
            type:String,
            required:true
        },
        definition: {
            type:String,
            required:true
        },
        detailPageUrl: {
            type:String,
            required:false
        },
        detailPageImages: [String]
    });

    const TestimonialSchema = new Schema({
        author: {
            type: String,
            required: true
        },
        text: {
            type: String,
            required: true
        }    
    });

    const SiteConfiguration = new Schema({
        title: {
            type: String,
            required: true
        },
        githublink: {
            type: String,
            required: true
        },
        fblink: {
            type: String,
            required: true
        },
        twlink: {
            type: String,
            required: true
        },
        lilink: {
            type: String,
            required: true
        },
        ytlink: {
            type: String,
            required: true
        },
        portfolios: [PortfolioSchema],
        testimonials: [TestimonialSchema]
    });

    return mongoose.model('SiteConfiguration', SiteConfiguration);
};
