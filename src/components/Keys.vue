<template>
<section class="main">
    <div class="step-container">
        <div class="step">
            <img src="../assets/images/1.svg">
            <p>输入映射过的ETH地址</p>
        </div>
        <div class="step">
            <img src="../assets/images/2.svg">
            <p>点击“查询”，返回EOS公钥符合映射的目标公钥则映射成功</p>
        </div>
        <div class="step">
            <img src="../assets/images/3.svg">
            <p>点击“查询”，如无返回EOS公钥，可能是映射未完成或映射失败</p>
        </div>
    </div>
    <div class="key-container">
        <div>
            <label for="eos">ETH地址</label>
            <input type="text" placeholder="输入你用于映射的ETH地址" id="eos">
        </div>
        <div>
            <label for="eth">EOS公匙</label>
            <input type="text" id="eth" value="WY242420UIOH45689RE0932FHVN9056NM" disabled>
        </div>
    </div>
    <div class="info-divider">
        <div>
            <p>点击【查询】按钮，即可完成得知结果</p>
            <button class="info-button">查询</button>
        </div>
    </div>
  </section>
</template>

<script>
export default {
  name: 'Keys'
}
</script>
