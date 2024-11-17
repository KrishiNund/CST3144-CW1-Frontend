//* initializing Vue instance to manage app state and behaviors
let app = new Vue({
    el:'#app',
    data:{
        lessons:[],             //array to store the lessons
        filterOption:'',        //contains the filter option (subject, price, etc) chosen
        sortOption:'',          //contains the sort option (asc or desc) chosen
        cartArray: [],          //array to store the lessons added to the cart
        filteredLessons: [],    //array to contains the lessons that match the query//
        checkoutNotAllowed:true, //boolean variable that returns whether checkout page can be accessed or not
        onLessonPage:true,       //boolean variable that returns whether user is currently on lesson page or not
        clientName:'',           //stores client's name
        phoneNumber:'',          //stores client's phone number
        searchBarQuery:''        //stores search bar input

    },
    methods:{

        //render.com link for backend: https://cst3144-m00934333-cw1-backend.onrender.com
        //link for localhost: http://localhost:3000/
    
        //* fetches all lessons from the backend and updates lessons array with the fetched data
        getLessons(){
            fetch('https://cst3144-m00934333-cw1-backend.onrender.com/api/lessons', {
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

        //* sorts the lessons in terms of their attributes and in ascending and descending orders
        sort(){
            //* creates a copy of the original lessons array
            let sortedLessons = [...this.lessons];
            //* if either filter or sort option is not selected, return an error box
            if(this.filterOption === '' || this.sortOption === '' ){
                Swal.fire({
                    title: 'Error',
                    text: 'You have to choose both a filter and sort option before confirming!',
                    icon: 'error'
                });

            } else if(this.filterOption === "subject"){

                //* localeCompare used for sorting due to being case insensitive and language sensitive
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
                        return a.price - b.price; 
                    } else {
                        return b.price - a.price; 
                    }
                })
            } else if(this.filterOption === "spaces"){
                sortedLessons.sort((a,b) => {
                    if(this.sortOption === "ascending"){
                        return a.spaces - b.spaces; 
                    } else {
                        return b.spaces - a.spaces;
                    }
                })
            }

            this.lessons = sortedLessons;
        },

        //* adds lesson to cart and updates lesson spaces visually
        addToCart(lesson){
            this.cartArray.push(lesson);
            let newLessonSpace = lesson.spaces--;
            console.log(newLessonSpace);
        },

        //* directs to checkout page if user is on lesson page and cart is not empty
        goToCheckoutPage(){
            if(this.cartArray.length > 0 && this.onLessonPage){
                this.onLessonPage = false;
                this.checkoutNotAllowed = false;
            } 
            else if(this.cartArray.length >=0 && this.onLessonPage == false){
                this.onLessonPage = true;
                this.checkoutNotAllowed = true;
                this.clientName = '';
                this.phoneNumber = '';
            }
        },
        
        //* removes lesson from cart and updates lesson spaces visually
        removeItemFromCart(lesson){
            let newLessonSpace = lesson.spaces++;
            let indexToBeRemoved = this.cartArray.findIndex(item => item.subject === lesson.subject && item.spaces === lesson.spaces);

            /* checks if there is a match, if yes, findIndex will return the index of 
            the match else it will return -1 */
            if (indexToBeRemoved !== -1){
                this.cartArray.splice(indexToBeRemoved,1);
            }
            
            console.log(this.cartArray);
        },

        /* updates a lesson's attributes and sends those changed 
        attributes back to the backend where those changes will be set in the database*/
        updateLesson(){

            let lessonSet = new Set(this.cartArray);

            for (let lesson of lessonSet){
                updateDetails = {
                    "subject": lesson.subject,
                    "value":lesson.spaces,
                    "attribute": "spaces"
                };

                fetch('https://cst3144-m00934333-cw1-backend.onrender.com/api/updateLesson', {
                    method:'PUT',
                    headers:{
                        'Content-Type':'application/json'
                    },
                    body:JSON.stringify(updateDetails)
                })
                .then(response => response.json())
                .then(data => {
                    if (data.message === "Lesson Updated Successfully"){
                        //console.log("Updated");
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
        
        /*provides user with a list of the lessons added to cart before checkout
        and also shows a pop up for the user to confirm whether they 
        want to proceed with the checkout or not*/
        confirmCheckout(){
            /*creates a lessonCount object that keeps keeps track of the number of occurrences
            of an item in the cartArray*/
            //* acc is the accumulator object that stores the count of each lesson
            //* item is the current lesson being processed
            const lessonCount = this.cartArray.reduce((acc,item) => {

                //*checks if item.subject already exists as a key in acc
                //*if it exists, adds 1 to the lesson count, if not then it initializes 
                //*the count at 0 and then adds 1
                acc[item.subject] = (acc[item.subject] || 0) + 1;
                return acc;
            }, {});

            console.log(lessonCount);
            
            //* converts the lessonCount object into an array of key-pair values
            const lessonText = Object.entries(lessonCount)
                .map(([subject, count]) => `${subject}: ${count}`)
                .join("<br>");  // Join each entry with a newline

            Swal.fire({
                title: "Your Order",
                html:lessonText,
                icon:"question", 
                showCloseButton: false,
                showCancelButton: true,
                confirmButtonText: "Confirm"
            }).then((result) => {
                if (result.isConfirmed){
                    this.checkout();
                }
            });
        },
        
        /*gets customer order details and sends them to the 
        backend where they are stored in the database*/
        checkout(){
            const orderDetails = {
                "name":this.clientName,
                "phoneNumber":this.phoneNumber,
                "order":this.cartArray
            };

            fetch('https://cst3144-m00934333-cw1-backend.onrender.com/api/orders', {
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
                            //*reset input fields
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
                            //*reset input fields
                            this.clientName = '';
                            this.phoneNumber = '';
                        }
                    });

                }
            })
        },

        /*retrives filtered lessons according to the data input in the search bar*/
        getFilteredLessons(){
            //* to ensure special characters are handled correctly in URLs
            const encodedQuery = encodeURIComponent(this.searchBarQuery);

            fetch(`https://cst3144-m00934333-cw1-backend.onrender.com/api/search?query=${encodedQuery}`, {
                method:'GET',
                headers:{
                    'Content-Type':'application/json'
                }
            })
            .then(response => response.json())
            .then(data => {
                this.filteredLessons = data.data;
                console
                for (let filteredLesson of this.filteredLessons){
                    for (let cartLesson of this.cartArray){
                        if(filteredLesson.subject === cartLesson.subject){
                            // console.log(filteredLesson.spaces, cartLesson.spaces);
                            filteredLesson.spaces = cartLesson.spaces;
                        }
                    }
                }
                this.lessons = this.filteredLessons;
                console.log(this.lessons);
            })
            .catch(err => console.log("Error fetching lessons: ", err));
        }

    },
    computed:{
        //? returns the number of items in the cart
        numberItemsInCart(){
            return this.cartArray.length || 0;
        },

        //? checks if the name entered consists of letter only
        checkIfLettersOnly(){
            let regex = /^[A-Za-z]+$/;
            return regex.test(this.clientName);
        },
        
        //? checks if the phone number entered consists of digits only
        checkIfNumbersOnly(){
            let regex = /^[0-9]+$/;
            return regex.test(this.phoneNumber);
        },

    },
    mounted(){
        //? fetches the lessons when the app loads or reloads
        this.getLessons();
    },

})
