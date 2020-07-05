

function getUserRepos(user){
    //this takes a little bit longer than the console log outside the function
    //so the outside log will print first
    //this is to demonstrate that you want your code outside of the fetch to not get
    //blocked by the fetch
    var apiUrl = "https://api.github.com/users/" + user + "/repos";

    fetch(apiUrl).then(function(response){
        console.log("inside the function, first promise", response);
        //converting the response into JSON instead of the response object
        //if not JSON data then use response.text().then(function(data){})
        response.json().then(function(data){
            //returns another promise
            console.log("here is the data we want, second promise");
            console.log(data);
        })
    });
    //status 200 means SUCCESS!!
    
    //storing the fetch in a variable creates a promise which this function now returns the value of the Promise
    //var response = fetch("https://api.github.com/users/octocat/repos");
    //console.log("got a Promise object response from the github API!!")
    //console.log(response);
}
// getUserRepos();
console.log("outside of the function");