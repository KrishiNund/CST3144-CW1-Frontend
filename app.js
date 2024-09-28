let app = new Vue({
    el:'#app',
    data:{
        logo:"images/logo.png",
        searchData:'Hello',
        lessons:[
            {
                subject:"Maths",
                location:"CG02",
                price:"$100",
                spaces:5,
                icon: "images/maths_icon.png"
            },
            {
                subject:"French",
                location:"BG01",
                price:"$120",
                spaces:10,
                icon:"images/french_icon.png"
            },
            {
                subject:"English",
                location:"EF04",
                price:"$120",
                spaces:12,
                icon:"images/english_icon.png"
            },
            {
                subject:"Computer Science",
                location:"BG04",
                price:"$150",
                spaces:4,
                icon:"images/cs_icon.png"
            },
            {
                subject:"History",
                location:"EF01",
                price:"$80",
                spaces:5,
                icon:"images/history_icon.png"
            },
            {
                subject:"Maths",
                location:"CG02",
                price:"$100",
                spaces:5,
                icon: "images/maths_icon.png"
            },
            {
                subject:"French",
                location:"BG01",
                price:"$120",
                spaces:10,
                icon:"images/french_icon.png"
            },
            {
                subject:"English",
                location:"EF04",
                price:"$120",
                spaces:12,
                icon:"images/english_icon.png"
            },
            {
                subject:"Computer Science",
                location:"BG04",
                price:"$150",
                spaces:4,
                icon:"images/cs_icon.png"
            },
            {
                subject:"History",
                location:"EF01",
                price:"$80",
                spaces:5,
                icon:"images/history_icon.png"
            },
        ]
    },
    // methods:{
    //     setBackgroundColor(lesson){
    //         switch(lesson.subject){
    //             case "Maths":
    //                 return{
    //                     backgroundImage:"url('images/icons8-maths-64.png')",
    //                     backgroundSize:'cover',
    //                     backgroundPosition:'center'
    //                 };
                    
    //         }
    //     }    
    // }

})
