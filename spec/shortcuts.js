
exports.navigateTo = async (href) => {
    await browser.get(href);
}

exports.getElementByCss = async (cssSelector) => {
    var elm = element(by.css(cssSelector));
    var EC = protractor.ExpectedConditions; 
    await browser.waitForAngular();
    await browser.wait(EC.elementToBeClickable(elm), 5000);
    return elm;
}
exports.getElementByCss = async (cssSelector, index) => {
    var elm = element.all(by.css(cssSelector)).get(index);
    var EC = protractor.ExpectedConditions; 
    await browser.waitForAngular();
    await browser.wait(EC.elementToBeClickable(elm), 5000);
    return elm;
}

exports.getElementById = async (id) => {
    var elm = element(by.css(id));
    var EC = protractor.ExpectedConditions; 
    await browser.waitForAngular();
    await browser.wait(EC.elementToBeClickable(elm), 5000);
    return elm;
}

exports.click = async (element) => {
    await browser.waitForAngular();
    await backButton.click();
    await browser.sleep(2000);
    
}
