const URL = "https://estagio.geopostenergy.com/WorldCup/GetAllTeams";
const URL_POST = "https://estagio.geopostenergy.com/WorldCup/InsertFinalResult";
const groups = [];
const teamLetters = ["A", "B", "C", "D", "E", "F", "G", "H"];
const teamMap = new Map();
const classificationMap = new Map();
const firstAndSecondPlaces = [];

//Insere no TeamMap a chave de um grupo, cujo valor inicial é um array vazio
teamLetters.forEach(letter => teamMap.set(letter, []));
teamLetters.forEach(letter => classificationMap.set(letter, []));

const teamLength = 32;
const finals = [];
const losers = [];

const teamHeaders = ["Time A", "Gols", "Saldo de Pontos", "Placar", "Placar", "Saldo de Pontos", "Gols", "Time B"];

const table = createTable();
const tableSixteen = createTable();
const tableEight = createTable();
const tableSemiFinal = createTable();
const tableFinal = createTable();
const champion = document.createElement("h2");
const title = document.createElement("h1");
title.innerText = "Classificação da copa do mundo 2022";
document.body.appendChild(title);

teamHeaders.forEach((header) => {
    const TH = createTh(header);
    table.appendChild(TH);
})

teamHeaders.splice(2, 1);
teamHeaders.splice(4, 1);
teamHeaders.forEach((header) => {
    const TH = createTh(header);
    tableSixteen.appendChild(TH);
})
const trSixteen = createTr();
const groupLetterSixteen = "Oitavas de final";
const tdSixteen = createTd(groupLetterSixteen, teamHeaders.length);
tdSixteen.classList.add("titlePhases")
trSixteen.appendChild(tdSixteen);
tableSixteen.appendChild(trSixteen);

teamHeaders.forEach((header) => {
    const TH = createTh(header);
    tableEight.appendChild(TH);
})
const trEight = createTr();
const groupLetterEight = "Quartas de final";
const tdEight = createTd(groupLetterEight, teamHeaders.length);
tdEight.classList.add("titlePhases")
trEight.appendChild(tdEight);
tableEight.appendChild(trEight);

teamHeaders.forEach((header) => {
    const TH = createTh(header);
    tableSemiFinal.appendChild(TH);
})
const trSemi = createTr();
const groupLetterSemi = "Semifinal";
const tdSemi = createTd(groupLetterSemi, teamHeaders.length);
tdSemi.classList.add("titlePhases")
trSemi.appendChild(tdSemi);
tableSemiFinal.appendChild(trSemi);

teamHeaders.forEach((header) => {
    const TH = createTh(header);
    tableFinal.appendChild(TH);
})

const trFinal = createTr();
const groupLetterFinal = "Final";
const tdFinal = createTd(groupLetterFinal, teamHeaders.length);
tdFinal.classList.add("titlePhases")
trFinal.appendChild(tdFinal);
tableFinal.appendChild(trFinal);

function createTable() {
    return document.createElement('table');
}

function createTh(name) {
    const TH = document.createElement('th');
    TH.innerText = name;
    return TH;
}

function createTr() {
    const TR = document.createElement('tr');
    return TR;
}

function createTd(name, colSpan = 1) {
    const TD = document.createElement('td');
    TD.innerText = name;
    TD.colSpan = colSpan;
    return TD;
}

document.body.appendChild(table);

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
            groups[counter].goals = 0;
            groups[counter].goalScore = 0;
            teamMap.set(team, [].concat(currentValue, groups[counter]));
            i++;
            counter++;
        }
    })

    teamMap.forEach((value, key) => {
        console.log(" ");
        console.log("%cRodando os jogos do grupo " + key, "color: gold; font-size: 22px");
        round(value, key);

        //Obtendo a ordem dos dois primeiros colocados
        classificationGroupFase(value);
    })
    removePoints();
}

//Seleciona as seleções que se enfrentarão
function round(group, key) {
    const tr = createTr();
    const groupLetter = `Grupo ${key}` 
    const td = createTd(groupLetter, teamHeaders.length + 2);
    tr.appendChild(td);
    table.appendChild(tr);
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
function match(teamA, teamB, currentTable) {
    const goalScoreTeamA = randomValues(4);
    const goalScoreTeamB = randomValues(4);

    teamA.goalScore = isNaN(teamA.goalScore) ? 0 : teamA.goalScore;
    teamB.goalScore = isNaN(teamB.goalScore) ? 0 : teamB.goalScore;

    if(goalScoreTeamA > goalScoreTeamB) {
        console.log(`${teamA.Name} venceu a partida de ${goalScoreTeamA} X ${goalScoreTeamB} contra ${teamB.Name}`);
        teamA.goalScore = isNaN(teamA.goalScore) ? 3 : teamA.goalScore + 3;
        teamA.goals = isNaN(teamA.goals) ? 0 : teamA.goals + goalScoreTeamA;
        losers.push(teamB);
    } else if(goalScoreTeamB > goalScoreTeamA) {
        console.log(`${teamB.Name} venceu a partida de ${goalScoreTeamB} X ${goalScoreTeamA} contra ${teamA.Name}`);
        teamB.goalScore = isNaN(teamB.goalScore) ? 3 : teamB.goalScore + 3;
        teamB.goals = isNaN(teamB.goals) ? 0 : teamB.goals + goalScoreTeamB;
        losers.push(teamA)
    } else {
        console.log(`${teamA.Name} e ${teamB.Name} empataram em ${goalScoreTeamA} X ${goalScoreTeamB}`);
        teamA.goalScore = isNaN(teamA.goalScore) ? 1 : teamA.goalScore + 1;
        teamB.goalScore = isNaN(teamB.goalScore) ? 1 : teamB.goalScore + 1;
        teamA.goals = isNaN(teamA.goals) ? 0 : teamA.goals + goalScoreTeamA;
        teamB.goals = isNaN(teamB.goals) ? 0 : teamB.goals + goalScoreTeamB;
        const tieBreaker = randomValues(2);
        tieBreaker === 0 ? losers.push(teamA) : losers.push(teamB);
    }

    if(currentTable === "sixteen") {
        tableSixteen.appendChild(createTableValues(teamA, teamB, goalScoreTeamA, goalScoreTeamB));
        document.body.appendChild(tableSixteen);
    } else if(currentTable === "eight") {
        tableEight.appendChild(createTableValues(teamA, teamB, goalScoreTeamA, goalScoreTeamB));
        document.body.appendChild(tableEight);
    } else if(currentTable === "semi") {
        tableSemiFinal.appendChild(createTableValues(teamA, teamB, goalScoreTeamA, goalScoreTeamB));
        document.body.appendChild(tableSemiFinal);
    } else if(currentTable === "final") {
        tableFinal.appendChild(createTableValues(teamA, teamB, goalScoreTeamA, goalScoreTeamB));
        document.body.appendChild(tableFinal);
    } else {
        table.appendChild(createTableValues(teamA, teamB, goalScoreTeamA, goalScoreTeamB, true));
    }  
}

function createTableValues(teamA, teamB, goalScoreTeamA, goalScoreTeamB, currentTable) {

    const TR1 = createTr();
    const TDA_NAME = createTd(teamA.Name);
    const TDA_GOLS = createTd(teamA.goals);
    const TDA_PLACAR = createTd(goalScoreTeamA);
    
    const TDB_NAME = createTd(teamB.Name);
    const TDB_GOLS = createTd(teamB.goals);
    const TDB_PLACAR = createTd(goalScoreTeamB);
    
    TR1.appendChild(TDA_NAME);
    TR1.appendChild(TDA_GOLS);
    TR1.appendChild(TDA_PLACAR);
    
    TR1.appendChild(TDB_PLACAR);
    TR1.appendChild(TDB_GOLS);
    TR1.appendChild(TDB_NAME);

    if(currentTable) {
        const TDA_SCORE = createTd(teamA.goalScore);
        const TDB_SCORE = createTd(teamB.goalScore);
        TR1.appendChild(TDA_SCORE);
        TR1.appendChild(TDB_SCORE);
    }

    return TR1;
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
    finals.push(firstPlace, secondPlace);
} 

function removePoints() {
    for(let i = 0; i < finals.length; i++) {
        finals[i].goalScore = 0;
        finals[i].goals = 0;
    }
    callNewMatches();
}

function callNewMatches() {
    if(finals.length === 16) {
        finalSixteen(); 
    }
}

//confronto das oitavas de final
function finalSixteen() {
    losers.splice(0, losers.length);
    console.log();
    console.log("Oitavas de final");
    for(let i = 0; i < finals.length / 2; i++) {
        const firstGroup = finals[i];
        const lastGroup = finals[finals.length-1-i]
        match(firstGroup, lastGroup, "sixteen");
    }
    deathMatches()
    removePoints();
    finalEight();
}

function finalEight() {
    losers.splice(0, losers.length);
    console.log();
    console.log("Quartas de final")
    for(let i = 0; i < finals.length / 2; i++) {
        const firstGroup = finals[i];
        const lastGroup = finals[finals.length-1-i]
        match(firstGroup, lastGroup, "eight");
    }
    deathMatches();
    removePoints();
    Semifinal();
}

function Semifinal() {
    losers.splice(0, losers.length);
    console.log();
    console.log("Semifinal")
    for(let i = 0; i < finals.length / 2; i++) {
        const firstGroup = finals[i];
        const lastGroup = finals[finals.length-1-i]
        match(firstGroup, lastGroup, "semi");
    }
    deathMatches();
    removePoints();
    final();
}


async function final() {
    losers.splice(0, losers.length);
    console.log();
    console.log("Final")
    for(let i = 0; i < finals.length / 2; i++) {
        const firstGroup = finals[i];
        const lastGroup = finals[finals.length-1-i]
        match(firstGroup, lastGroup, "final");
        firstAndSecondPlaces.push(firstGroup, lastGroup);
    }
    deathMatches();
    champion.innerText = `O campeão é: ${finals[0].Name}`;
    document.body.appendChild(champion);
    await postData();
}

//Função que vai definir o grande campeão!
function deathMatches() {
    losers.forEach((loser) => {
        finals.splice(finals.indexOf(loser), 1);
    })
}

async function fetchData() {
    return fetch(URL, {
        headers:{
            "git-user": "erickggarcia"
        }  
    }).then(data => data.json())
    .then(json => json.Result);
}

async function postData() {
    const result = {
        "equipeA": finals[0].Token,
        "equipeB": firstAndSecondPlaces[1].Token,
        "golsEquipeA": finals[0].goals,
        "golsEquipeB": firstAndSecondPlaces[1].goals,
        "golsPenaltyTimeA": 0,
        "golsPenaltyTimeB": 0
    }  
    return fetch(URL_POST, {
        method: "POST",
        headers:{
            "git-user": "erickggarcia",
            "Content-Type": "application/json"
        },
        body: JSON.stringify(result)
    }).then((data) => {
        console.log(data);
    }).catch((e) => { 
        console.log(e);
    })
}

function randomValues(size) {
    return Math.floor(Math.random() * size);
}

main();
