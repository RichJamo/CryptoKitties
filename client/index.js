var web3 = new Web3(Web3.givenProvider);

var instance;
var user;
var contractAddress = "0x0b706DC82C073ba7Aa1179094235037A98720476"; //need to put contract address here

$(document).ready(function(){
    window.ethereum.enable().then(function(accounts){
        instance = new web3.eth.Contract(abi, contractAddress, {from: accounts[0]});
        user = accounts[0];

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
