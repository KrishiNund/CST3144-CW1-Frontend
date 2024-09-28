let app = new Vue({
    el:'#app',
    data:{
        logo:"images/logo.png",
        searchData:'Hello',
        lessons:[]
    },
    methods:{
        // setBackgroundColor(lesson){
        //     switch(lesson.subject){
        //         case "Maths":
        //             return{
        //                 backgroundImage:"url('images/icons8-maths-64.png')",
        //                 backgroundSize:'cover',
        //                 backgroundPosition:'center'
        //             };
                    
        //     }
        // }    

        //fetch get
        getLessons(){
            fetch('/api/lessons', {
                method:'GET',
                credentials:"include",
                headers:{
                    'Content-Type':'application/json'
                }
            })
            .then(response => response.json())
            .then(data => {
                lessons = data;
                // const status = data.message;
                // const username = data.data;
                
                // const sessionUsername = document.getElementById("sessionUsername");
                // const userStatus = document.getElementById("userStatus");
        
                // sessionUsername.innerHTML = `Username: ${username}`;
                // userStatus.innerHTML =`Status:${status}`;  
            }); 
        }
    },
    mounted(){
        this.getLessons(); //this will fetch lessons when the app loads or reloads
    },

})
