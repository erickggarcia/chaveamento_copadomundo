const URL = "https://estagio.geopostenergy.com/WorldCup/GetAllTeams";
const groups = [];
const teamLength = 32;

async function main() {
    const data = await fetchData();
    
    while(groups.length < teamLength) {
        const randomNumber = randomValues(data.length);
        const randomTeam = data[randomNumber];

        if(!groups.includes(randomTeam)) {
            groups.push(randomTeam);
        }
    }
    console.log(groups)
}

async function fetchData() {
    return fetch(URL, {
        headers:{
            "git-user": "erickggarcia"
        }  
    }).then(data => data.json())
    .then(json => json.Result);
}

function randomValues(size) {
    return Math.floor(Math.random() * size);
}

main();
