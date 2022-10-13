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

    let counter = 0;
    Array.from(teamMap.keys()).forEach(team => {
        let i = 0;
        while(i < 4) {
            const currentValue = teamMap.get(team);
            teamMap.set(team, [].concat(currentValue, groups[counter]));
            i++;
            counter++;
        }
    })
    
    teamMap.forEach((value, key) => {
        console.log(" ");
        console.log("%cRodando os jogos do grupo " + key, "color: gold; font-size: 22px");
        round(value);
    })
}

//Seleciona as seleções que se enfrentarão
function round(group) {
    //Rodada 1
    match(group[0], group[1]);
    match(group[2], group[3]);
    //Rodada 2
    match(group[0], group[2]);
    match(group[1], group[3]);
    //Rodada 3
    match(group[0], group[3]);   
    match(group[1], group[2]);
}

//Monta o placar dos jogos de forma aleatória
function match(teamA, teamB) {
    const goalScoreTeamA = randomValues(4);
    const goalScoreTeamB = randomValues(4);
    if(goalScoreTeamA > goalScoreTeamB) {
        console.log(`${teamA.Name} venceu a partida de ${goalScoreTeamA} X ${goalScoreTeamB} contra ${teamB.Name}`);
        teamA.goalScore = isNaN(teamA.goalScore) ? 3 : teamA.goalScore + 3;
    } else if(goalScoreTeamB > goalScoreTeamA) {
        console.log(`${teamB.Name} venceu a partida de ${goalScoreTeamB} X ${goalScoreTeamA} contra ${teamA.Name}`);
        teamB.goalScore = isNaN(teamB.goalScore) ? 3 : teamB.goalScore + 3;
    } else {
        console.log(`${teamA.Name} e ${teamB.Name} empataram em ${goalScoreTeamA} X ${goalScoreTeamB}`);
        teamA.goalScore = isNaN(teamA.goalScore) ? 1 : teamA.goalScore + 1;
        teamB.goalScore = isNaN(teamB.goalScore) ? 1 : teamB.goalScore + 1;
    }
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
