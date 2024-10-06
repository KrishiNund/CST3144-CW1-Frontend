let app = new Vue({
    el:'#app',
    data:{
        logo:"images/logo.png",
        searchData:'Hello',
        lessons:[],
        filterOption:'',
        sortOption:'',
        cartArray: [],
        available:true,
        checkoutNotAllowed:true,
        onLessonPage:true,
        clientName:'',
        phoneNumber:'',
        searchBarQuery:''

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
        },

        addToCart(lesson){
            this.cartArray.push(lesson);
            let newLessonSpace = lesson.spaces--;
            console.log(newLessonSpace);
        },

        goToCheckoutPage(){
            if(this.cartArray.length > 0 && this.onLessonPage){
                this.onLessonPage = false;
                this.checkoutNotAllowed = false;
            } 
            else if(this.cartArray.length >=0 && this.onLessonPage == false){
                this.onLessonPage = true;
                this.checkoutNotAllowed = true;
            }
        },

        removeItemFromCart(lesson){
            let newLessonSpace = lesson.spaces++;
            let indexToBeRemoved = this.cartArray.findIndex(item => item.subject === lesson.subject && item.spaces === lesson.spaces);

            if (indexToBeRemoved !== -1){
                this.cartArray.splice(indexToBeRemoved,1);
            }
            
            console.log(this.cartArray);
        },

        updateLesson(){

            let lessonSet = new Set(this.cartArray);

            for (let lesson of lessonSet){
                updateDetails = {
                    "subject": lesson.subject,
                    "value":lesson.spaces,
                    "attribute": "spaces"
                };

                fetch('http://localhost:3000/api/updateLesson', {
                    method:'PUT',
                    headers:{
                        'Content-Type':'application/json'
                    },
                    body:JSON.stringify(updateDetails)
                })
                .then(response => response.json())
                .then(data => {
                    if (data.message === "Lesson Updated Successfully"){
                        console.log("Updated");
                        this.getLessons();
                        this.cartArray = [];
                        this.checkoutNotAllowed = true;
                        
                    } else {
                        console.log("Not updated");
                        this.getLessons();
                        this.cartArray = [];
                        this.checkoutNotAllowed = true;
                    }
                })
            }
            
        },

        checkout(){
            const orderDetails = {
                "name":this.clientName,
                "phoneNumber":this.phoneNumber,
                "order":this.cartArray
            };

            fetch('http://localhost:3000/api/orders', {
                method:'POST',
                headers:{
                    'Content-Type':'application/json'
                },
                body:JSON.stringify(orderDetails)
            })
            .then(response => response.json())
            .then(data => {
                if (data.message === "Order Created Successfully"){
                    Swal.fire({
                        title: "Order Successful",
                        text:"Order has been confirmed!",
                        icon:"success", 
                        showCloseButton: true,
                        willClose: () => {
                            this.updateLesson();
                            //reset input fields
                            this.clientName = '';
                            this.phoneNumber = '';
                        }
                    });
                } else {
                    Swal.fire({
                        title: "Order Unsuccessful",
                        text:"Unfortunately the order could not be placed!",
                        icon:"error", 
                        showCloseButton: true,
                        willClose: () => {
                            this.cartArray = [];
                            this.checkoutNotAllowed = true;
                            //reset input fields
                            this.clientName = '';
                            this.phoneNumber = '';
                        }
                    });

                }
            })
        },

        getFilteredLessons(){
            //to ensure special characters are handled correctly in URLs
            const encodedQuery = encodeURIComponent(this.searchBarQuery);

            fetch(`http://localhost:3000/api/search?query=${encodedQuery}`, {
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
    computed:{
        numberItemsInCart(){
            return this.cartArray.length || 0;
        },

        checkIfLettersOnly(){
            let regex = /^[A-Za-z]+$/;
            return regex.test(this.clientName);
        },

        checkIfNumbersOnly(){
            let regex = /^[0-9]+$/;
            return regex.test(this.phoneNumber);
        },

    },
    mounted(){
        //to fetch the lessons when the app loads or reloads
        this.getLessons();
    },

})
