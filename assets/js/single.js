
var issueContainerEl = document.querySelector("#issues-container");


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
            });
        } else {
            alert("There was a problem with your request!");
        }
    });
}

getRepoIssues("facebook/react");

//data is being passed as an argument into this function
function displayIssues(issues){
    
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