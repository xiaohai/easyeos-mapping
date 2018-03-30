function init() {
    var icon1 = $('#icon1');
    var icon2 = $('#icon2');
    var tabBtn1 = $('#tabBtn1');
    var tabBtn2 = $('#tabBtn2');
    var ethContainer = $('#ethContainer');
    var keystoreContainer = $('#keystoreContainer');
    var keyPassContainer = $('#keyPassContainer');
    var inquiryContainer = $('#inquiryContainer');
    var resultContainer = $('#resultContainer');
    tabBtn1.on('click',function () {
        icon1.show();
        icon2.hide();
        tabBtn1.addClass('tab-active');
        tabBtn2.removeClass('tab-active');
        ethContainer.show();
        keystoreContainer.hide();
        keyPassContainer.hide();
        inquiryContainer.hide();
        resultContainer.hide();
    });
    tabBtn2.on('click',function () {
        icon2.show();
        icon1.hide();
        tabBtn1.removeClass('tab-active');
        tabBtn2.addClass('tab-active');
        ethContainer.hide();
        keystoreContainer.show();
        keyPassContainer.show();
        inquiryContainer.show();
        resultContainer.show();
    })
}
init();
