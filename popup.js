document.addEventListener('DOMContentLoaded',async()=>{
    const button  = document.getElementById('submitBtn');
    const logoutbutton  = document.getElementById('logoutBtn');
    form  = document.getElementById('form');
    const displayPullCount = async(user)=>{
        const url = 'https://api.github.com/search/issues?q="'+user+'"state:open%20is:pr';
        console.log(user)
        stats = document.getElementById('stats');
        welcomeText = document.getElementById('welcomeText');
        try{
            const res = await fetch(url);
            const data = await res.json();
            const number_of_pr = data.total_count;
            stats.innerHTML = "Total number of Pull Requests are : "+ number_of_pr;
            welcomeText.innerHTML = "Welcome user : " + user
            sendEmail(number_of_pr);
            
        }
        catch(err){
            console.log("error:"+err)
        }
    }
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
            displayPullCount(user.username)    
        }
    });
    button.addEventListener("click", function() {
        const username = document.getElementById('username').value;
        console.log("value is" + username);
        chrome.storage.local.set({ "username": username }, function(){
            document.getElementById('form').setAttribute('style','display: none;');
            document.getElementById('logoutForm').setAttribute('style','display: block;');
        });
    });
    logoutbutton.addEventListener("click", function() {
        chrome.storage.local.set({ "username": null }, function(){
            document.getElementById('form').setAttribute('style','display: block;');
            document.getElementById('logoutForm').setAttribute('style','display: none;');
            document.getElementById('pullCount').setAttribute('style','display: none;');
        });
    });
})
const sendEmail = (count)=>{
    emailjs
      .send(
        "service_hst09mx",
        "template_7xvsnlr",
        {
          reply_to: "no_replay@gmail.com",
          to_name: "Harjeev",
          from_name: "Github Bot",
          sender: name,
          message: "You have got " +count+ " active PR",
        },
        "user_8fCHR8UMMvdJCNYX8uhVe"
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





