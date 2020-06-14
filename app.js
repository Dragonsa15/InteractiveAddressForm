var mongoose       = require('mongoose');
var bodyParser     = require('body-parser');
var express        = require('express');
var app            = express();
var config         = require('./config');
var nodeGeocoder   = require('node-geocoder');
var Addr           = require('./models/Address')

var options = {
    provider: 'openstreetmap'
};

let geoCoder = nodeGeocoder(options);


app.set('view engine', 'ejs');
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended : true}));

mongoose.connect(config.database,{useUnifiedTopology: true,useNewUrlParser: true },err => {
    if(err) {
        console.log(err);
    }
    else {
        console.log("Conneted to database");
    }
})

app.get("/",(req,res) => {
    res.render('landing');
});
app.get("/new",(req,res) => {
    res.render('AddressForm',{accessToken1 : config.MapTilesToken , accessToken2 : config.AutocompleteToken , appId: config.AlgoliaAppId});
});

app.post("/",(req,res) => {
    Addr.create(req.body.address , function(err,AddedAddr) {
        if(err)
            res.render('AddressForm',{accessToken1 : config.MapTilesToken , accessToken2 : config.AutocompleteToken , appId: config.AlgoliaAppId});
        else
            console.log(AddedAddr);
            res.redirect('/');
            
    });
})
app.get("/address",(req,res) => {
    Addr.find({},function(err,address) {
        if(err)
            console.log(err);
        else
            //console.log(address);
            res.render('address', {address : address});
    })
});



app.listen('3030',function() {
    console.log("Listening on port 3030");
});