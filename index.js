const express = require('express')
const methodOverride = require('method-override');
const mongoose = require('mongoose');
const path = require('path');
const ejsMate = require('ejs-mate');
const Campground = require('./models/campground'); //引用的语法是这样的，要用哪个文件，把它引用进来


const app = express()

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

//todo 加入打日志的中间件！！！

app.engine('ejs', ejsMate);
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))
//原本在哪个路径下运行，就会去那个路径的view里面找，但这个让找的路径固定到当前文件路径+views下
app.use(express.json()) // for parsing application/json
app.use(express.urlencoded({ extended: true })) // for parsing the body, 如何知道这些具体的配置？
app.use(methodOverride('_method')); //这里是设定了需要overide的变量名，传入url的里面哪一个overide了method


app.get('/', (req, res) => {
    res.render('home')
});

app.get('/campgrounds', async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', { campgrounds });
})

app.get('/campgrounds/new', (req, res) => {
    res.render('campgrounds/new');
})

//他也不是一步做出来的，先写死了一个campground的结构体，测试一下保存再render，而且在db里面看了是否保存上了，可以的话再进行下一步
//？？？因为http请求方法不同，可以共用一个url，但是为什么不加new或者什么的，就直接post呢？
app.post('/campgrounds', async (req, res) => {
    const campground = new Campground(req.body.campground);
    //这里之所以出了好多问题，是因为没有理解，get的参数是放在param里的，而post是放在body里的！！
    await campground.save();
    res.redirect(`/campgrounds/${campground._id}`);
    //???下划线是什么意思,如何知道是get？
})
//todo 有的图片显示不出来，似乎是格式的问题

app.get('/campgrounds/:id', async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    res.render('campgrounds/show', { campground });
})

app.get('/campgrounds/:id/edit', async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    res.render('campgrounds/edit', { campground })
})

app.put('/campgrounds/:id', async (req, res) => {
    const { id } = req.params
    const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground });
    // ... spread the object in the body to the new object
    res.redirect(`/campgrounds/${campground._id}`)
})

app.delete('/campgrounds/:id', async (req, res) => {
    const { id } = req.params;
    console.log(`delete campground id ${id}`)
    await Campground.findByIdAndDelete(id);
    res.redirect('/campgrounds');
})




//todo 如果不是主页面进去的，链接进去的，也要加路径吗？似乎是要的？这里规定了每条
//路径走到哪个页面，然后原本的页面只能进入那个页面的一个入口



app.listen(8080, () => {
    console.log(`Serving listening at http://localhost:8080`)
})