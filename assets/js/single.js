
var issueContainerEl = document.querySelector("#issues-container");
var limitWarningEl = document.querySelector("#limit-warning");
var repoNameEl = document.querySelector("#repo-name");

function getRepoName(){
    //store the query string in the URL into a variable
    //for example "?repo=A/.dotfiles"
    //repo was taken from previous page
    var queryString = document.location.search;
    var repoName = queryString.split("=")[1];
    //check if we got the right thing
    console.log(repoName);
    if(repoName){
        //pass repoName into the function handling getting the issues
        getRepoIssues(repoName);
        //print the repo name onto the document page
        repoNameEl.textContent = repoName;
    } else {
        //if no repo was given redirect to homepage
        document.location.replace("./index.html")
    }
}
getRepoName();


function displayWarning(repo){
    //add text to warning container
    limitWarningEl.textContent = "To see more than 30 issues, visit ";
    var linkEl = document.createElement("a");
    linkEl.textContent = "See more issues on GitHub.com";
    linkEl.setAttribute("href", "https://github.com/" + repo + "/issues");
    linkEl.setAttribute("target", "_blank");
    //append warning to container
    limitWarningEl.appendChild(linkEl);
}

function getRepoIssues(repo){
    
    //console.log(repo);
    //storing in a variable the url we want to fetch
    var apiUrl = "https://api.github.com/repos/" + repo + "/issues?direction=asc";
    //fetch the url the fetch shows up in the network tab in google chromes inspector
    fetch(apiUrl).then(function(response){
        //request was successful
        if (response.ok) {
            response.json().then(function(data) {
                //checking if this works
                console.log(data);
                //pass reponse data to dom function
                displayIssues(data);
                
                //check if api has paginated issues, 30 or more
                if (response.headers.get("Link")){
                    console.log("repo has more than 30 issues");
                    displayWarning(repo);
                }
            });
        } else {
            alert("There was a problem with your request!");
            //redirect to home page after the alert
            document.location.replace("./index.html");
        }
    });
}


//data is being passed as an argument into this function
function displayIssues(issues){

    //if there are no issues
    if (issues.length === 0){
        issueContainerEl.textContent = "This repo has no open issues!";
        return;
    }
    
    //loop over response data and create an <a> elemetn for each issue
    for (var i = 0; i < issues.length; i++){
        //create link element to take users to the issue on github
        var issueEl = document.createElement("a");
        issueEl.classList = "list-item flex-row justify-space-between align-center";
        issueEl.setAttribute("href", issues[i].html_url);
        issueEl.setAttribute("target", "_blank");
        //create span ot old issue title
        var titleEl = document.createElement("span");
        titleEl.textContent = issues[i].title;
    
        //append to container
        issueEl.appendChild(titleEl);
    
        //create a type element
        var typeEl = document.createElement("span");
    
        //check if issue is an actual issue or pull request
        if (issues[i].pull_request){
            typeEl.textContent = "(Pull request)";
        } else {
            typeEl.textContent = "(Issue)";
        }
    
        //append to container
        issueEl.appendChild(typeEl);

        //append the new issue container to the issues container
        issueContainerEl.appendChild(issueEl);


    }

}