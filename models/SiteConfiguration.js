module.exports = function (mongoose) {
            var Schema = mongoose.Schema,
                SiteConfiguration, Testimonial;

    Testimonial = new Schema({
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
        testimonials: [Testimonial]
    });
    var TestimonialModel = mongoose.model('Testimonial', Testimonial);
    return mongoose.model('SiteConfiguration', SiteConfiguration);
}