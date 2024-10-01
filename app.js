let app = new Vue({
    el:'#app',
    data:{
        logo:"images/logo.png",
        searchData:'Hello',
        lessons:[],
        filterOption:'',
        sortOption:''
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
        },
        sort(){
            let sortedLessons = [...this.lessons];
            if(this.filterOption === '' || this.sortOption === '' ){
                Swal.fire({
                    title: 'Error',
                    text: 'You have to choose both a filter and sort option before confirming!',
                    icon: 'error'
                });
            } else if(this.filterOption === "subject"){

                sortedLessons.sort((a,b) => {
                    if (this.sortOption === "ascending"){
                        return a.subject.localeCompare(b.subject);
                    } else {
                        return b.subject.localeCompare(a.subject)
                    }
                });

            } else if(this.filterOption === "location"){
                sortedLessons.sort((a,b) => {
                    if (this.sortOption === "ascending"){
                        return a.location.localeCompare(b.location);
                    } else {
                        return b.location.localeCompare(a.location)
                    }
                });

            } else if(this.filterOption === "price"){
                sortedLessons.sort((a,b) => {
                    if(this.sortOption === "ascending"){
                        return a.price - b.price; //ascending
                    } else {
                        return b.price - a.price; //descending
                    }
                })
            } else if(this.filterOption === "spaces"){
                sortedLessons.sort((a,b) => {
                    if(this.sortOption === "ascending"){
                        return a.spaces - b.spaces; //ascending
                    } else {
                        return b.spaces - a.spaces; //descending
                    }
                })
            }

            this.lessons = sortedLessons;
        }

    },
    computed:{
    
    },
    mounted(){
        this.getLessons();
         //this will fetch lessons when the app loads or reloads
    },

})
