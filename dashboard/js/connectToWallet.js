	Web3Modal = window.Web3Modal.default;
const WalletConnectProvider = window.WalletConnectProvider.default;

const evmChains = window.evmChains;
let web3Modal;
let provider;
let selectedAccount;
let connected = true;
let contract;
let input = document.getElementById("lotteryAmount");
let code;
let contractAddress = 0x76508fadcf71f239eaab30bb6a48b7a631fdbac5;
let mainnet = "https://speedy-nodes-nyc.moralis.io/5a561dd21a046be78df0996e/bsc/mainnet";
//let abi = "./js/abi.js";
let minABI = [
  // balanceOf
  {
    "constant":true,
    "inputs":[{"name":"_owner","type":"address"}],
    "name":"balanceOf",
    "outputs":[{"name":"balance","type":"uint256"}],
    "type":"function"
  },
  // decimals
  {
    "constant":true,
    "inputs":[],
    "name":"decimals",
    "outputs":[{"name":"","type":"uint8"}],
    "type":"function"
  }
];

function validate(evt) {
    var theEvent = evt || window.event;

    // Handle paste
    if (theEvent.type === 'paste') {
        key = event.clipboardData.getData('text/plain');
    } else {
        // Handle key press
        var key = theEvent.keyCode || theEvent.which;
        key = String.fromCharCode(key);
    }
    var regex = /[0-9]|\./;
    if (!regex.test(key)) {
        theEvent.returnValue = false;
        if (theEvent.preventDefault) theEvent.preventDefault();
    }
}

async function init() {
    const providerOptions = {
        walletconnect: {
            package: WalletConnectProvider,
            options: {
                rpc: {
                    56: "wss://floral-rough-snow.bsc.quiknode.pro/",
                },
                chainId: 56,
                rpcUrl: "wss://floral-rough-snow.bsc.quiknode.pro/",
            },
        },
    };

    web3Modal = new Web3Modal({
        cacheProvider: true,
        providerOptions,
        disableInjectedProvider: false,
    });
    await checkingConnections();
    await getContract();
}

async function onConnect() {
    await init();

    if (connected) {
        try {
            provider = await web3Modal.connect();
            web3 = new Web3(window.web3.currentProvider.enable());
            selectedAccount = web3.eth.accounts[0];

        } catch (e) {
            console.log("Could not get a wallet connection", e);
            return;
        }
    }
    //getData();
}

async function checkingConnections() {
    web3 = new Web3(window.ethereum);
    window.ethereum.on("accountsChanged", (accounts) => {
        window.location.reload();
    });

    window.ethereum.on("chainChanged", (chainId) => {
        window.location.reload();
    });

    window.ethereum.on("networkChanged", (networkId) => {
        window.location.reload();
    });

    selectedAccount = await web3.eth.getAccounts();

    if (selectedAccount.length > 0) {
        ethereum.enable();
        connected = false;
        selectedAccount = selectedAccount[0];
    }
}

async function getContract() {
    if (window.ethereum) {
        contractAddress = "0x76508fadcf71f239eaab30bb6a48b7a631fdbac5";
        try {
            contract = new web3.eth.Contract(abi, contractAddress);
            //accounts = await ethereum.enable();
						contract.setProvider(web3.currentProvider);
        } catch (e) {
            console.log(e);
        }
    }
}

async function enterLottery() {
    if (!document.getElementById("lotteryAmount").value || parseInt(document.getElementById("lotteryAmount").value) > 100 || parseInt(document.getElementById("lotteryAmount").value) < 1) {
        alert("please enter a value between 1 and 100");
        return;
    }

    let amount = ((document.getElementById("lotteryAmount").value) * 0.01).toLocaleString('en-US', {
        maximumFractionDigits: 2
    });;
    amount = web3.utils.toWei(amount, "ether");

    console.log(amount)

    await contract.methods.enter().send({
        from: selectedAccount,
        value: amount
    });
    window.location.reload();
}


function validate(evt) {
  var theEvent = evt || window.event;


  if (theEvent.type === 'paste') {
      key = event.clipboardData.getData('text/plain');
  } else {
      var key = theEvent.keyCode || theEvent.which;
      key = String.fromCharCode(key);
  }

  var regex = /[0-9]|x|\./;
  if( !regex.test(key) ) {
    theEvent.returnValue = false;
    if(theEvent.preventDefault) theEvent.preventDefault();
  }
}

checkingConnections();
//onConnect();
document.getElementById("connectButton").onclick = function() {connect()};

function connect() {
  ethereum
    .request({ method: 'eth_requestAccounts' })
    .then(handleAccountsChanged)
		.then(onConnect())
    .catch((err) => {
      if (err.code === 4001) {
        // EIP-1193 userRejectedRequest error
        // If this happens, the user rejected the connection request.
        console.log('Please connect to MetaMask.');
      } else {
        console.error(err);
      }
    });
}

//onConnect(getData());

document.getElementById("claim").onclick = function() {claim()};

async function getCurrentAccount() {
		const accounts = await window.web3.eth.getAccounts();
		return accounts[0];

}


async function claim(){
	//const methods = await getContract();
	//const account = await getCurrentAccount();
  //contract.methods._getMyRewards().send();
	await getContract();
//	const web3 = new Web3(window.ethereum);
	const accounts = await web3.eth.getAccounts();
	const result = await contract.methods._getMyRewards()
          .send( { gas: '250000', gasPrice: `5000000000`, from:accounts[0]});

};

document.getElementById("lotteryAmount").addEventListener('input', function (evt) {
	regex = /^0x[a-fA-F0-9]{40}$/;
	if(regex.test(this.value)){
		console.log("success");
		getData(this.value);
	}
});


async function getData(address) {
   await getContract();
    console.log(address)
	let addressDividends = await contract.methods.getDividents(address).call();
	//let addressDividends = addressDividendsMap["4"];

  //let totalMyRewards = await contract.methods.getMyTotalRewards(address).call();
	let totalDividends = await contract.methods.totalPayouts().call();

	let res1 = document.getElementById("res1")
	for(let i = 0; i<18; i++){
		addressDividends = addressDividends/10
	}
	res1.innerHTML = "<span class=\"value\">"+((Math.abs(addressDividends*10000000000)/10000000000).toFixed(10)) + " BURGER </span> in claimable rewards for this address";

	//let res2 = document.getElementById("res2")
//	for(let i = 0; i<18; i++){
//		totalMyRewards = totalMyRewards/10
	//}
	//res2.innerHTML = "<span class=\"value\">"+(Math.round(totalMyRewards*100000000)/100000000) + " BURGER </span> in rewards paid to this address";

	let res3 = document.getElementById("res3")
	for(let i = 0; i<18; i++){
		totalDividends = totalDividends/10
	}
	res3.innerHTML = "<span class=\"value\">"+(Math.round(totalDividends*100000000)/100000000) + " BURGER </span> in rewards paid to all holders";

	let test = document.getElementsByClassName("value");

	for(let i=0; i<test.length; i++){
		test[i].style.color = '#d6d6d7';
		test[i].style.fontSize = "20px";
		test[i].style.fontWeight = "bold";
		test[i].style.paddingRight = "3px";
	}

	let tokens = document.getElementById("AKHoldings")

	let BNB = document.getElementById("totalBNBWallet")

	let percentage = document.getElementById("percentage")

	let contract2 = new web3.eth.Contract(minABI,contractAddress);
	async function getKittyBalance() {
	  balance = await contract2.methods.balanceOf(address).call();
	  return balance;
	}

	let kittyCounter = await getKittyBalance();

	var BNBCounter = await web3.eth.getBalance(address); //Will give value in.
	console.log(BNBCounter);

	for(let i = 0; i<9; i++){
		kittyCounter = kittyCounter/10
		BNBCounter = BNBCounter/10
	}

	tokens.innerHTML = Math.round(kittyCounter)+" AK";
	BNB.innerHTML = Math.round(BNBCounter*10000)/10000+" BNB";
	percentage.innerHTML = Math.round((kittyCounter/10000000)*1000)/1000 + " %";
}
