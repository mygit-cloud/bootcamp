const mongoose = require('mongoose');
const Campground = require('../models/campground');
const { descriptors, places } = require('./seedHelper')
const { cities } = require('./cities') //输出的代码要export，这边要引用

mongoose.connect('mongodb://localhost:27017/test1'), {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true //没太弄懂是干什么的配置，老师也没怎么讲。但是如果不装的话就会有警告
};

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

//简单函数可以用这种方式来写
const getRandomItem = (array) => array[Math.floor(Math.random() * array.length)];


const seedDB = async () => {
    await Campground.deleteMany({}); //只有await了才删除，但是是为什么呢？如果没有的话，不也是启动了吗？
    for (let i = 0; i < 50; i++) {
        const newCamp = new Campground({
            title: `${getRandomItem(descriptors)} ${getRandomItem(places)}`,
            location: `${getRandomItem(cities)["city"]}, ${getRandomItem(cities)["state"]}`
        });
        await newCamp.save();
    }
}

seedDB()