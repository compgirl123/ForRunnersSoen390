
package net.khertan.forrunners;

import android.content.Intent;
import android.support.test.espresso.matcher.ViewMatchers;
import android.webkit.WebView;

import org.hamcrest.Matchers;
import org.junit.Before;
import org.junit.Rule;
import org.junit.Test;
import org.junit.runner.RunWith;

import java.lang.reflect.Array;

import androidx.test.espresso.base.DefaultFailureHandler;
import androidx.test.espresso.web.model.Atoms;
import androidx.test.espresso.web.sugar.Web;
import androidx.test.espresso.web.webdriver.DriverAtoms;
import androidx.test.espresso.web.webdriver.Locator;
import androidx.test.ext.junit.runners.AndroidJUnit4;
import androidx.test.filters.LargeTest;
import androidx.test.rule.ActivityTestRule;


import static android.support.test.espresso.matcher.ViewMatchers.isClickable;
import static android.support.test.espresso.matcher.ViewMatchers.isDisplayed;
import static android.support.test.espresso.matcher.ViewMatchers.isJavascriptEnabled;
import static androidx.test.espresso.web.assertion.WebViewAssertions.webContent;
import static androidx.test.espresso.web.assertion.WebViewAssertions.webMatches;
import static androidx.test.espresso.web.matcher.DomMatchers.hasElementWithId;
import static androidx.test.espresso.web.model.Atoms.getCurrentUrl;
import static androidx.test.espresso.web.sugar.Web.onWebView;
import static androidx.test.espresso.web.webdriver.DriverAtoms.clearElement;
import static androidx.test.espresso.web.webdriver.DriverAtoms.findElement;


import static androidx.test.espresso.web.webdriver.DriverAtoms.getText;
import static androidx.test.espresso.web.webdriver.DriverAtoms.webClick;
import static org.hamcrest.CoreMatchers.equalTo;

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
    private static final String foodXpath = "/html/body/ion-nav-view/ion-side-menus/ion-side-menu/ion-content/div/ion-list/div/ion-item[5]/a";
    private static final String calculatefoodXpath = "/html/body/ion-nav-view/ion-side-menus/ion-side-menu-content/ion-nav-view/ion-view/ion-content/div/ion-list/div/button[1]";
    private static final String applefoodXpath = "/html/body/ion-nav-view/ion-side-menus/ion-side-menu-content/ion-nav-view/ion-view/ion-content/div/ion-list/div/ion-item[2]//*[@id=\"_label-9\"]";
    private static final String pastafoodListXpath ="/html/body/ion-nav-view/ion-side-menus/ion-side-menu-content/ion-nav-view/ion-view/ion-content/div/ion-list/div/ion-item[10]//*[@id=\"_label-17\"]";
    private static final String addfoodtoListXpath ="/html/body/ion-nav-view/ion-side-menus/ion-side-menu-content/ion-nav-view/ion-view[2]/ion-content/div/form/div/input";
    private static final String pizzafoodXpath ="/html/body/ion-nav-view/ion-side-menus/ion-side-menu-content/ion-nav-view/ion-view/ion-content/div/ion-list/div/ion-item[23]";
    private static final String deleteListButtonXPath = "/html/body/ion-nav-view/ion-side-menus/ion-side-menu-content/ion-nav-view/ion-view[2]/ion-content/div/div/input";
    private static final String addNewfoodXpath = "/html/body/ion-nav-view/ion-side-menus/ion-side-menu-content/ion-nav-view/ion-view/ion-content/div/ion-list/div/button[2]";
    private static final String addNewFoodNameXpath = "/html/body/ion-nav-view/ion-side-menus/ion-side-menu-content/ion-nav-view/ion-view[2]/ion-content/div/form/div/label[1]/input";
    private static final String amtofNewFoodXpath = "/html/body/ion-nav-view/ion-side-menus/ion-side-menu-content/ion-nav-view/ion-view[2]/ion-content/div/form/div/label[2]/input";
    private static final String unitofNewFoodXpath = "/html/body/ion-nav-view/ion-side-menus/ion-side-menu-content/ion-nav-view/ion-view[2]/ion-content/div/form/div/label[3]/input";
    private static final String caloriesofNewFoodXpath = "/html/body/ion-nav-view/ion-side-menus/ion-side-menu-content/ion-nav-view/ion-view[2]/ion-content/div/form/div/label[4]/input";
    private static final String addNewFoodXpath = "/html/body/ion-nav-view/ion-side-menus/ion-side-menu-content/ion-nav-view/ion-view[2]/ion-content/div/form/div/input";


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

        onWebView().withElement(findElement(Locator.XPATH,addNewfoodXpath))
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

        onWebView().withElement(findElement(Locator.XPATH, addNewFoodXpath))
                .perform(DriverAtoms.webClick());

        Thread.sleep(3000);

    }




}
