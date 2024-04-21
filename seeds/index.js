// Require Modules
const mongoose = require('mongoose');
const cities = require('./cities');
const { descriptors, places } = require('./seedHelpers');
const Campground = require('../models/campground');


// Connect Mongo DB
mongoose.connect('mongodb://127.0.0.1:27017/yelp-camp', { useNewUrlParser: true, useUnifiedTopology: true})
    .then(() => {
        console.log('MongoDB Connection Success!!!');
    })
    .catch((err) => {
        console.log('MongoDB Connection Failure...');
        console.log(err);
    });

// Seed DB
const sample = array => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
    await Campground.deleteMany({});
    for(let i=0; i<20; i++){
        const randomCityIndex = Math.floor(Math.random() * cities.length);
        const price = Math.floor(Math.random() * 2000) + 1000;
        const camp = new Campground({
            author: '64d3d209f53ad70be44bd0a7',
            location: `${cities[randomCityIndex].prefecture}, ${cities[randomCityIndex].city}`,
            title: `${sample(descriptors)}, ${sample(places)} `,
            description: 'しかし、私はあなたに喜びを非難し、痛みを賞賛するというこの誤った考えがどのように生まれたかを説明しなければなりません、そして私はあなたにシステムの完全な説明を与え、真実の偉大な探検家、人間の幸福のマスタービルダー。快楽そのものを拒絶したり、嫌ったり、避けたりする人は誰もいません。なぜなら、それは快楽だからですが、快楽を追求する方法を知らない人は、非常に苦痛な結果に合理的に遭遇するからです。それは痛みであるため、それ自体の痛みを追求または望んでいますが、時折、苦痛と痛みが彼に大きな喜びをもたらす状況が発生します。それから？しかし、迷惑な結果をもたらさない喜びを楽しむことを選択した人、または結果として生じる喜びを生み出さない痛みを回避する人との過ちを見つける権利は誰にありますか？',
            price,
            images: [
                {
                  url: 'https://res.cloudinary.com/dcoww3nza/image/upload/w_200/v1693632371/YelpCamp/eszt5ixlgkvfb66kbxyg.jpg',
                  filename: 'YelpCamp/eszt5ixlgkvfb66kbxyg'
                },
                {
                  url: 'https://res.cloudinary.com/dcoww3nza/image/upload/w_200/v1693632489/YelpCamp/fsjj4sucde0cxycxkh4l.jpg',
                  filename: 'YelpCamp/fsjj4sucde0cxycxkh4l'
                }
            ]
        });
        await camp.save();
    }
}

seedDB()
    .then( () => {
        mongoose.connection.close();
        console.log('MongoDB Close Success!!!');
    })
    .catch( () => {
        console.log('MongoDB Close Failure...');
    });