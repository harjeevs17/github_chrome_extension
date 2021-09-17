document.addEventListener('DOMContentLoaded',async()=>{
    const button  = document.getElementById('submitBtn');
    const logoutbutton  = document.getElementById('logoutBtn');
    repoStat = document.getElementById('repoStat');
    form  = document.getElementById('form');
    prInfoDetails = document.getElementById('prInfoDetails');
    pullRequestTitle = document.getElementById('pullRequestTitle');
    stats = document.getElementById('stats');
    welcomeText = document.getElementById('welcomeText');
    chrome.storage.local.get("username", function(user){
        console.log(user)
        if(user.username == null){
            document.getElementById('form').setAttribute('style','display: block;');
            document.getElementById('logoutForm').setAttribute('style','display: none;');
        }
        else{
            document.getElementById('form').setAttribute('style','display: none;');
            document.getElementById('logoutForm').setAttribute('style','display: block;');
            document.getElementById('pullCount').setAttribute('style','display: block;');
            console.log("user is " + user)
            buttonclickhandler(user.username)
            repoStat.addEventListener("click",function(){
                console.log("clicked")
                window.open('https://github.com/'+user.username+'?tab=repositories');
            })
            stats.addEventListener("click",function(){
                window.open('https://github.com/'+user.username);
            })    
        }
    });
    /*Login button listener*/
    button.addEventListener("click", function() {
        const username = document.getElementById('username').value;
        console.log("value is" + username);
        chrome.storage.local.set({ "username": username }, function(){
            document.getElementById('form').setAttribute('style','display: none;');
            document.getElementById('logoutForm').setAttribute('style','display: block;');
        });
        buttonclickhandler(username);
    });
    /*Logout button listener that gets triggerd when the user wants to logout . It clears the username stored and adjusts the form accordingly.*/
    logoutbutton.addEventListener("click", function() {
        chrome.storage.local.set({ "username": null }, function(){
            document.getElementById('form').setAttribute('style','display: block;');
            document.getElementById('logoutForm').setAttribute('style','display: none;');
            document.getElementById('pullCount').setAttribute('style','display: none;');
            document.getElementById('mainText').innerHTML= "GitBot";
            chrome.browserAction.setBadgeText({text:""});
        });
    });
    /* Function to compare the dates and check if the available date is less than 7 days or not. Mail gets send accordingly. */
    const compareDates = (date)=>{
        const date1 = new Date(date);
        const date2 = new Date();
        const diffTime = Math.abs(date2 - date1);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
        if(diffDays>=7){
            return 1;
        }else{
            return 0;
        }
    }

    const  buttonclickhandler = (user) => {
  
        // Instantiate an new XHR Object
        const xhr = new XMLHttpRequest();
        // Open an obejct (GET/POST, PATH,
        // ASYN-TRUE/FALSE)
        xhr.open("GET", "https://api.github.com/search/issues?q=is:open%20is:pr%20author:"+user, true);
        // When response is ready
        xhr.onload = function () {
            if (this.status === 200) {
                // Changing string data into JSON Object
                data = JSON.parse(this.responseText);
                const number_of_pr = data.total_count;
                const pr_info = data.items;
                stats.innerHTML = "Github Profile";
                pullRequestTitle.innerHTML = "Pull Requests : "+number_of_pr;
                pr_list = ''
                for(ele of pr_info){
                    if(compareDates(ele.created_at) == 1){
                        sendEmail(ele);
                    }
                    console.log(ele.title)
                    eleBody = ele.body !=null ? ele.body : "&nbsp;"
                    pr_list = pr_list + "<div class='innerDetails'><a target='_blank' href='"+ele.pull_request.html_url+"'><p class='title'>"+ele.title+"</p><p class='state'>"+eleBody+"</p></a></div>"
                }
                console.log(pr_list);
                welcomeText.innerHTML =  "Hi ! " + user 
                prInfoDetails.innerHTML = pr_list;
                chrome.browserAction.setBadgeText({text:number_of_pr.toString()});
                document.getElementById('pullCount').setAttribute('style','display: block;');
                document.getElementById('mainText').innerHTML = "Connected"
            }
            else {
                console.log("File not found");
            }
        }
        // At last send the request
        xhr.send();


        // Instantiate an new XHR Object
        const xhr2 = new XMLHttpRequest();
        // Open an obejct (GET/POST, PATH,
        // ASYN-TRUE/FALSE)
        xhr2.open("GET","https://api.github.com/users/"+user+"/repos", true);
        // When response is ready
        xhr2.onload = function () {
            if (this.status === 200) {
                // Changing string data into JSON Object
                reposData = JSON.parse(this.responseText);
                const number_of_repos = reposData.length;
                repoStat.innerHTML = "Repositories:" + number_of_repos
            }
            else {
                console.log("File not found");
            }
        }
        // At last send the request
        xhr2.send();
    }
    

})
/*Function is used to send an Email to the user */
const sendEmail = (data)=>{
    emailjs
      .send(
        "service_nq71ysk",
        "template_8dfw5yu",
        {
          reply_to: "no_replay@gmail.com",
          to_name: "Harjeev",
          from_name: "Github Bot",
          sender: name,
          title: data.title,
          link: data.pull_request.html_url,
          date:new Date(data.created_at).toLocaleDateString('en-GB')
        },
        "user_KxfUBUoU50GrLsWMSZ7So"
      )
      .then(
        (result) => {
            console.log("mail sent")
        },
        (error) => {
          console.log(error.text);
        }
      );
  };





