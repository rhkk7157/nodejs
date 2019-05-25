//admin 이후 url은 다여기로 ex) '/products' 면 admin/products url 이다. 
//admin 경로 안에 있는건 여기서 계속 하면된다.

const express = require('express');
const router = express.Router();
const models = require('../models');
// csrf 셋팅
const csrf = require('csurf');
const csrfProtection = csrf({ cookie: true });

//이미지 저장되는 위치 설정
const path = require('path');
const uploadDir = path.join( __dirname , '../uploads' ); // 루트의 uploads위치에 저장한다.
const fs = require('fs');

//multer 셋팅
const multer  = require('multer');
const storage = multer.diskStorage({
    destination :  (req, file, callback) => { //이미지가 저장되는 도착지 지정
        callback(null, uploadDir );
    },
    filename :  (req, file, callback) => { // products-날짜.jpg(png) 저장 
        callback(null, 'products-' + Date.now() + '.'+ file.mimetype.split('/')[1] );
    }
});
const upload = multer({ storage: storage });

// function loginR(req,res,next) {
//     if(로그인 == true) {
//         next();
//     }else{
//         res.redirect(메인페이지);
//     }
// }

router.get('/',function(req, res){
    res.send('admin app입니다.');
});
//리스트를 불러옴.
router.get( '/products' , async ( _ ,res) => {    //_는 사용하지 않는 변수

    try {

        const products = await models.Products.findAll();   //promise객체를 받는애들을 await할수잇음.
        res.render( 'admin/products.html' ,{ products });   //{} 변수명뿌릴떄,템플릿이후경로를 적어준다.

    } catch (e) {
        
    }
   
});


router.get('/products/write', csrfProtection,(req,res) => {
    res.render( 'admin/form.html' , { csrfToken : req.csrfToken() });
});

router.post('/products/write', upload.single('thumbnail'), csrfProtection, async (req,res) => {
    try {
        req.body.thumbnail = (req.file) ? req.file.filename : "";
        await models.Products.create(req.body);
        res.redirect('/admin/products');
    } catch (e) {
        console.log(e);
    }
});

//상세페이지, 제품하나일때 findone() , 딱하나만 findBypk(), :id url에서 변수 받아올떄 req.params.id로 쓸수있다.
router.get('/products/detail/:id' , async (req, res) => {

    try {
        const product = await models.Products.findOne({
            where : {
                id : req.params.id
            },
            include : [
                'Memo'  //조인되서나옴.
            ]
        });
        res.render('admin/detail.html', {product});
    } catch (error) {
        
    }
    // models.Products.findByPk(req.params.id).then( (product) => {
    //     res.render('admin/detail.html', { product });  
    // });
});

// 메모저장
router.post('/products/detail/:id' , async(req, res) => {

    try{
  
        const product = await models.Products.findByPk(req.params.id);
        // create + as에 적은 내용 ( Products.js association 에서 적은 내용 )
        await product.createMemo(req.body)
        res.redirect('/admin/products/detail/'+req.params.id);  

    }catch(e){
        // console.log(e)
    }

    
});

//수정 form.html에 product를 보내준다.
router.get('/products/edit/:id' , csrfProtection, (req, res) => {
    //기존에 폼에 value안에 값을 셋팅하기 위해 만든다.
    models.Products.findByPk(req.params.id).then( (product) => {
        res.render('admin/form.html', { 
            product,
            csrfToken : req.csrfToken() 
         });
    });
});

//수정 후 저장 클릭하면
router.post('/products/edit/:id', upload.single('thumbnail') , csrfProtection , async(req, res) => {

    try{
        // 이전에 저장되어있는 파일명을 받아오기 위함
        const product = await models.Products.findByPk(req.params.id);

        if(req.file && product.thumbnail) {  //요청중에 파일이 존재 할시 이전이미지 지운다.
            fs.unlinkSync( uploadDir + '/' + product.thumbnail );   //db에 있는 파일 삭제 
        }

        // 파일요청이면 파일명을 담고 아니면 이전 DB에서 가져온다
        req.body.thumbnail = (req.file) ? req.file.filename : product.thumbnail;
        
        await models.Products.update(
            req.body , 
            { 
                where : { id: req.params.id } 
            }
        );
        res.redirect('/admin/products/detail/' + req.params.id );

    }catch(e){

    }

});
// router.post('/products/edit/:id' , upload.single('thumbnail') ,(req, res) => {

//     models.Products.update(
//         {
//             name : req.body.name,
//             price : req.body.price ,
//             description : req.body.description
//         }, 
//         { 
//             where : { id: req.params.id } 
//         }
//     ).then( () => {
//         res.redirect('/admin/products/detail/' + req.params.id );
//     });

// });

//삭제
router.get('/products/delete/:id', (req, res) => {
    models.Products.destroy({
        where: {
            id: req.params.id
        }
    }).then(function() {
        res.redirect('/admin/products');
    });
});

//삭제후 상세페이지로 옴.
router.get('/products/delete/:product_id/:memo_id', async(req, res) => {

    try{

        await models.ProductsMemo.destroy({
            where: {
                id: req.params.memo_id
            }
        });
        res.redirect('/admin/products/detail/' + req.params.product_id );

    }catch(e){

    }

});
module.exports = router;