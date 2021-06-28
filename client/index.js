var web3 = new Web3(Web3.givenProvider);

var instance;
var user;
var contractAddress = "0xc7a395E3bf8c1ED2e6121aC6cB80271f89c7B219"; //need to put contract address here

$(document).ready(function(){
    window.ethereum.enable().then(function(accounts){
        instance = new web3.eth.Contract(abi, contractAddress, {from: accounts[0]});
        user = accounts[0];

        console.log(instance);

        instance.events.Birth().on('data', function (event) {
            console.log(event);
            let owner = event.returnValues.owner;
            let kittenId = event.returnValues.kittenId;
            let mumId = event.returnValues.mumId;
            let dadId = event.returnValues.dadId;
            let genes = event.returnValues.genes;
            $("#kittyCreation").css("display", "block");
            $("#kittyCreation").text("owner: " + owner
                + "kittenId: " + kittenId
                + "mumId: " + mumId
                + "dadId: " + dadId
                + "genes: " + genes)
        })
            .on("error", console.error);
    }) //call metamask enable function
})
