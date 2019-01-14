var contractAddress;
var keys;
var account;

function loadData() {
  contractAddress = "KT1U6jj2t2D5WdX3Ez3jKLdtWC96yTzBAAUW";
  eztz.node.setProvider("http://localhost:8732");
  var mnemonic = "submit inside urge possible ripple sudden garage fold birth quality duty bottom genius version slice"
  keys = eztz.crypto.generateKeys(mnemonic, "password");
  account = keys.pkh;
  console.log(account);

  eztz.rpc.getBalance(account).then(function(res) {
    $("#balance").html(res / 1000000);
    $("#account").html(account);
  });

  eztz.contract.watch(contractAddress, 2, function(s){
    console.log("New storage", s);
    var candidateList = s.args[0];
    for (var i=1; i<= candidateList.length; i++) {
      $("#candidate-" + i).html(candidateList[i-1].args[1].int);
    }
    $("#msg").html("");
  });
}

function voteForCandidate() {
  var candidate = $("#candidate").val();
  // eztz.contract.send(contract, from, keys, amount, parameter, fee, gasLimit, storageLimit)
  eztz.contract.send(contractAddress, account, keys, 0, '\"' + candidate + '\"', 1000000, 400000, 60000).then(function(res){
    console.log(res); // Operation result
    $("#msg").html("Please wait for the transaction to complete");
  }).catch(function(e){
    console.log(e);
    $("#msg").html("Error: " + e.error + " - " + e.errors[1].with.args[0].string);
  });
}
