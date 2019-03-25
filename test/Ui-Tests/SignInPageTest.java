
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
public class SignInPageTest{

    @Rule
    public ActivityTestRule<MainActivity> mainactivitytest1 =new ActivityTestRule<MainActivity>(MainActivity.class);

    private static final String goodEmailTest = "claudia.f.feochari@hotmail.com";
    private static final String goodPasswordTest = "test12345";

    private static final String badEmailTest = "testsamplewrongformattedemail";
    private static final String badPasswordTest = "blablabla";

    private static final String profileXpathemail = "/html/body/ion-nav-view/ion-side-menus/ion-side-menu-content/ion-nav-bar/div[2]/ion-header-bar/div[1]/span/button";
    private static final String menuXpath1 = "/html/body/ion-nav-view/ion-side-menus/ion-side-menu-content/ion-nav-bar/div[2]/ion-header-bar/div[1]/span/button";
    private static final String menuXpath2 = "/html/body/ion-nav-view/ion-side-menus/ion-side-menu-content/ion-nav-bar/div[2]/ion-header-bar/div[1]/span/button";
    private static final String signInXpath = "/html/body/ion-nav-view/ion-side-menus/ion-side-menu/ion-content/div/ion-list/div/ion-item[2]/a";
    private static final String signUpXpath = "/html/body/ion-nav-view/ion-side-menus/ion-side-menu/ion-content/div/ion-list/div/ion-item[3]/a";
    private static final String submitButtonXpath = "/html/body/ion-nav-view/ion-side-menus/ion-side-menu-content/ion-nav-view/div/ion-view/ion-content/div/div[1]/form/div[3]/button";
    private static final String userxpath = "/html/body/ion-nav-view/ion-side-menus/ion-side-menu-content/ion-nav-view/div[2]/ion-view/ion-content/div/div[1]/form/ion-input[1]/div//*[@id=\"Username\"]";


    private static final String errr = "/html/body/ion-nav-view/ion-side-menus/ion-side-menu-content/ion-nav-view/div[2]/ion-view/ion-content/div/div[1]/form/ion-input[1]/div/p";
    private static final String agewrong = "/html/body/ion-nav-view/ion-side-menus/ion-side-menu-content/ion-nav-view/ion-view/ion-content/div/form/div/label[5]/input";
    private static final String profileEmail = "/html/body/ion-nav-view/ion-side-menus/ion-side-menu-content/ion-nav-view/ion-view/ion-content/div/form/div/label[1]/input";
    private static final String age = "/html/body/ion-nav-view/ion-side-menus/ion-side-menu-content/ion-nav-view/ion-view/ion-content/div/form/div/label[3]/input";
    private static final String weight = "/html/body/ion-nav-view/ion-side-menus/ion-side-menu-content/ion-nav-view/ion-view/ion-content/div/form/div/label[4]/input";
    private static final String height = "/html/body/ion-nav-view/ion-side-menus/ion-side-menu-content/ion-nav-view/ion-view/ion-content/div/form/div/label[5]/input";
    private static final String sessionsXpathpage = "/html/body/ion-nav-view/ion-side-menus/ion-side-menu/ion-content/div/ion-list/div/ion-item[1]/a";
    private static final String profileXpathpage = "/html/body/ion-nav-view/ion-side-menus/ion-side-menu/ion-content/div/ion-list/div/ion-item[4]/a";


    @Test
    public void signInPageBadTest() throws Exception {
        /**
         * UI Sign In Page Validation for Our ForRunners Application
         */

        Thread.sleep(7000);
        onWebView().forceJavascriptEnabled();

        // Selects the WebView in your layout. If you have multiple WebViews you can also use a
        // matcher to select a given WebView, onWebView(withId(R.id.web_view)).

        onWebView()
                .withElement(findElement(Locator.XPATH,menuXpath1)).perform(DriverAtoms.webClick())
                .withElement(findElement(Locator.XPATH,signInXpath)).perform(DriverAtoms.webClick());
        //Thread.sleep(7000);
        onWebView().withElement(findElement(Locator.ID, "email"))
                // checks the input that is inputted and checks if it matches a string.
                // Clear previous input
                .perform(clearElement())
                // Enter text into the input element
                .perform(DriverAtoms.webKeys(badEmailTest))
                // Find the submit button
                .withElement(findElement(Locator.ID, "email"))

                .withElement(findElement(Locator.ID, "password"))
                .perform(clearElement())
                .perform(DriverAtoms.webKeys(badPasswordTest))
                .withElement(findElement(Locator.XPATH,submitButtonXpath)).perform(DriverAtoms.webClick())
                .withElement(findElement(Locator.ID, "email2"))
                .check(webMatches(getText(), containsString("Please enter an Email Address")));
        //.check(webMatches(getText(),containsString("c")));

        Thread.sleep(7000);

        try{
            onWebView().withElement(findElement(Locator.XPATH,age)).perform(DriverAtoms.webClick());
        }catch(Exception e) {
            throw e;
        }

    }

    @Test
    public void signInPageGoodTest() throws Exception {

        /**
         * UI Sign In Page Validation for Our ForRunners Application
         */
        //onWebView().forceJavascriptEnabled();
        Thread.sleep(7000);


        // Selects the WebView in your layout. If you have multiple WebViews you can also use a
        // matcher to select a given WebView, onWebView(withId(R.id.web_view)).

        onWebView()
                .withElement(findElement(Locator.XPATH,menuXpath1)).perform(DriverAtoms.webClick())
                .withElement(findElement(Locator.XPATH,signInXpath)).perform(DriverAtoms.webClick());
        //Thread.sleep(7000);
        onWebView().withElement(findElement(Locator.ID, "email"))
                // checks the input that is inputted and checks if it matches a string.
                // Clear previous input
                .perform(clearElement())
                // Enter text into the input element
                .perform(DriverAtoms.webKeys(goodEmailTest))
                // Find the submit button
                .withElement(findElement(Locator.ID, "email"))
                //.check(webMatches(getText(),containsString("c")))
                .withElement(findElement(Locator.ID, "password"))
                .perform(clearElement())
                .perform(DriverAtoms.webKeys(goodPasswordTest))
                .withElement(findElement(Locator.XPATH,submitButtonXpath)).perform(DriverAtoms.webClick());

        Thread.sleep(7000);

        onWebView()
                .withElement(findElement(Locator.ID,"email"))
                //.check(webMatches(getText(), containsString()));
                .check(webMatches(getCurrentUrl(), containsString("file:///android_asset/www/index.html#/app/profile")));

        try
        {
            onWebView().withElement(findElement(Locator.XPATH,age)).perform(DriverAtoms.webClick());
        }
        catch(Exception e)
        {
            throw e;
        }
    }



}
