let app = new Vue({
    el:'#app',
    data:{
        logo:"images/logo.png",
        searchData:'Hello',
        lessons:[],
    },
    methods:{
        //fetch get
        getLessons(){
            fetch('http://localhost:3000/api/lessons', {
                method:'GET',
                headers:{
                    'Content-Type':'application/json'
                }
            })
            .then(response => response.json())
            .then(data => {
                this.lessons = data.data;
                console.log(this.lessons);
            })
            .catch(err => console.log("Error fetching lessons: ", err));
        }
    },
    mounted(){
        this.getLessons(); //this will fetch lessons when the app loads or reloads
    },

})
