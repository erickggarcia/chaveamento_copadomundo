const URL = "https://estagio.geopostenergy.com/WorldCup/GetAllTeams";
async function fetchData() {
    await fetch(URL, {
        headers:{
            "git-user": "erickggarcia"
        }  
    }).then(data => console.log(data.json()))
}

fetchData();
