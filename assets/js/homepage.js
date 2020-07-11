
const userFormEl = document.querySelector("#user-form");
const nameInputEl = document.querySelector("#username");
const repoContainerEl = document.querySelector("#repos-container");
const repoSearchTerm = document.querySelector("#repo-search-term");
const languageButtonsEl = document.querySelector("#language-buttons");

buttonClickHandler = event => {
    let language = event.target.getAttribute("data-language");
    //checking if the event is getting the data attribute
    console.log("checking if the event is getting the data attribute");
    console.log(language);
    if(language) {
        getFeaturedRepos(language);
        //if language was a truthy value pass into getFeaturedRepos()
        //and clear the old content
        //getFeaturedRepos has the fetch() so it takes longer than clearing the
        //old repo content
        repoSearchTerm.textContent = language;
        repoContainerEl.textContent = "";
        
    }

}

getFeaturedRepos = language => {
    const apiUrl = "https://api.github.com/search/repositories?q=" + language + "+is:feature&sort=help-wanted-issues";
    fetch(apiUrl).then(response => {
        if (response.ok){
            response.json().then(data => {
                console.log(data);
                console.log(language);
                displayFeaturedRepos(data, language);
            });
            console.log(response);
        } else {
            alert("Error: " + response.statusText);
        }
    });
};



//passing an argument in as whatever is entered as the GitHub username
function getUserRepos(user){
    //this takes a little bit longer than the console log outside the function
    //so the outside log will print first
    //this is to demonstrate that you want your code outside of the fetch to not get
    //blocked by the fetch
    var apiUrl = "https://api.github.com/users/" + user + "/repos";

    fetch(apiUrl)
    .then(function(response){
        console.log("inside the function, on the first promise", response);
        //converting the response into JSON instead of the response object
        //if not JSON data then use response.text().then(function(data){})
        if(response.ok){
            //returns another promise
            console.log("here is the all data we want on the user, on the second promise");
            //console.log(data);
            response.json()
            .then(function(data){
                //data eventually becomes repos in other functions
                displayRepos(data, user);
            });//closing the response.json().then() method
        } else {
            alert("Error: your Get User request returned => " + response.statusText);
        }//closing off the if and else statements
    })//closing off the fetch(apiUrl).then(function(response){} method here
    .catch(function(error){
        alert("Unable to connect to GitHub." + error);
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

function displayFeaturedRepos(data, language){
    //clear old content
    repoContainerEl.textContent = "";
    //place language into the showing featured repos for language
    repoSearchTerm.textContent = language;
    
    //check if api returned any repos
    if (data.items.length === 0){
        repoContainerEl.textContent = "No repositories found.";
        return;
    }
    //loop over the featured repos
    for (let i = 0; i < data.items.length; i++){
        let repoName = data.items[i].owner.login + "/" + data.items[i].name;
        let repoEl = document.createElement("a");
        repoEl.classList = "list-item flex-row justify-space-between align-center";
        repoEl.setAttribute("href", "./single-repo.html?repo=" + repoName);
        let titleEl = document.createElement("span");
        titleEl.textContent = repoName;
        //create a status element
        var statusEl = document.createElement("span");
        statusEl.classList = "flex-row align-center";
        //check if current repo has issues or not
        if (data.items[i].open_issues_count > 0){
            statusEl.innerHTML = 
            "<i class='fas fa-times status-icon icon-danger'></i>" + data.items[i].open_issues_count + " issue(s)";
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
//displayRepos(data, user) are the arguments being passed into the parameters here
function displayRepos(repos, searchTerm){
    //clear old content
    repoContainerEl.textContent = "";
    console.log(repos)
    //put username next to showing repositories for: 
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
        var repoEl = document.createElement("a");
        //assign classes to the element container we just made
        repoEl.classList = "list-item flex-row justify-space-between align-center";
        repoEl.setAttribute("href", "./single-repo.html?repo=" + repoName);
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
languageButtonsEl.addEventListener("click", buttonClickHandler);

