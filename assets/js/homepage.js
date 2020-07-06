
var userFormEl = document.querySelector("#user-form");
var nameInputEl = document.querySelector("#username");
var repoContainerEl = document.querySelector("#repos-container");
var repoSearchTerm = document.querySelector("#repo-search-term");

//passing an argument in as whatever is entered as the GitHub username
function getUserRepos(user){
    //this takes a little bit longer than the console log outside the function
    //so the outside log will print first
    //this is to demonstrate that you want your code outside of the fetch to not get
    //blocked by the fetch
    var apiUrl = "https://api.github.com/users/" + user + "/repos";

    fetch(apiUrl).then(function(response){
        console.log("inside the function, on the first promise", response);
        //converting the response into JSON instead of the response object
        //if not JSON data then use response.text().then(function(data){})
        if(response.ok){
            //returns another promise
            console.log("here is the all data we want on the user, on the second promise");
            //console.log(data);
            response.json().then(function(data){
                //data eventually becomes repos in other functions
                displayRepos(data, user);
            });//closing the response.json().then() method
        } else {
            alert("Error: your Get User request returned => " + response.statusText);
        }//closing off the if and else statements
    })//closing off the fetch(apiUrl).then(function(response){} method here
    .catch(function(error){
        alert("Unable to connect to GitHub.")
    });//closing .catch(function(error){}) which is tacked onto the end of fetch() method
}//closing off the function

//status 200 means SUCCESS!!

//storing the fetch in a variable creates a promise which this function now returns the value of the Promise
//var response = fetch("https://api.github.com/users/octocat/repos");
//console.log("got a Promise object response from the github API!!")
//console.log(response);

// getUserRepos(username);
//console.log("outside of the function");

function formSubmitHandler(event){
    //keep the page from refreshing after the event
    //the default action of this type of event is refreshing the page
    event.preventDefault();
    //checking if the submit button was clicked
    console.log("submit button was clickked!!!")
    console.log(event);

    //get the value from input element
    var username = nameInputEl.value.trim();
    if (username){
        getUserRepos(username);
        nameInputEl.value = "";
    } else {
        alert("Please enter a GitHub username.")
    }
}

//displayRepos(data, user) are the arguments being passed into the parameters here
function displayRepos(repos, searchTerm){
    //clear old content
    repoContainerEl.textContent = "";
    console.log(repos)
    repoSearchTerm.textContent = searchTerm;
    console.log(searchTerm);

    //check if api returned any repos
    if (repos.length === 0){
        repoContainerEl.textContent = "No repositories found.";
        return;//exit this function since no repos were found to display
    }


    //loop over the user's repos
    for (var i = 0; i < repos.length; i++){
        //format repo name
        var repoName = repos[i].owner.login + "/" + repos[i].name;

        //create a container for each repo
        var repoEl = document.createElement("div");
        //assign classes to the element container we just made
        repoEl.classList = "list-item flex-row justify-space-between align-center";

        //create a span element to hold repository name
        var titleEl = document.createElement("span");
        titleEl.textContent = repoName;

        //create a status element
        var statusEl = document.createElement("span");
        statusEl.classList = "flex-row align-center";

        //check if current repo has issues or not
        if (repos[i].open_issues_count > 0){
            statusEl.innerHTML = 
            "<i class='fas fa-times status-icon icon-danger'></i>" + repos[i].open_issues_count + " issue(s)";
        } else {
            statusEl.innerHTML = 
            "<i class='fas fa-check-square status-icon icon-success'></i>";
        }
        //append to container
        repoEl.appendChild(statusEl);

        //append to container
        repoEl.appendChild(titleEl);

        //append container to the document object model
        repoContainerEl.appendChild(repoEl);


    }
}

userFormEl.addEventListener("submit", formSubmitHandler);

