const URL = "https://estagio.geopostenergy.com/WorldCup/GetAllTeams";
const groups = [];
const teamLetters = ["A", "B", "C", "D", "E", "F", "G", "H"];
const teamMap = new Map();
//Insere no TeamMap a chave de um grupo, cujo valor inicial é um array vazio
teamLetters.forEach(letter => teamMap.set(letter, []));
console.log(teamMap.size);

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
    console.log(groups);
    const teamKeys = teamMap.keys();
    let counter = 0;
    Array.from(teamKeys).forEach(team => {
        let i = 0;
        while(i < 4) {
            const currentValue = teamMap.get(team);
            teamMap.set(team, [].concat(currentValue, groups[counter]));
            i++;
            counter++;
        }
    })
    //console.log(teamMap.get("A")[3].Name);
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
