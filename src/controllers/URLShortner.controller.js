const {
UrlShortner
} = require("../sequelize");

const constants = require("../utils/constants");

const Joi = require("Joi");
const {
  isEmpty,
} = require("../utils/utils");

exports.URLShortnerView = async (req, res) => {
    try { 
      let csrftoken = req.csrfToken()
        res.render('URLShortner/urlShortnerHomeView',{csrftoken:csrftoken});
    } catch (err) {
      return res.status(400).send({
        message: err.message || "something went wrong",
      });
    }
  };

//create unique id for shortend url store in database if does not exists in database
exports.URLShortnerCreate = async (req, res) => {
    try { 
      let urlInput=req.body.urlInput
      const URLValidaterSchema = Joi.object().keys({
        urlInput: Joi.string().uri().required()
        .error((errors) => {
          errors.forEach((err) => {
            switch (err.code) {
              case "string.empty":
                err.message = `URL is required`;
                break;
              case "string.uri":
              err.message = `Invalid URL`;
              break;
              default:
                break;
            }
          });
          return errors;
        }),
      });
      let URLData = {
        urlInput: urlInput,
      };
      
      const resultURLData =
        URLValidaterSchema.validate(URLData);
        let urlSContext={}
        let csrftoken = req.csrfToken()
      if (!resultURLData.error) {
        let urlShortner=await UrlShortner.findOne({where:{url_field:urlInput}})
        if(!urlShortner){
          let uniqueId=Math.random().toString(36).slice(2, 10);

          let existingUnique=await UrlShortner.findOne({where:{unique_id:uniqueId}})
          while(existingUnique.unique_id==uniqueId){
            uniqueId=Math.random().toString(36).slice(2, 10);
            urlShortner=await UrlShortner.create({
              click_count:0,
              unique_id:uniqueId,
              url_field:urlInput,
              status:constants.ACTIVE
            })
            break;
          }
          
          
        }
        urlSContext={url_field:urlShortner.url_field,unique_id:urlShortner.unique_id,csrftoken:csrftoken}
        return res.render('URLShortner/urlShortnerHomeView',urlSContext);
      }else{

        urlSContext={  errMessage: {
          [resultURLData.error.details[0].path]:
          resultURLData.error.details[0].message.replace(/[^\w\s]/gi, ""),
        },csrftoken:csrftoken}

        return res.render('URLShortner/urlShortnerHomeView',urlSContext);
      }
    
    } catch (err) {
      console.log(err);
      return res.status(400).send({
        message: err.message || "something went wrong",
      });
    }
  };


  exports.URLShortnerRead = async (req, res) => {
    try { 
      let uniqueId=req.params.uniqueId;
      let urlShortner=await UrlShortner.findOne({where:{unique_id:uniqueId}})
      if(urlShortner){
        await urlShortner.update({click_count:urlShortner.click_count+1})
        return res.redirect(urlShortner.url_field);
      }
      
      return res.render('URLShortner/urlShortnerHomeView',urlSContext);
    } catch (err) {
      return res.status(400).send({
        message: err.message || "something went wrong",
      });
    }
  };

  exports.URLShortnerRedirect = async (req, res) => {
    try { 
      return res.redirect('/');
    } catch (err) {
      return res.status(400).send({
        message: err.message || "something went wrong",
      });
    }
  };
  