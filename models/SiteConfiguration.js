module.exports = function (mongoose) {
            var Schema = mongoose.Schema,
                SiteConfiguration,
                PortfolioSchema,
                TestimonialSchema;

    PortfolioSchema = new Schema({
        company:{
            type:String,
            required:true
        },
        definition:{
            type:String,
            required:true
        },
        imgUrl:{
            type:String,
            required:true
        },
        detailPageUrl:{
            type:String,
            required:false
        }
    });

    TestimonialSchema = new Schema({
        author:{
            type:String,
            required:true
        },
        text:{
            type:String,
            required:true
        }    
    });

    SiteConfiguration = new Schema({
        title:{
            type:String,
            required:true
        },
        fblink:{
            type:String,
            required:true
        }
        ,
        twlink:{
            type:String,
            required:true
        }
        ,
        gplink:{
            type:String,
            required:true
        }
        ,
        lilink:{
            type:String,
            required:true
        }
        ,
        ytlink:{
            type:String,
            required:true
        },
        portfolios: [PortfolioSchema],
        testimonials: [TestimonialSchema]
    });
    
    var TestimonialModel = mongoose.model('Testimonial', TestimonialSchema),
        PortfolioModel = mongoose.model('Portfolio', PortfolioSchema);
    return mongoose.model('SiteConfiguration', SiteConfiguration);
}