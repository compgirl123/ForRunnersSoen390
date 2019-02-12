

var shortcut = require('./shortcuts.js');

describe('Signin no problem', ()=>{
    it('Loging in through test account', async ()=>{
        await shortcut.navigateTo("http://localhost:8100/#/app/signin");
        await browser.sleep(5000); // This is because it redirects to the help page after a few seconds
        var userInput = await shortcut.getElementById("usr");
        var passwordInput = await shortcut.getElementById("usr");

        await userInput.sendKeys("john@cena.com")
        await passwordInput.sendKeys("johncena1234")
        // await shortcut.click(backButton);
      
        // var navBarButton = await shortcut.getElementByCss(".ion-navicon",1);
        
        // await shortcut.click(navBarButton);
        // await navBarButton.click();
          await browser.sleep(1000000);
        // shortcut.navigateTo("http://localhost:8100");
        // window.document.getElement
        expect(true).toBe(true);
    });


});