$("#transactionBtn").click(function(){
var tx = coinjs.transaction();
		var estimatedTxSize = 10; // <4:version><1:txInCount><1:txOutCount><4:nLockTime>

		tx.lock_time = 0;
		
		seq = 0xffffffff-2; // use RBF

		var currentScript = ; // script

		if (currentScript.match(/^76a914[0-9a-f]{40}88ac$/)) {
			estimatedTxSize += 147
		} else if (currentScript.match(/^5[1-9a-f](?:210[23][0-9a-f]{64}){1,15}5[1-9a-f]ae$/)) {
			// <74:persig <1:push><72:sig><1:sighash> ><34:perpubkey <1:push><33:pubkey> > <32:prevhash><4:index><4:nSequence><1:m><1:n><1:OP>
			var scriptSigSize = (parseInt(currentScript.slice(1,2),16) * 74) + (parseInt(currentScript.slice(-3,-2),16) * 34) + 43
			// varint 2 bytes if scriptSig is > 252
			estimatedTxSize += scriptSigSize + (scriptSigSize > 252 ? 2 : 1)
		} else {
			// underestimating won't hurt. Just showing a warning window anyways.
			estimatedTxSize += 147
		}

		tx.addinput(OUTPUT_TX, TX_ID_NUMBER, TX_SCRIPT, seq); // output tx, tx id number, tx script


		var a = ; //address
		var ad = coinjs.addressDecode(a);
		if(((a!="") && (ad.version == coinjs.pub || ad.version == coinjs.multisig || ad.type=="bech32"))){ // address
			// P2SH output is 32, P2PKH is 34
			estimatedTxSize += (ad.version == coinjs.pub ? 34 : 32)
			tx.addoutput(a, AMOUNT); //addr, amount
		} else if (((a!="") && ad.version === 42)){ // stealth address
			// 1 P2PKH and 1 OP_RETURN with 36 bytes, OP byte, and 8 byte value
			estimatedTxSize += 78
			tx.addstealth(ad, AMOUNT); //addr, amount
		}


		console.log(tx.serialize());
		console.log(tx.size());

	});