package net.khertan.forrunners;
import android.webkit.WebView;

import org.junit.Rule;
import org.junit.Test;
import org.junit.runner.RunWith;

import androidx.test.espresso.web.sugar.Web;
import androidx.test.espresso.web.webdriver.DriverAtoms;
import androidx.test.espresso.web.webdriver.Locator;
import androidx.test.filters.LargeTest;
import androidx.test.rule.ActivityTestRule;
import androidx.test.runner.AndroidJUnit4;

import static androidx.test.espresso.web.assertion.WebViewAssertions.webMatches;
import static androidx.test.espresso.web.sugar.Web.onWebView;
import static androidx.test.espresso.web.webdriver.DriverAtoms.clearElement;
import static androidx.test.espresso.web.webdriver.DriverAtoms.findElement;
import static androidx.test.espresso.web.webdriver.DriverAtoms.getText;
import static org.hamcrest.core.StringContains.containsString;

/**
 * Basic sample that shows the usage of Espresso web showcasing {@link Web#onWebView()} API.
 * <p>
 * The sample has a simple layout which contains a single {@link WebView}. The HTML page displays
 * a form with an input tag and buttons to submit the form.
 */
@LargeTest
@RunWith(AndroidJUnit4.class)
public class ProfilePageTest{

    @Rule
    public ActivityTestRule<MainActivity> mainactivitytest1 =new ActivityTestRule<MainActivity>(MainActivity.class);

    private static final String menuXpath1 = "/html/body/ion-nav-view/ion-side-menus/ion-side-menu-content/ion-nav-bar/div[2]/ion-header-bar/div[1]/span/button";
    private static final String weight = "/html/body/ion-nav-view/ion-side-menus/ion-side-menu-content/ion-nav-view/ion-view/ion-content/div/form/div/label[3]/input";
    private static final String weightbad = "/html/body/ion-nav-view/ion-side-menus/ion-side-menu-content/ion-nav-view/ion-view/ion-content/div/form/div/label[8]/input";
    private static final String height = "/html/body/ion-nav-view/ion-side-menus/ion-side-menu-content/ion-nav-view/ion-view/ion-content/div/form/div/label[4]/input";
    private static final String heightbad = "/html/body/ion-nav-view/ion-side-menus/ion-side-menu-content/ion-nav-view/ion-view/ion-content/div/form/div/label[9]/input";
    private static final String age  = "/html/body/ion-nav-view/ion-side-menus/ion-side-menu-content/ion-nav-view/ion-view/ion-content/div/form/div/label[5]/input";
    private static final String agebad  = "/html/body/ion-nav-view/ion-side-menus/ion-side-menu-content/ion-nav-view/ion-view/ion-content/div/form/div/label[10]/input";
    private static final String gender  = "/html/body/ion-nav-view/ion-side-menus/ion-side-menu-content/ion-nav-view/ion-view/ion-content/div/form/div/label[6]/select";
    private static final String genderbad  = "/html/body/ion-nav-view/ion-side-menus/ion-side-menu-content/ion-nav-view/ion-view/ion-content/div/form/div/label11]/select";
    private static final String activityLevel  = "/html/body/ion-nav-view/ion-side-menus/ion-side-menu-content/ion-nav-view/ion-view/ion-content/div/form/div/label[7]/select";
    private static final String activityLevelbad  = "/html/body/ion-nav-view/ion-side-menus/ion-side-menu-content/ion-nav-view/ion-view/ion-content/div/form/div/label[12]/select";
    private static final String sessionsXpathpage = "/html/body/ion-nav-view/ion-side-menus/ion-side-menu/ion-content/div/ion-list/div/ion-item[1]/a";
    private static final String profileXpathpage = "/html/body/ion-nav-view/ion-side-menus/ion-side-menu/ion-content/div/ion-list/div/ion-item[5]/a";
    private static final String logoutButtonXPath = "/html/body/ion-nav-view/ion-side-menus/ion-side-menu/ion-content/div/ion-list/div/ion-item[10]/button";
    private static final String emailXpath = "/html/body/ion-nav-view/ion-side-menus/ion-side-menu-content/ion-nav-view/ion-view[2]/ion-content/div/form/div/label[1]/input";
    private static final String usernameXpath = "/html/body/ion-nav-view/ion-side-menus/ion-side-menu-content/ion-nav-view/ion-view[2]/ion-content/div/form/div/label[2]/input";

    @Test
    public void profilePageUiTestCheckButtonsGood() throws Exception {

        /**
         * UI Profile Page Validation Test for Our ForRunners Application.
         * This UI test checks if the weight, height, age text boxes are there as well as
         * the gender and activity levels dropdown menus are present.
         * Also, there are tests verifying if the labels on top of the text boxes and
         * dropdown menus are present and written appropriately.
         */

        // Login into app to ensure that profile page can be displayed
        SignInPageTest a = new SignInPageTest();
        a.signInPageGoodTest();

        onWebView().withElement(findElement(Locator.XPATH,menuXpath1))
                .perform(DriverAtoms.webClick());

        Thread.sleep(3000);

        onWebView().withElement(findElement(Locator.XPATH,profileXpathpage))
                .perform(DriverAtoms.webClick());

        onWebView().withElement(findElement(Locator.ID,"emailp"));
        onWebView().withElement(findElement(Locator.ID,"em")).check(webMatches(getText(),containsString("Email")));

        onWebView().withElement(findElement(Locator.ID,"userp"));
        onWebView().withElement(findElement(Locator.ID,"user")).check(webMatches(getText(),containsString("Username")));

        onWebView().withElement(findElement(Locator.XPATH,weight))
                .perform(clearElement())
                .check(webMatches(getText(),containsString("")));
        onWebView().withElement(findElement(Locator.ID,"weightkg")).check(webMatches(getText(),containsString("Weight (Kg) :")));

        onWebView().withElement(findElement(Locator.XPATH,height))
                .perform(clearElement())
                .check(webMatches(getText(),containsString("")));
        onWebView().withElement(findElement(Locator.ID,"heightm")).check(webMatches(getText(),containsString("Height (m) :")));

        onWebView().withElement(findElement(Locator.XPATH,age))
                .perform(clearElement())
                .check(webMatches(getText(),containsString("")));
        onWebView().withElement(findElement(Locator.ID,"age1")).check(webMatches(getText(),containsString("Age :")));

        onWebView().withElement(findElement(Locator.XPATH,gender));
        onWebView().withElement(findElement(Locator.ID,"g")).check(webMatches(getText(),containsString("Gender :")));

        onWebView().withElement(findElement(Locator.XPATH,activityLevel));
        onWebView().withElement(findElement(Locator.ID,"loa")).check(webMatches(getText(),containsString("Level of activity :")));


    }

    @Test
    public void profilePageUiTestCheckButtonsBad() throws Exception {

        /**
         * UI Failing Profile Page Validation Test for Our ForRunners Application.
         * This UI test checks if the weight, height, age text boxes are there as well as
         * the gender and activity levels dropdown menus are present.
         * Also, there are tests verifying if the labels on top of the text boxes and
         * dropdown menus are present and written appropriately.
         * Fails Due to :
         * - email Locator id being wrong
         * - username Locator id being wrong
         * - weight Locator id being wrong
         * - height Locator id being wrong
         * - age Locator id being wrong
         * - gender Locator id being wrong
         * - level of activity Locator id being wrong
         * - level of activity id identifier label being wrong
         * - height label being wrong
         */


        // Login into app to ensure that profile page can be displayed
        SignInPageTest a = new SignInPageTest();
        a.signInPageGoodTest();

        onWebView().withElement(findElement(Locator.XPATH,menuXpath1))
                .perform(DriverAtoms.webClick());

        Thread.sleep(3000);

        onWebView().withElement(findElement(Locator.XPATH,profileXpathpage))
                .perform(DriverAtoms.webClick());

        onWebView().withElement(findElement(Locator.ID,"emailpp"));
        onWebView().withElement(findElement(Locator.ID,"em")).check(webMatches(getText(),containsString("Email")));

        onWebView().withElement(findElement(Locator.ID,"userp"));
        onWebView().withElement(findElement(Locator.ID,"user")).check(webMatches(getText(),containsString("Username")));

        onWebView().withElement(findElement(Locator.XPATH,weightbad))
                .perform(clearElement())
                .check(webMatches(getText(),containsString("")));
        onWebView().withElement(findElement(Locator.ID,"weightkg")).check(webMatches(getText(),containsString("Weight (Kg) :")));

        onWebView().withElement(findElement(Locator.XPATH,heightbad))
                .perform(clearElement())
                .check(webMatches(getText(),containsString("")));
        onWebView().withElement(findElement(Locator.ID,"height")).check(webMatches(getText(),containsString("height(m) :")));

        onWebView().withElement(findElement(Locator.XPATH,agebad))
                .perform(clearElement())
                .check(webMatches(getText(),containsString("")));
        onWebView().withElement(findElement(Locator.ID,"age1")).check(webMatches(getText(),containsString("Age :")));

        onWebView().withElement(findElement(Locator.XPATH,genderbad));
        onWebView().withElement(findElement(Locator.ID,"g")).check(webMatches(getText(),containsString("Gender :")));

        onWebView().withElement(findElement(Locator.XPATH,activityLevelbad));
        onWebView().withElement(findElement(Locator.ID,"levelofactivity")).check(webMatches(getText(),containsString("Level of activity :")));


    }

    /**
     * THE TESTS LISTED BELOW ARE SIMULATION TESTS. THEY ACTUALLY SIMULATE USES CASES THAT
     * STANDARD USERS MIGHT GO THROUGH WHEN USING THE APP.
     */

    public void profilePageTestBad() throws Exception{
        // Login into app to ensure that profile page can be displayed
        SignInPageTest a = new SignInPageTest();
        a.signInPageGoodTest();

        onWebView().withElement(findElement(Locator.XPATH,weight))
                .perform(clearElement())
                .withElement(findElement(Locator.XPATH,weight))
                // Enter text into the input element
                .perform(DriverAtoms.webKeys(String.valueOf(2)))

                .withElement(findElement(Locator.XPATH,weight))
                .perform(clearElement())
                .perform(DriverAtoms.webKeys(String.valueOf(0)))

                .withElement(findElement(Locator.XPATH,height))
                .perform(clearElement())
                .perform(DriverAtoms.webKeys(String.valueOf(0)))

                .withElement(findElement(Locator.XPATH,menuXpath1))
                .perform(DriverAtoms.webClick());

        Thread.sleep(3000);

        onWebView().withElement(findElement(Locator.XPATH,sessionsXpathpage))
                .perform(DriverAtoms.webClick());

        Thread.sleep(3000);

        onWebView().withElement(findElement(Locator.XPATH,"/html/body/ion-nav-view/ion-side-menus/ion-side-menu-content/ion-nav-bar/div[1]/ion-header-bar/div[1]/span/button"))
                .perform(DriverAtoms.webClick())

                .withElement(findElement(Locator.XPATH,profileXpathpage))
                .perform(DriverAtoms.webClick());

        Thread.sleep(3000);
    }

    @Test
    public void profilePageTestGood() throws Exception{
        // Login into app to ensure that profile page can be displayed
        SignInPageTest a = new SignInPageTest();
        a.signInPageGoodTest();

        onWebView().withElement(findElement(Locator.XPATH,weight))
                .withElement(findElement(Locator.XPATH,age))
                .perform(clearElement())
                // Enter text into the input element
                .perform(DriverAtoms.webKeys(String.valueOf(34)))

                .withElement(findElement(Locator.XPATH,weight))
                .perform(clearElement())
                .perform(DriverAtoms.webKeys(String.valueOf(78)))

                .withElement(findElement(Locator.XPATH,height))
                .perform(clearElement())
                .perform(DriverAtoms.webKeys(String.valueOf(2)))

                .withElement(findElement(Locator.XPATH,gender))
                .perform(DriverAtoms.webClick())

                //onWebView(Matchers.allOf(isDisplayed(), isJavascriptEnabled()))
                .withElement(findElement(Locator.XPATH, "/html/body/ion-nav-view/ion-side-menus/ion-side-menu-content/ion-nav-view/ion-view/ion-content/div/form/div/label[6]/select/option[1]"))
                .perform(DriverAtoms.webClick())

                .withElement(findElement(Locator.XPATH, "/html/body/ion-nav-view/ion-side-menus/ion-side-menu-content/ion-nav-view/ion-view/ion-content/div/form/div/label[6]/select/option[2]"))
                .perform(DriverAtoms.webClick())

                .withElement(findElement(Locator.XPATH, " /html/body/ion-nav-view/ion-side-menus/ion-side-menu-content/ion-nav-view/ion-view/ion-content/div/form/div/label[7]/select/option[3]"))
                .perform(DriverAtoms.webClick())

                .withElement(findElement(Locator.XPATH, " /html/body/ion-nav-view/ion-side-menus/ion-side-menu-content/ion-nav-view/ion-view/ion-content/div/form/div/label[7]/select/option[2]"))
                .perform(DriverAtoms.webClick());

        Thread.sleep(3000);

        onWebView().withElement(findElement(Locator.XPATH,menuXpath1))
                .perform(DriverAtoms.webClick());

        Thread.sleep(3000);

        onWebView().withElement(findElement(Locator.XPATH,sessionsXpathpage))
                .perform(DriverAtoms.webClick());

        Thread.sleep(3000);

        onWebView().withElement(findElement(Locator.XPATH,"/html/body/ion-nav-view/ion-side-menus/ion-side-menu-content/ion-nav-bar/div[1]/ion-header-bar/div[1]/span/button"))
                .perform(DriverAtoms.webClick())

                .withElement(findElement(Locator.XPATH,profileXpathpage))
                .perform(DriverAtoms.webClick());

        Thread.sleep(3000);

        onWebView().withElement(findElement(Locator.XPATH,menuXpath1))
                .perform(DriverAtoms.webClick())
                .withElement(findElement(Locator.XPATH,logoutButtonXPath))
                .perform(DriverAtoms.webClick());

        a.signInPageGoodTest();
        Thread.sleep(3000);
    }


}