
    var loggedInUser = window.localStorage.getItem("loggedInUser");  // get user login from local storage 

    var path = window.location.pathname;
    var page = path.split("/").pop();

// get the name of the page open in browser
    if(page == "index.html" || page == "Register.html"){
        if(loggedInUser){
            window.location.href = "Listing.html";
        }
    }  // Incase of a user logged in redirect to listing page
    
    if(page == "Listing.html" || page == "EditAccountInformation.html" || page == "Posts.html"){
        if(!loggedInUser){
            window.location.href = "index.html";
        }
    }
// incase of no logged in user redirect to login page

// use the appropriate functions based on page. 

    if(page == "index.html"){
       //incase the user presses the login button take the appropriate actions. 
     document.getElementById("loginButton").addEventListener("click", function() {
           event.preventDefault();
           var form = document.getElementById("form");//get form input values
           var username = form.username.value;
           var password = form.password.value;
           var allUsers = JSON.parse(window.localStorage.getItem("users"));
           if(allUsers === null){
               alert("No user registered, please register.");
               
           } //check if there is a user registered
           
           //check the login details with the registered users
           for(var i = 0; i < allUsers.length; i++){
            if(allUsers[i].username === username && allUsers[i].password === password){
                window.localStorage.setItem("loggedInUser", username);
                window.location.href = "Listing.html";
                return;    
            }
           }
            alert("invalid username or password");
        });
        
       //incase the user presses the legister button then redirect to register pahe
        document.getElementById("registerRedirectButton").addEventListener("click", function(){
           event.preventDefault();
           window.location.href = "Register.html";
        });
    }
    
    if(page == "Listing.html"){
        //choose month
        
        var selectedMonth = 'April';
        
        var allPosts = [];
        //get html tag where user detals that need to be shown
        var userDetails = document.getElementById("userLoginDetails");
        
        //show logged in user
        userDetails.innerHTML = loggedInUser + " <br>";
        
        
        //show the month dates and days and put data in the days. 
        function initialLoad() {
            var selectField = document.getElementById('selectField');
            selectedMonth = moment().format('MMMM');
            selectField.value = selectedMonth;
            
            var allUsers = JSON.parse(window.localStorage.getItem("users"));
            for(var i = 0; i < allUsers.length; i++){
                if(allUsers[i].username == loggedInUser){
                    allPosts = allUsers[i].posts;
                    if(!allPosts){
                        allPosts = [];
                    }
                }
            }
            
            renderCalendar();
        }
    
    document.getElementById("selectField").addEventListener("change", function() {
        var e = document.getElementById("selectField");
        selectedMonth = e.options[e.selectedIndex].value;
        renderCalendar();
    });
    
    //render the calendar and put task in the days  
    
    function renderCalendar() {
        var table = document.getElementById('tableDays');
        var count =  moment().month(selectedMonth).daysInMonth();
        var days = [];
        for (var i = 1; i < count+1; i++) {
          days.push(moment().month(selectedMonth).date(i));
        }
        var emptyDays = moment(days[0]).startOf('month').day();
        for (var i = 0; i < emptyDays; i++) {
            days.unshift(null);
        }
        
        // rendering the tables now
        console.log({count, selectedMonth, days, emptyDays});
        var tableHTML = '';
        var line;
        for (var i = 0; i < days.length / 7; i++) {
            tableHTML += '<div class="row nowrap w-100 text-center">';
            for (var j = 0; j < 7; j++) { // because 7 days in a week
                line = '<div class="date mx-' + (j === 0 || j === 6 ? '' : '2') +'">' + (days[i*7 + j] ? days[i*7 + j].format('DD') : '') +'</div>';
                tableHTML += line;
            }
            
            tableHTML += '</div><div class="row nowrap w-100 list">';
            for (var j = 0; j < 7; j++) { // because 7 days in a week
                var posts = ''
                if (days[i*7 + j]) {
                    for (var k = 0; k < 7; k++) {
                        var singlePost = allPosts[k];
                        var singleDay = days[i*7 + j]
                        if (singlePost && singleDay.format('YYYY-MM-DD') === singlePost.dueDate) {
                            posts +=  '• ' + singlePost.task + '</br>';
                        }
                    }
                }
                line = '<div class="dateL mx-' + (j === 0 || j === 6 ? '' : '2') +'">' + posts +'</div>';
                tableHTML += line;
            }
            tableHTML += '</div>';
        }
        
        // overwritting the table
        table.innerHTML = tableHTML;
    
        
       //redirect to account editing page. 
        document.getElementById("editAccount").addEventListener("click", function() {
            event.preventDefault();
            window.location.href = "EditAccountInformation.html";
        });
        
       // logout user 
            document.getElementById("logout").addEventListener("click", function() {
            event.preventDefault();
            window.localStorage.removeItem("loggedInUser");
            window.location.href = "index.html";
        });
        }
        
       // redirect to task entry page. 
        document.getElementById("addPost").addEventListener("click", function() {
        event.preventDefault();
        window.location.href = "posts.html";
        });
    }
        
    
    if(page == "posts.html"){    
        document.getElementById("onCreateTask").addEventListener("click", function(){
            //get data from from 
            
            event.preventDefault();
            var form = document.getElementById("name-form");
            var task = form.task.value;
            var dueDate = form.dueDate.value;
            var categories = form.categories.value;
            var textArea = form.textArea.value;
            
            //check if fields are field
            
            if(!task || !dueDate || !categories || !textArea){
                alert("Fill all fields");
                return;
           }
            //put task data in local storage
            var allUsers = JSON.parse(window.localStorage.getItem("users"));
            var post = {task, dueDate, categories, textArea};
            
            for(var i = 0; i < allUsers.length; i++){
            if(allUsers[i].username == loggedInUser){
                var p = allUsers[i].posts;
                if(!p){
                    p = [];
                    return;
                }
                p.push(post);
                allUsers[i].posts = p;
            }
           //give alert that the task was created
            window.localStorage.setItem("users", JSON.stringify(allUsers));
            alert('Post successfully created');
            window.location.href = "Listing.html";
        }
        });
        
       //redirect incase of cancellation. 
       
        document.getElementById("onCancel").addEventListener("click", function() {
            event.preventDefault();
            window.location.href = "Listing.html";
        });
    }
    
    if (page == "Register.html"){
        document.getElementById("register").addEventListener("click", function() {
           //get form data
           
           event.preventDefault();
           var form = document.getElementById("form");
           var firstName = form.firstName.value;
           var lastName = form.lastName.value;
           var password = form.password.value;
           var confirmPassword = form.confirmPassword.value;
           var username = form.email.value;
           var confirmEmail = form.confirmEmail.value;
           var hpNumber = form.hpNumber.value;
           var confirmHpNumber = form.confirmHpNumber.value;
           //check if all fields are filled
           
           if(!password || !confirmPassword || !username || !confirmEmail || !firstName || !lastName || !hpNumber || !confirmHpNumber){
                alert("Fill all fields");
                return;
           }
           if(password !== confirmPassword){
                alert("Password doesn't match");
                return;
           }
           if(hpNumber !== confirmHpNumber){
                alert("HpNumber doesn't match");
                return;
           }
           if( username !== confirmEmail){
                alert("Email doesn't match");
                return;
           }
           
           //get data from local storage of users. 
           
           var allUsers = JSON.parse(window.localStorage.getItem("users"));
           //check if there are users
           
           if(allUsers === null){
               allUsers = [];
           }
           for(var i = 0; i < allUsers.length; i++){
           //check if user is already registered
           
            if(allUsers[i].username === username){
                alert("username already registered");
                return;
            }
           }
           //make post object to be put in local storage
           
           var posts = [];
           var user = {firstName, lastName, password, username, hpNumber, posts};
           allUsers.push(user);
          //put data in local storage
           window.localStorage.setItem("users", JSON.stringify(allUsers));
          
          //login user after registration
           window.localStorage.setItem("loggedInUser", username);
           window.location.href = "Listing.html";
        });
        
       
       //redirect from registration page to login page. 
        document.getElementById("loginRedirectButton").addEventListener("click", function() {
        event.preventDefault();
        window.location.href = "index.html";       
        });
        
    }
    
    
    if (page == "EditAccountInformation.html"){
        document.getElementById("onUpdate").addEventListener("click", function() {
       //get data from form
       
       event.preventDefault();
       var form = document.getElementById("form");
       var firstName = form.firstName.value;
       var lastName = form.lastName.value;
       var password = form.password.value;
       var confirmPassword = form.confirmPassword.value;
       var username = form.email.value;
       var confirmEmail = form.confirmEmail.value;
       var hpNumber = form.hpNumber.value;
       var confirmHpNumber = form.confirmHpNumber.value;
       
       //check if all form fields are filled
       
       if(!password || !confirmPassword || !username || !confirmEmail || !firstName || !lastName || !hpNumber || !confirmHpNumber){
            alert("Fill all fields");
            return;
       }
       
       //check if confirm field is same
       
       if(password !== confirmPassword){
            alert("Password doesn't match");
            return;
       }
       if(hpNumber !== confirmHpNumber){
            alert("HpNumber doesn't match");
            return;
       }
       if( username !== confirmEmail){
            alert("Email doesn't match");
            return;
       }
       // put field data in local storage and change user information. 
       var allUsers = JSON.parse(window.localStorage.getItem("users"));
       if(allUsers === null){
           allUsers = [];
       }
       for(var i = 0; i < allUsers.length; i++){
        if(allUsers[i].username === loggedInUser){
            var user = allUsers[i];
            user.firstName = firstName;
            user.lastName = lastName;
            user.password = password;
            user.username = username;
            user.hpNumber = hpNumber;
            
            allUsers[i] = user;
            window.localStorage.setItem("users", JSON.stringify(allUsers));
            window.localStorage.setItem("loggedInUser", username);
            window.location.href = "Listing.html";
        }
       }
        });
        
        
       //redirect to listing page incase the of cancellation. 
        document.getElementById("onCancel").addEventListener("click", function() {
            event.preventDefault();
            window.location.href = "Listing.html";
        });
    }
    
    