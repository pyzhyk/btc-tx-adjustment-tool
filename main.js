function baseLog(e, t) {
    return Math.log(t) / Math.log(e)
}

function selectRadioInRow(e) {
    var t = document.getElementById(e
        .id).getElementsByTagName(
        "input")[0];
    t.checked = !0,
        handleUnconfirmedTXsRadioChange(
            t)
}

function httpGet(e) {
    var t = new XMLHttpRequest;
    return t.open("GET", e, !1), t
        .send(), t.responseText
}
var BTCUSD = JSON.parse(httpGet(
        "https://blockchain.info/ticker"
    )).USD.last,
    error = 0,
    redeemAddr = "",
    redeemAddrData = "",
    TXs = "",
    unconfTXs = "",
    TXInfo = "",
    spentOutputTX = "",
    spentOutputValue = "",
    oldFee = "",
    addrIDInTX = "",
    oldScript = "",
    TXToAdjust = "",
    estimatedTxSize = 10,
    newtx = "";

function fetchAddrData(e) {
    return httpGet(
        "https://api.blockcypher.com/v1/btc/main/addrs/" +
        e + "?limit=10")
}

function fetchRedeemAddrData() {
    return redeemAddr = document
        .getElementById("redeemFrom")
        .value, redeemAddrData =
        fetchAddrData(redeemAddr)
}

function fetchTXs() {
    if (error = 0, newtx = "", newtx =
        coinjs.transaction(), location
        .hash = "#home", document
        .getElementById(
            "unconfirmedTXsTableDiv")
        .innerHTML = "", document
        .getElementById(
            "unconfirmedTXProperties")
        .innerHTML = "", document
        .getElementById(
            "addressAlertBox")
        .innerHTML = "", document
        .getElementById("newTXDiv")
        .setAttribute("style",
            "display: none;"), document
        .getElementById(
            "newTransactionDiv")
        .setAttribute("style",
            "display: none;"), document
        .getElementById(
            "unconfirmedTXTableDiv")
        .setAttribute("style",
            "display: none;"), document
        .getElementById(
            "inputsTableBody")
        .innerHTML = "", document
        .getElementById(
            "outputsTableBody")
        .innerHTML = "", document
        .getElementById(
            "unconfirmedTXsTableDiv")
        .setAttribute("style", ""),
        redeemAddr = document
        .getElementById("redeemFrom")
        .value, 0 !== (unconfTXs = JSON
            .parse(httpGet(
                "https://blockstream.info/api/address/" +
                redeemAddr +
                "/txs/mempool"))).length
    ) {
        document.getElementById(
                "unconfirmedTXsTableDiv"
            ).innerHTML =
            '<h3>Unconfirmed transactions</h3><a href="https://bitcoinexplorer.org/address/' +
            redeemAddr + '">' +
            redeemAddr + "</a></code>";
        for (var e =
                '<table class="table table-sm table-striped table-hover"><thead><tr><th><b>Transaction hash</b></th><th><b>Amount, BTC</b></th><th><b>Date & Time</b></th><th><b>Select</b></th></tr></thead><tbody>',
                t = 0; t < unconfTXs
            .length; t++) {
            var n, d = unconfTXs[t]
                .txid;
            TXInfo = getTXInfo(d), n =
                Number(TXInfo.total);
            var o = new Date(TXInfo
                    .received),
                s = o.getFullYear() +
                "-" + (o.getMonth() +
                    1) + "-" + o
                .getDate() +
                " " + o.getHours() +
                ":" + o.getMinutes() +
                ":" + o.getSeconds();
            e += '<tr id="' + d +
                '" onclick="selectRadioInRow(this);">',
                e += "<td>" + unconfTXs[
                    t].txid + "</td>",
                e += "<td>" + n / 1e8 +
                "</td>", e += "<td>" +
                s + "</td>", e +=
                '<td><input type="radio" id="' +
                d + '" value="' + d +
                '" name="unconfirmedTXsRadio" onchange="handleUnconfirmedTXsRadioChange(this);"></td>',
                e += "</tr>"
        }
        e += "</tbody></table>",
            document.getElementById(
                "unconfirmedTXsTableDiv"
            ).innerHTML += e
    } else 1 != error && (error = 1,
        document.getElementById(
            "addressAlertBox")
        .innerHTML =
        '<div class="alert alert-dismissible alert-danger"><button type="button" class="close" data-dismiss="alert">&times;</button><strong>Oh snap!</strong> All transactions of the provided address are confirmed and hence nonadjustable.</div>'
    )
}

function getTXInfo(e) {
    var t =
        "https://api.blockcypher.com/v1/btc/main/txs/" +
        e;
    return JSON.parse(httpGet(t))
}

function handleUnconfirmedTXsRadioChange(
    e) {
    TXToAdjust = e.value,
        TXToAdjustHEX = httpGet(
            "https://blockstream.info/api/tx/" +
            TXToAdjust + "/hex"),
        decodeTransactionScript(
            TXToAdjustHEX), TXInfo =
        getTXInfo(TXToAdjust), oldFee =
        Number(TXInfo.fees),
        spentOutputValue = Number(TXInfo
            .total);
    var t = document.getElementById(
        "unconfirmedTXProperties");
    t.innerHTML =
        '<h3>Transaction info</h3> <a href="https://bitcoinexplorer.org/tx/' +
        TXToAdjust + '">' + TXToAdjust +
        "</a></code>", t.innerHTML +=
        '<table id="unconfirmedTXPropertiesTable" class="table table-sm"><tbody><tr><td>Input addresses</td><td><ul><div id="inputsList"></div></ul></td></tr> <tr><td>Output addresses</td><td><ul><div id="outputsList"></div></ul></td></tr> <tr><td>Fee, BTC</td><td><div id="feeField"></div></td></tr> <tr><td>Fee per byte, sat</td><td><div id="feePerByteField"></div></td></tr> <tr><td>Priority <span data-toggle="tooltip" title="Probability that the transaction will be added to the next block. The lower the priority of this transaction, the more chances you have to outpace it.">?</span></td><td><div id="priorityField"></div></td></tr></tbody></table>';
    for (var n = 0; n < TXInfo.inputs
        .length; n++) document
        .getElementById("inputsList")
        .innerHTML +=
        '<li><a href="https://bitcoinexplorer.org/address/' +
        TXInfo.inputs[n].addresses +
        '">' + TXInfo.inputs[n]
        .addresses + "</a></li>";
    for (n = 0; n < TXInfo.outputs
        .length; n++) document
        .getElementById("outputsList")
        .innerHTML +=
        '<li><a href="https://bitcoinexplorer.org/address/' +
        TXInfo.outputs[n].addresses +
        '">' + TXInfo.outputs[n]
        .addresses + "</a></li>";
    document.getElementById("feeField")
        .innerHTML = oldFee / 1e8,
        document.getElementById(
            "lowFeeAlertBox-OldFeeField"
        ).innerHTML = Number(TXInfo
            .fees) / 1e8, document
        .getElementById(
            "feePerByteField")
        .innerHTML = Math.round(Number(
            TXInfo.fees) / Number(
            TXInfo.size)), document
        .getElementById("priorityField")
        .innerHTML = TXInfo.preference,
        document.getElementById(
            "newTXDiv").setAttribute(
            "style", ""), document
        .getElementById(
            "unconfirmedTXTableDiv")
        .setAttribute("style", ""),
        document.getElementById(
            "newFeeSlider").value = Math
        .round(baseLog(1.12, 5 *
            oldFee)),
        handleRangeChange(), document
        .getElementById(
            "unconfirmedTXProperties")
        .setAttribute("style", "")
}

function checkFee(e) {
    (e = 1e8 * e) <= oldFee ? document
        .getElementById(
            "lowFeeAlertBox")
        .setAttribute("style", "") :
        document.getElementById(
            "lowFeeAlertBox")
        .setAttribute("style",
            "display: none;")
}

function navbarHashChange() {
    "#about" == location.hash ? (
            document.getElementById(
                "aboutAnchorLi")
            .classList.add("active"),
            document.getElementById(
                "homeAnchorLi")
            .classList.remove("active"),
            document.getElementById(
                "donateAnchorLi")
            .classList.remove("active"),
            document.getElementById(
                "resourcesAnchorLi")
            .classList.remove("active")
        ) : "#donate" == location
        .hash ? (document
            .getElementById(
                "donateAnchorLi")
            .classList.add("active"),
            document.getElementById(
                "homeAnchorLi")
            .classList.remove("active"),
            document.getElementById(
                "aboutAnchorLi")
            .classList.remove("active"),
            document.getElementById(
                "resourcesAnchorLi")
            .classList.remove("active")
        ) : "#resources" == location
        .hash ? (document
            .getElementById(
                "donateAnchorLi")
            .classList.remove("active"),
            document.getElementById(
                "homeAnchorLi")
            .classList.remove("active"),
            document.getElementById(
                "aboutAnchorLi")
            .classList.remove("active"),
            document.getElementById(
                "resourcesAnchorLi")
            .classList.add("active")) :
        (document.getElementById(
                "donateAnchorLi")
            .classList.remove("active"),
            document.getElementById(
                "homeAnchorLi")
            .classList.add("active"),
            document.getElementById(
                "aboutAnchorLi")
            .classList.remove("active"),
            document.getElementById(
                "resourcesAnchorLi")
            .classList.remove("active"))
}

function handleRangeChange() {
    var e = document.getElementById(
            "newFeeSlider"),
        t = (1.12 ** Number(e.value) /
            1e8).toFixed(8);
    document.getElementById(
            "newFeeBTCField").value = t,
        document.getElementById(
            "newFeeUSDField").value = (
            t * BTCUSD).toFixed(2),
        checkFee(t)
}

function onLoad() {
    window.onhashchange =
        navbarHashChange, document
        .getElementById("newFeeSlider")
        .oninput = handleRangeChange,
        navbarHashChange()
}

function genTX() {
    document.getElementById(
            "transactionHexField")
        .value = "";
    var e = Number(document
            .getElementById(
                "newFeeBTCField").value
        ),
        t = spentOutputValue / 1e8 - e,
        n = document.getElementById(
            "newRecipientAddress")
        .value,
        d = coinjs.addressDecode(n);
    estimatedTxSize += d.version ==
        coinjs.pub ? 34 : 32, newtx
        .addoutput(n, 1 * t), document
        .getElementById(
            "transactionHexField")
        .value = newtx.serialize(),
        document.getElementById(
            "txSize").innerHTML = newtx
        .size(), document
        .getElementById(
            "newTransactionDiv")
        .setAttribute("style", ""),
        document.getElementById(
            "unconfirmedTXsTableDiv")
        .setAttribute("style",
            "display: none;"), document
        .getElementById(
            "unconfirmedTXProperties")
        .setAttribute("style",
            "display: none;"), document
        .getElementById(
            "unconfirmedTXTableDiv")
        .setAttribute("style",
            "display: none;"), document
        .getElementById("newTXDiv")
        .setAttribute("style",
            "display: none;"), location
        .hash = "#doneTransaction"
}

function addInput(e, t, n) {
    if (newtx.lock_time = 0, seq =
        4294967293, n.match(
            /^76a914[0-9a-f]{40}88ac$/))
        estimatedTxSize += 147;
    else if (n.match(
            /^5[1-9a-f](?:210[23][0-9a-f]{64}){1,15}5[1-9a-f]ae$/
        )) {
        var d = 74 * parseInt(n.slice(1,
                2), 16) + 34 * parseInt(
                n.slice(-3, -2), 16) +
            43;
        estimatedTxSize += d + (d >
            252 ? 2 : 1)
    } else estimatedTxSize += 147;
    newtx.addinput(e, t, n, seq)
}

function decodeTransactionScript(e) {
    var t = coinjs.transaction()
        .deserialize(e),
        n = "";
    $.each(t.ins, function(e, d) {
            t.extractScriptKey(e);
            n += "<tr>", n +=
                '<td><input class="form-control" type="text" value="' +
                d.outpoint.hash +
                '" readonly></td>',
                n +=
                '<td class="col-xs-1">' +
                d.outpoint.index +
                "</td>", n +=
                '<td class="col-xs-2"><input class="form-control" type="text" value="' +
                Crypto.util
                .bytesToHex(d.script
                    .buffer) +
                '" readonly></td>',
                n += "</tr>",
                addInput(d.outpoint
                    .hash, d
                    .outpoint.index,
                    Crypto.util
                    .bytesToHex(d
                        .script
                        .buffer))
        }), document.getElementById(
            "inputsTableBody")
        .innerHTML = n, n = "", $.each(t
            .outs,
            function(e, t) {
                var d = "";
                if (5 == t.script.chunks
                    .length) d = coinjs
                    .scripthash2address(
                        Crypto.util
                        .bytesToHex(t
                            .script
                            .chunks[2])
                    );
                else if (2 == t.script
                    .chunks.length &&
                    0 == t.script
                    .chunks[0]) d =
                    coinjs
                    .bech32_encode(
                        coinjs.bech32
                        .hrp, [coinjs
                            .bech32
                            .version
                        ].concat(coinjs
                            .bech32_convert(
                                t.script
                                .chunks[
                                    1],
                                8, 5, !0
                            )));
                else {
                    var o = coinjs.pub;
                    coinjs.pub = coinjs
                        .multisig, d =
                        coinjs
                        .scripthash2address(
                            Crypto.util
                            .bytesToHex(
                                t.script
                                .chunks[
                                    1])
                        ), coinjs
                        .pub = o
                }
                n += "<tr>", n +=
                    '<td><input class="form-control" type="text" value="' +
                    d +
                    '" readonly></td>',
                    n +=
                    '<td class="col-xs-1">' +
                    (t.value / 1e8)
                    .toFixed(8) +
                    "</td>", n +=
                    "</tr>"
            }), document.getElementById(
            "outputsTableBody")
        .innerHTML = n
}
