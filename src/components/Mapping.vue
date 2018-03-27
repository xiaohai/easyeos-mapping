<template>
  <div class="mapping">
    <h1>Welcome to EOS mapping</h1>
    <form class="pure-form pure-form-aligned">
      <fieldset>
        <div class="pure-control-group">
          <input class="pure-input-1-3" v-model="pubKey" type="text" placeholder="EOS public key">
        </div>
        <div class="pure-control-group">
          <input class="pure-input-1-3" v-model="priKey" type="text" placeholder="ETH private key">
        </div>
        <a v-on:click="mapping" class="pure-button pure-input-1-3 pure-button">Mapping</a>
      </fieldset>
    </form>
    <div>
      {{result}}
    </div>
  </div>
</template>

<script>
import Web3 from 'web3'
import Transaction from 'ethereumjs-tx'
import util from 'ethereumjs-util'

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
      priKey: '',
      pubKey: '',
      result: ''
    }
  },
  methods: {
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
