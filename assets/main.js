const URL = "https://estagio.geopostenergy.com/WorldCup/GetAllTeams";
const groups = [];
const teamLetters = ["A", "B", "C", "D", "E", "F", "G", "H"];
const teamMap = new Map();
const classificationMap = new Map();

//Insere no TeamMap a chave de um grupo, cujo valor inicial é um array vazio
teamLetters.forEach(letter => teamMap.set(letter, []));
teamLetters.forEach(letter => classificationMap.set(letter, []));

const teamLength = 32;
const finalSixteenClassification = [];

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

        //Obtendo a ordem dos dois primeiros colocados
        classificationGroupFase(value);
    })
    removePoints();
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

    teamA.goalScore = isNaN(teamA.goalScore) ? 0 : teamA.goalScore;
    teamB.goalScore = isNaN(teamB.goalScore) ? 0 : teamB.goalScore;

    if(goalScoreTeamA > goalScoreTeamB) {
        console.log(`${teamA.Name} venceu a partida de ${goalScoreTeamA} X ${goalScoreTeamB} contra ${teamB.Name}`);
        teamA.goalScore = isNaN(teamA.goalScore) ? 3 : teamA.goalScore + 3;
        teamA.goals = isNaN(teamA.goals) ? 0 : teamA.goals + goalScoreTeamA;
    } else if(goalScoreTeamB > goalScoreTeamA) {
        console.log(`${teamB.Name} venceu a partida de ${goalScoreTeamB} X ${goalScoreTeamA} contra ${teamA.Name}`);
        teamB.goalScore = isNaN(teamB.goalScore) ? 3 : teamB.goalScore + 3;
        teamB.goals = isNaN(teamB.goals) ? 0 : teamB.goals + goalScoreTeamB;
    } else {
        console.log(`${teamA.Name} e ${teamB.Name} empataram em ${goalScoreTeamA} X ${goalScoreTeamB}`);
        teamA.goalScore = isNaN(teamA.goalScore) ? 1 : teamA.goalScore + 1;
        teamB.goalScore = isNaN(teamB.goalScore) ? 1 : teamB.goalScore + 1;
        teamA.goals = isNaN(teamA.goals) ? 0 : teamA.goals + goalScoreTeamA;
        teamB.goals = isNaN(teamB.goals) ? 0 : teamB.goals + goalScoreTeamB;
    }
}


function classificationGroupFase(gameResults) { 
    //Ordena a seleção com maior número de pontos
    gameResults.sort(function(a, b) {
        return  parseInt(b.goalScore) - parseInt(a.goalScore);
    })
    //Cria uma cópia de groups e ordena as seleções
    //de acordo com o saldo de gols
    const copia = gameResults.slice();
    copia.sort(function(a, b) {
        return  parseInt(b.goals) - parseInt(a.goals);
    })
    //Caso não necessite de critério de desempate, 
    //o primeiro e segundo lugar já se encontram ordenados
    //Caso haja empate de pontos, o primeiro critério para
    //selecionar o primeiro e segundo lugar passa a ser
    //a seleção com maior saldo de gols
    //Caso ainda assim haja empate, o primeiro e segundo lugar
    //é definido por sorteio
    let firstPlace;
    let secondPlace;
    for(let i = 0; i <= gameResults.length; i++) {
        if(gameResults[i] > gameResults[i+1]) {
            firstPlace = gameResults[0];
            secondPlace = gameResults[1];
        } else if(gameResults[i] === gameResults[i+1]) {
            firstPlace = copia[0];
            secondPlace = copia[1];
        } else if(gameResults[i] === gameResults[i + 1] && copia[i] === copia[i+1]) {
            firstPlace = Math.random(copia.length -1 / 2);
            secondPlace = Math.random(copia.slice(1).length -1 / 2);
        }
    }
    finalSixteenClassification.push(firstPlace, secondPlace);
} 

function removePoints() {
    for(let i = 0; i < finalSixteenClassification.length; i++) {
        finalSixteenClassification[i].goalScore = 0;
        finalSixteenClassification[i].goals = 0;
    }
    callNewMatches();
}

function callNewMatches() {
    if(finalSixteenClassification.length === 16) {
        finalSixteen(); 
    }
}

//confronto das oitavas de final
function finalSixteen() {
    console.log();
    console.log("Oitavas de final")
    for(let i = 0; i < finalSixteenClassification.length / 2; i++) {
        const firstGroup = finalSixteenClassification[i];
        const lastGroup = finalSixteenClassification[finalSixteenClassification.length-1-i]
        match(firstGroup, lastGroup);
    }
    deathMatches()
    removePoints();
    finalEight();
}

function finalEight() {
    console.log();
    console.log("Quartas de final")
    for(let i = 0; i < finalSixteenClassification.length / 2; i++) {
        const firstGroup = finalSixteenClassification[i];
        const lastGroup = finalSixteenClassification[finalSixteenClassification.length-1-i]
        match(firstGroup, lastGroup);
    }
    deathMatches();
    removePoints();
    Semifinal();
}

function Semifinal() {
    console.log();
    console.log("Semifinal")
    for(let i = 0; i < finalSixteenClassification.length / 2; i++) {
        const firstGroup = finalSixteenClassification[i];
        const lastGroup = finalSixteenClassification[finalSixteenClassification.length-1-i]
        match(firstGroup, lastGroup);
    }
    deathMatches();
    removePoints();
    final();
}


function final() {
    console.log();
    console.log("Final")
    for(let i = 0; i < finalSixteenClassification.length / 2; i++) {
        const firstGroup = finalSixteenClassification[i];
        const lastGroup = finalSixteenClassification[finalSixteenClassification.length-1-i]
        match(firstGroup, lastGroup);
    }
    deathMatches();
    
}

//Função que vai definir o grande campeão!
function deathMatches() {
    for(let i = 0; i < finalSixteenClassification.length; i++) {
        const firstGroup = finalSixteenClassification[i];
        const lastGroup = finalSixteenClassification[finalSixteenClassification.length-1-i];

        let initialIndex = finalSixteenClassification.indexOf(firstGroup);
        let finalIndex = finalSixteenClassification.lastIndexOf(lastGroup);

        if(firstGroup.goals > lastGroup.goals) {
            finalSixteenClassification.splice(finalIndex, 1);
        } else if(lastGroup.goals > firstGroup.goals){
            finalSixteenClassification.splice(initialIndex, 1);
        } else {
            finalSixteenClassification.splice(finalIndex, 1);
        }
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
