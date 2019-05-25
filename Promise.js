var p1 = new Promise(
    (resolve, reject) => {
        console.log("프라미스 함수제작");   
        //0.5초 뒤에 콘솔에 찍습니다.
        setTimeout(
            () => {
                //프라미스 이행 될때 실행할 부분을 resolve로 적습니다.
                resolve({ p1 : "^_^" });
            }, 500 );
    }
);


var p2 = new Promise(
    (resolve, reject) => {
        console.log("프라미스 함수제작");
        //0.3초뒤에 콘솔에 찍는다.
        setTimeout(
            function() {
                // resolve({p2:"-.-"});    //위 resolve 변수와 일치
                reject()    //error 처리할떄 사용, 뒤를 실행안함.
            }, 300);
    }
);

//배열로 받음,  전부 가져올때
Promise.all([p1,p2]).then( (result) =>{
    console.log(result);
    console.log( "p1 = " + result[0].p1);   //result[0] : p1
    console.log( "p2 = " + result[1].p2);   //result[1] : p2
});

// p1.then( result => {
//     console.log("p1 = " + result.p1);
//     return p2;  //promise객체로 넘겨줘야 뒤에 .then 사용가능
// }).then( result =>{
//     console.log("p2 = " + result.p2);
// })

// p2.then( (result)=>{
//     console.log(result.p2)    
// })