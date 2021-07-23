var instance;
var user;
var KittyIds;
var Kitties = [];
var contractAddress = "0x0b706DC82C073ba7Aa1179094235037A98720476"; //need to put contract address here

/*****************************************/
/* Detect the MetaMask Ethereum provider */
/*****************************************/

// import detectEthereumProvider from '@metamask/detect-provider';

// this returns the provider, or null if it wasn't detected
// const provider = await detectEthereumProvider();
const provider = new ethers.providers.Web3Provider(window.ethereum)
const signer = provider.getSigner()

if (provider) {
    startApp(provider); // Initialize your app
} else {
    console.log('Please install MetaMask!');
}

async function startApp(provider) {
    // If the provider returned by detectEthereumProvider is not the same as
    // window.ethereum, something is overwriting it, perhaps another wallet.
    if (provider !== window.ethereum) {
        console.error('Do you have multiple wallets installed?');
    }

    const accounts = await ethereum.request({ method: 'eth_accounts' });
    user = accounts[0];
    
    kittyIDs = await getKittiesByOwner(user);

    for (i = 0; i < kittyIDs.length; i++) {
        kittyGenes = await getKittyGenes(kittyIDs[i])
        renderMultipleCats(i, convertDNAfromIntToObject(kittyGenes))
    }
}

async function getKittyGenes(_kittyID) {
    kittyContract = new ethers.Contract(contractAddress, abi, signer);
    try {
        kittyGenes = await kittyContract.getKittyGenes(_kittyID);
        return kittyGenes;
    } catch (error) {
        console.log(error);
    }
}

async function getKittiesByOwner(_owner) {
    kittyContract = new ethers.Contract(contractAddress, abi, signer);
    try {
        kittyIDs = await kittyContract.getKittiesByOwner(_owner);
        return kittyIDs;
    } catch (error) {
        console.log(error);
    }
}