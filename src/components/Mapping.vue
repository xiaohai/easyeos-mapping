<template>
  <section class="main">
    <h2 class="main-title">点击生成EOS密钥对，生成EOS公钥、私钥</h2>
    <p class="tip">请您妥善储存私钥，可以抄在纸上，放到你觉得安全的地方。EOS主网上线后，EOS代币将存在公钥对应的地址中，此时仅能通过你保存的EOS私钥来控制转账。所以不要告诉亲戚朋友，也不能告诉你老婆！</p>
    <div class="keys">
        <label>EOS公匙</label>
        <div>
            <input id="eos_pub" type="text" class="key-input" v-model="eos_pub" placeholder="EOS公钥">
            <button class="copy-btn" data-clipboard-target="#eos_pub">复制公匙</button>
        </div>
        <label>EOS私匙</label>
        <div>
            <input id="eos_pri" type="text" class="key-input" v-model="eos_pri" placeholder="EOS私钥">
            <button class="copy-btn" data-clipboard-target="#eos_pri">复制私匙</button>
        </div>
    </div>
    <div class="info-divider">
        <div>
            <p>这是第一步，点击【生成EOS密匙对】</p>
            <button class="info-button" v-on:click="keygen">生成EOS密匙对</button>
        </div>
    </div>
    <div class="step-container">
        <div class="step">
            <img src="../assets/images/1.svg">
            <p>粘贴你刚才复制的EOS公钥到对应输入框</p>
        </div>
        <div class="step">
            <img src="../assets/images/2.svg">
            <p>输入ETH私钥，以解锁你包含EOS代币的ETH钱包</p>
        </div>
        <div class="step">
            <img src="../assets/images/3.svg">
            <p>映射是调用合约的过程，你需要准备少量的ETH以支付以太网络手续费</p>
        </div>
    </div>
    <p class="tip">声明：EasyEos团队提供免费、开源的映射工具，绝不会以任何形式使用或储存用户私钥</p>
    <div class="tab-btn-container">
        <button class="tab-btn tab-active" id="tabBtn1">用明文私匙</button>
        <button class="tab-btn key-btn" id="tabBtn2">
            <img src="../assets/images/Recommend1_icon.svg" id="icon1">
            <img src="../assets/images/Recommend2_icon.svg" id="icon2" style="display: none">
            <span>用Keystore+密码</span>
        </button>
    </div>
    <div class="key-container">
        <div>
            <label for="eos">EOS公匙</label>
            <input type="text" placeholder="这里输入EOS公钥，你刚才复制过的" id="eos">
        </div>
        <div id="ethContainer">
            <label for="eth">ETH私匙</label>
            <input type="password" id="eth">
        </div>
        <div id="keystoreContainer" style="display: none">
            <label for="keystore">Keystore</label>
            <input type="text" id="keystore" placeholder="请将keystore内容粘贴在此处">
        </div>
        <div id="keyPassContainer" style="display: none">
            <label for="keystorePass">Keystore密码</label>
            <input type="password" id="keystorePass">
        </div>
        <div>
            <label for="gwei">GWEI</label>
            <input type="text" placeholder="填2-6，不填默认2" id="gwei">
        </div>
    </div>
    <div class="info-divider">
        <div>
            <p>点击【现在映射】按钮，即可完成映射</p>
            <button class="info-button">现在映射</button>
        </div>
    </div>
    <div class="result" id="resultContainer" style="display: none">
        <p>合约验证时间取决于矿工手续费。您可能需要等待一段时间，直至合约达到12个区块确认。如区块浏览器看不到该hash，可能验证失败，您可重新映射。如该hash已有12个区块验证，可点击右下角查询结果。</p>
        <div>
            <label>映射结果</label>
            <input type="text" value="0x123214fsaf142114" disabled>
        </div>
    </div>
    <div class="info-divider" id="inquiryContainer" style="display: none">
        <div>
            <p>没有成功的自信？点击【查询结果】</p>
            <button class="info-button">查询结果</button>
        </div>
    </div>
  </section>
</template>

<script>
import Web3 from 'web3'
import Transaction from 'ethereumjs-tx'
import util from 'ethereumjs-util'
import ecc from 'eosjs-ecc'
import ClipboardJS from 'clipboard'

new ClipboardJS('.copy-btn')

// init web3
let web3
if (typeof web3 !== 'undefined') {
  web3 = new Web3(web3.currentProvider)
} else {
  // set the provider you want from Web3.providers
  web3 = new Web3(new Web3.providers.HttpProvider('https://mainnet.infura.io/HcyKnfsZ0pvLCWg1URtv'))
}

const eos = {
  address: '0xd0a6E6C54DbC68Db5db3A091B171A77407Ff7ccf',
  abi: '[{"constant":true,"inputs":[{"name":"","type":"uint256"},{"name":"","type":"address"}],"name":"claimed","outputs":[{"name":"","type":"bool"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"owner_","type":"address"}],"name":"setOwner","outputs":[],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"time","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"totalSupply","outputs":[{"name":"","type":"uint128"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"foundersAllocation","outputs":[{"name":"","type":"uint128"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"day","type":"uint256"}],"name":"claim","outputs":[],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"foundersKey","outputs":[{"name":"","type":"string"}],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"","type":"uint256"},{"name":"","type":"address"}],"name":"userBuys","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"day","type":"uint256"}],"name":"createOnDay","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":false,"inputs":[],"name":"freeze","outputs":[],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"keys","outputs":[{"name":"","type":"string"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"startTime","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"authority_","type":"address"}],"name":"setAuthority","outputs":[],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"dailyTotals","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"owner","outputs":[{"name":"","type":"address"}],"payable":false,"type":"function"},{"constant":false,"inputs":[],"name":"buy","outputs":[],"payable":true,"type":"function"},{"constant":true,"inputs":[],"name":"openTime","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"EOS","outputs":[{"name":"","type":"address"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"today","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"authority","outputs":[{"name":"","type":"address"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"eos","type":"address"}],"name":"initialize","outputs":[],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"createFirstDay","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":false,"inputs":[],"name":"claimAll","outputs":[],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"timestamp","type":"uint256"}],"name":"dayFor","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"day","type":"uint256"},{"name":"limit","type":"uint256"}],"name":"buyWithLimit","outputs":[],"payable":true,"type":"function"},{"constant":false,"inputs":[],"name":"collect","outputs":[],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"numberOfDays","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"key","type":"string"}],"name":"register","outputs":[],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"createPerDay","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"inputs":[{"name":"_numberOfDays","type":"uint256"},{"name":"_totalSupply","type":"uint128"},{"name":"_openTime","type":"uint256"},{"name":"_startTime","type":"uint256"},{"name":"_foundersAllocation","type":"uint128"},{"name":"_foundersKey","type":"string"}],"payable":false,"type":"constructor"},{"payable":true,"type":"fallback"},{"anonymous":false,"inputs":[{"indexed":false,"name":"window","type":"uint256"},{"indexed":false,"name":"user","type":"address"},{"indexed":false,"name":"amount","type":"uint256"}],"name":"LogBuy","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"window","type":"uint256"},{"indexed":false,"name":"user","type":"address"},{"indexed":false,"name":"amount","type":"uint256"}],"name":"LogClaim","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"user","type":"address"},{"indexed":false,"name":"key","type":"string"}],"name":"LogRegister","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"amount","type":"uint256"}],"name":"LogCollect","type":"event"},{"anonymous":false,"inputs":[],"name":"LogFreeze","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"authority","type":"address"}],"name":"LogSetAuthority","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"owner","type":"address"}],"name":"LogSetOwner","type":"event"}]'
}

const contract = web3.eth.contract(JSON.parse(eos.abi)).at(eos.address)

export default {
  name: 'Mapping',
  data: function () {
    return {
      eos_pub: '',
      eos_pri: '',
      priKey: '',
      pubKey: '',
      result: ''
    }
  },
  methods: {
    keygen: function () {
      const c = this;
      ecc.randomKey().then(privateWif =>  {
        c.eos_pri = privateWif;
        c.eos_pub = ecc.privateToPublic(privateWif);
      });
    },
    mapping: function () {
      const c = this
      try {
        const privateKey = Buffer.from(this.priKey, 'hex')
        const address = util.bufferToHex(util.privateToAddress(privateKey))

        const number = web3.eth.getTransactionCount(address)

        var tx = new Transaction(null, 1)
        tx.nonce = number
        tx.to = eos.address
        tx.gasPrice = 2000000000
        tx.gasLimit = 100000
        tx.value = 0
        tx.data = contract.register.getData(c.pubKey)

        tx.sign(privateKey)
        var serializedTx = tx.serialize()
        web3.eth.sendRawTransaction('0x' + serializedTx.toString('hex'), function (err, hash) {
          if (err) {
            c.result = err.message
            return
          }
          c.result = 'success:' + hash
        })
      } catch (e) {
        this.result = e.message
      }
    }
  }
}
</script>
