async function GetID(name) {
    try{
        var req = await fetch("https://api.euranked.com/users/getallplayers");
        var data = await req.json();

        var player = await data.find(e => e.name == name);
        
        return player.id
    } catch{
        return false
    }
}

async function GetNickname(id) {
    var req = await fetch("https://api.euranked.com/users/getallplayers");
    var data = await req.json();

    var player = await data.find(e => e.id == id);
    
    return player.name
}

async function GetPoints(id) {
    // Get current season value
    var reqSeasons = await fetch(`https://api.euranked.com/seasons/getseasons`);
    var dataSeasons = await reqSeasons.json();
    const currSeason = dataSeasons[0].id;

    // Get points
    var reqPoints = await fetch(`https://api.euranked.com/seasons/getseasondata?season=${currSeason}`);
    var dataPoints = await reqPoints.json();

    var player = await dataPoints.find(e => e.playerId == id);
    var index = dataPoints.indexOf(player);

    player.position = index + 1;

    return player
}

function insertData(id) {
    window.addEventListener('load', async function () {
        const nickname = await GetNickname(id);
        divNickname = document.getElementById('nickname').innerText = nickname;

        const player = await GetPoints(id);
        divPoints = document.getElementById('points').innerText = `${player.score} pts (#${player.position})`;
    })
}

function checkAuth() {
    const nickname = localStorage.getItem('id');
    
    if(nickname){
        return true;
    } else{
        return false;
    }
}

async function Auth(){
    const input = document.getElementById('loginName').value;

    if(input){
        const id = await GetID(input);
        if(id){
            localStorage.setItem('id', id);
            console.log('success login');
            document.location.reload();
        } else {
            alert('Incorrect nickname. Please try again!');
        }
    } else {
        alert('Please enter the nickname!');
    }
}

function changeState(state){
    window.addEventListener('load', async function () {
        if(state == true){
            document.getElementById('unlogged').style.display = 'none';
            document.getElementById('logged').style.display = 'block';

            document.getElementById("logOut").addEventListener("click", () => LogOut());
        } else{
            document.getElementById('unlogged').style.display = 'block';
            document.getElementById('logged').style.display = 'none';

            document.getElementById("loginBtn").addEventListener("click", () => Auth());
        }
    })
}

function LogOut(){
    localStorage.clear('id');
    document.location.reload();
}

async function main() {
    const auth = checkAuth();
    if(auth){
        changeState(true);
        const id = localStorage.getItem('id');
        insertData(id);
        
    } else {
        changeState(false);
    }
}

main()


