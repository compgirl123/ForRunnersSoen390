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
public class FoodPageTest{

    @Rule
    public ActivityTestRule<MainActivity> mainactivitytest1 =new ActivityTestRule<MainActivity>(MainActivity.class);

    private static final String menuXpath1 = "/html/body/ion-nav-view/ion-side-menus/ion-side-menu-content/ion-nav-bar/div[2]/ion-header-bar/div[1]/span/button";
    private static final String foodXpath = "/html/body/ion-nav-view/ion-side-menus/ion-side-menu/ion-content/div/ion-list/div/ion-item[6]/a";
    private static final String calculatefoodXpath = "/html/body/ion-nav-view/ion-side-menus/ion-side-menu-content/ion-nav-view/ion-view/ion-content/div/ion-list/div/button[1]";
    private static final String applefoodXpath  = "/html/body/ion-nav-view/ion-side-menus/ion-side-menu-content/ion-nav-view/ion-view/ion-content/div/ion-list/div/ion-item[2]";
    private static final String applefoodXpathbad = "/html/body/ion-nav-view/ion-side-menus/ion-side-menu-content/ion-nav-view/ion-view/ion-content/div/ion-list/div/ion-item[20]";
    private static final String nannfoodXpath  = "/html/body/ion-nav-view/ion-side-menus/ion-side-menu-content/ion-nav-view/ion-view/ion-content/div/ion-list/div/ion-item[30]";
    private static final String pastafoodListXpath ="/html/body/ion-nav-view/ion-side-menus/ion-side-menu-content/ion-nav-view/ion-view/ion-content/div/ion-list/div/ion-item[10]//*[@id=\"_label-17\"]";
    private static final String addfoodtoListXpath ="/html/body/ion-nav-view/ion-side-menus/ion-side-menu-content/ion-nav-view/ion-view[2]/ion-content/div/form/div/input";
    private static final String pizzafoodXpath ="/html/body/ion-nav-view/ion-side-menus/ion-side-menu-content/ion-nav-view/ion-view/ion-content/div/ion-list/div/ion-item[23]";
    private static final String deleteListButtonXPath = "/html/body/ion-nav-view/ion-side-menus/ion-side-menu-content/ion-nav-view/ion-view[2]/ion-content/div/div/input";
    private static final String addNewfoodXpath = "/html/body/ion-nav-view/ion-side-menus/ion-side-menu-content/ion-nav-view/ion-view/ion-content/div/ion-list/div/button[2]";
    private static final String addNewFoodNameXpath = "/html/body/ion-nav-view/ion-side-menus/ion-side-menu-content/ion-nav-view/ion-view[2]/ion-content/div/form/div/label[1]/input";
    private static final String amtofNewFoodXpath = "/html/body/ion-nav-view/ion-side-menus/ion-side-menu-content/ion-nav-view/ion-view[2]/ion-content/div/form/div/label[2]/input";
    private static final String unitofNewFoodXpath = "/html/body/ion-nav-view/ion-side-menus/ion-side-menu-content/ion-nav-view/ion-view[2]/ion-content/div/form/div/label[3]/input";
    private static final String caloriesofNewFoodXpath = "/html/body/ion-nav-view/ion-side-menus/ion-side-menu-content/ion-nav-view/ion-view[2]/ion-content/div/form/div/label[4]/input";
    private static final String searchFoodXpath = "/html/body/ion-nav-view/ion-side-menus/ion-side-menu-content/ion-nav-view/ion-view/ion-header-bar";
    private static final String appleLabel = "/html/body/ion-nav-view/ion-side-menus/ion-side-menu-content/ion-nav-view/ion-view/ion-content/div/ion-list/div/ion-item[10]//*[@id=\"_label-9\"]";



    @Test
    public void foodPageUiTestCheckButtonsGood() throws Exception {

        /**
         * UI Food Page Validation Test for Our ForRunners Application.
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

        onWebView().withElement(findElement(Locator.XPATH,foodXpath))
                .perform(DriverAtoms.webClick());

        Thread.sleep(3000);

        onWebView().withElement(findElement(Locator.XPATH,calculatefoodXpath))
                .check(webMatches(getText(),containsString("CALCULATE")))
                .perform(DriverAtoms.webClick());

        Thread.sleep(3000);

        onWebView().withElement(findElement(Locator.ID,"addNewFood"))
                .check(webMatches(getText(),containsString("ADD NEW FOOD")));

        Thread.sleep(3000);

        onWebView().withElement(findElement(Locator.XPATH,searchFoodXpath))
                .check(webMatches(getText(),containsString("")));

        Thread.sleep(3000);

        onWebView().withElement(findElement(Locator.XPATH, applefoodXpath))
                .perform(DriverAtoms.webClick());

        onWebView().withElement(findElement(Locator.XPATH, nannfoodXpath))
                .perform(DriverAtoms.webClick());

        Thread.sleep(3000);


    }

    @Test
    public void foodPageUiTestCheckButtonsBad() throws Exception {

        /**
         * UI Failing Food Page Validation Test for Our ForRunners Application.
         * This UI test checks if the weight, height, age text boxes are there as well as
         * the gender and activity levels dropdown menus are present.
         * Also, there are tests verifying if the labels on top of the text boxes and
         * dropdown menus are present and written appropriately.
         * Fails Due to :
         * - Calculate food Button being wrong (not all capitalized letters)
         * - Locator Id for Add New Food being wrong
         * - Search food path having a String inside the "empty" textbox
         * - Apple having the wrong Xpath
         */

        // Login into app to ensure that profile page can be displayed
        SignInPageTest a = new SignInPageTest();
        a.signInPageGoodTest();

        onWebView().withElement(findElement(Locator.XPATH,menuXpath1))
                .perform(DriverAtoms.webClick());

        Thread.sleep(3000);

        onWebView().withElement(findElement(Locator.XPATH,foodXpath))
                .perform(DriverAtoms.webClick());

        Thread.sleep(3000);

        onWebView().withElement(findElement(Locator.XPATH,calculatefoodXpath))
                .check(webMatches(getText(),containsString("Calculate")))
                .perform(DriverAtoms.webClick());

        Thread.sleep(3000);

        onWebView().withElement(findElement(Locator.ID,"add_new_food"))
                .check(webMatches(getText(),containsString("ADD NEW FOOD")));

        Thread.sleep(3000);

        onWebView().withElement(findElement(Locator.XPATH,searchFoodXpath))
                .check(webMatches(getText(),containsString("stringinhere")));

        Thread.sleep(3000);

        onWebView().withElement(findElement(Locator.XPATH, applefoodXpathbad))
                .perform(DriverAtoms.webClick());

        onWebView().withElement(findElement(Locator.XPATH, nannfoodXpath))
                .perform(DriverAtoms.webClick());

        Thread.sleep(3000);


    }

    /**
     * THE TESTS LISTED BELOW ARE SIMULATION TESTS. THEY ACTUALLY SIMULATE USES CASES THAT
     * STANDARD USERS MIGHT GO THROUGH WHEN USING THE APP.
     */

    @Test
    public void foodPageTestGood() throws Exception{
        // Login into app to ensure that profile page can be displayed
        SignInPageTest a = new SignInPageTest();
        a.signInPageGoodTest();

        onWebView().withElement(findElement(Locator.XPATH,menuXpath1))
                .perform(DriverAtoms.webClick());

        Thread.sleep(3000);

        onWebView().withElement(findElement(Locator.XPATH,foodXpath))
                .perform(DriverAtoms.webClick());

        Thread.sleep(3000);

        onWebView().withElement(findElement(Locator.XPATH,calculatefoodXpath))
                .perform(DriverAtoms.webClick());

        Thread.sleep(3000);

        onWebView().withElement(findElement(Locator.XPATH, applefoodXpath))
                .perform(DriverAtoms.webClick());

        Thread.sleep(3000);

        onWebView().withElement(findElement(Locator.XPATH, addfoodtoListXpath))
                .perform(DriverAtoms.webClick());

        Thread.sleep(3000);

        onWebView().withElement(findElement(Locator.XPATH, pastafoodListXpath))
                .perform(DriverAtoms.webClick());

        Thread.sleep(3000);

        onWebView().withElement(findElement(Locator.XPATH, "/html/body/ion-nav-view/ion-side-menus/ion-side-menu-content/ion-nav-view/ion-view[2]/ion-content/div/form/div/label[2]/input"))
                .perform(clearElement())
                .perform(DriverAtoms.webKeys(String.valueOf(200)));

        Thread.sleep(3000);

        onWebView().withElement(findElement(Locator.XPATH, addfoodtoListXpath))
                .perform(DriverAtoms.webClick());

        Thread.sleep(3000);

        onWebView().withElement(findElement(Locator.XPATH,calculatefoodXpath))
                .perform(DriverAtoms.webClick());

        Thread.sleep(5000);

        onWebView().withElement(findElement(Locator.XPATH,deleteListButtonXPath))
                .perform(DriverAtoms.webClick());

        Thread.sleep(3000);

    }

    @Test
    public void foodPageTestBad() throws Exception{
        // Login into app to ensure that profile page can be displayed
        SignInPageTest a = new SignInPageTest();
        a.signInPageGoodTest();

        onWebView().withElement(findElement(Locator.XPATH,menuXpath1))
                .perform(DriverAtoms.webClick());

        Thread.sleep(3000);

        onWebView().withElement(findElement(Locator.XPATH,foodXpath))
                .perform(DriverAtoms.webClick());

        Thread.sleep(3000);

        onWebView().withElement(findElement(Locator.XPATH,calculatefoodXpath))
                .perform(DriverAtoms.webClick())
                .withElement(findElement(Locator.ID,"fooderrorid"))
                .check(webMatches(getText(), containsString("You have not added any food to calculate.")));

        Thread.sleep(3000);

    }

    @Test
    public void foodPageTestAddNewFood() throws Exception{
        // Login into app to ensure that profile page can be displayed
        SignInPageTest a = new SignInPageTest();
        a.signInPageGoodTest();

        onWebView().withElement(findElement(Locator.XPATH,menuXpath1))
                .perform(DriverAtoms.webClick());

        Thread.sleep(3000);

        onWebView().withElement(findElement(Locator.XPATH,foodXpath))
                .perform(DriverAtoms.webClick());

        Thread.sleep(3000);

        onWebView().withElement(findElement(Locator.ID,"addNewFood"))
                .check(webMatches(getText(),containsString("ADD NEW FOOD")))
                .perform(DriverAtoms.webClick());

        Thread.sleep(3000);

        onWebView().withElement(findElement(Locator.XPATH,addNewFoodNameXpath))
                .perform(DriverAtoms.webClick())
                .perform(clearElement())
                .perform(DriverAtoms.webKeys("Fruit Loops"));

        onWebView().withElement(findElement(Locator.XPATH, amtofNewFoodXpath))
                .perform(DriverAtoms.webClick())
                .perform(clearElement())
                .perform(DriverAtoms.webKeys("2"));

        onWebView().withElement(findElement(Locator.XPATH, unitofNewFoodXpath))
                .perform(DriverAtoms.webClick())
                .perform(clearElement())
                .perform(DriverAtoms.webKeys("cups"));

        onWebView().withElement(findElement(Locator.XPATH, caloriesofNewFoodXpath))
                .perform(DriverAtoms.webClick())
                .perform(clearElement())
                .perform(DriverAtoms.webKeys("150"));

        onWebView().withElement(findElement(Locator.ID,"addNewFood"))
                .check(webMatches(getText(),containsString("ADD NEW FOOD")))
                .perform(DriverAtoms.webClick());

        Thread.sleep(3000);

    }




}
