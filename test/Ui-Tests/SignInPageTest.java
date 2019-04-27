package net.khertan.forrunners;

import android.webkit.WebView;
import org.junit.Rule;
import org.junit.Test;
import org.junit.runner.RunWith;
import androidx.test.espresso.web.sugar.Web;
import androidx.test.espresso.web.webdriver.DriverAtoms;
import androidx.test.espresso.web.webdriver.Locator;
import androidx.test.runner.AndroidJUnit4;
import androidx.test.filters.LargeTest;
import androidx.test.rule.ActivityTestRule;


import static android.support.test.espresso.assertion.ViewAssertions.matches;
import static android.support.test.espresso.matcher.ViewMatchers.isClickable;
import static android.support.test.espresso.matcher.ViewMatchers.isDisplayed;
import static android.support.test.espresso.matcher.ViewMatchers.isJavascriptEnabled;
import static androidx.test.espresso.web.assertion.WebViewAssertions.webContent;
import static androidx.test.espresso.web.assertion.WebViewAssertions.webMatches;
import static androidx.test.espresso.web.model.Atoms.getCurrentUrl;
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
public class SignInPageTest {

    @Rule
    public ActivityTestRule<MainActivity> mainactivitytest1 =new ActivityTestRule<MainActivity>(MainActivity.class);

    private static final String goodEmailTest = "claudia.f.feochari@hotmail.com";
    private static final String goodPasswordTest = "test12345";
    private static final String badEmailTest = "testsamplewrongformattedemail";
    private static final String badPasswordTest = "blablabla";
    private static final String menuXpath1 = "/html/body/ion-nav-view/ion-side-menus/ion-side-menu-content/ion-nav-bar/div[2]/ion-header-bar/div[1]/span/button";
    private static final String menuXpath2 = "/html/body/ion-nav-view/ion-side-menus/ion-side-menu-content/ion-nav-bar/div[2]/ion-header-bar/div[1]/span/button";
    private static final String signInXpath = "/html/body/ion-nav-view/ion-side-menus/ion-side-menu/ion-content/div/ion-list/div/ion-item[1]/a";
    private static final String signUpXpath = "/html/body/ion-nav-view/ion-side-menus/ion-side-menu/ion-content/div/ion-list/div/ion-item[2]/a";
    private static final String submitButtonXpath = "/html/body/ion-nav-view/ion-side-menus/ion-side-menu-content/ion-nav-view/div/ion-view/ion-content/div/div[1]/form/div[3]/button";
    private static final String age = "/html/body/ion-nav-view/ion-side-menus/ion-side-menu-content/ion-nav-view/ion-view/ion-content/div/form/div/label[3]/input";

    @Test
    public void signInTestUiCheckInputsGood() throws Exception {

        /**
         * UI Sign In Page Validation Test for Our ForRunners Application.
         * This UI test checks if the email and password text boxes are empty and are loaded
         * and present on the page.
         * It also checks if the Sign In button is there and has the appropriate label.
         * Also, there are tests verifying if the labels on top of the text boxes are present and
         * written appropriately
         */

        Thread.sleep(7000);

        onWebView()
                .withElement(findElement(Locator.XPATH,menuXpath1)).perform(DriverAtoms.webClick())
                .withElement(findElement(Locator.XPATH,signInXpath)).perform(DriverAtoms.webClick());

        onWebView().withElement(findElement(Locator.ID, "email"))
                .perform(clearElement())
                .withElement(findElement(Locator.ID, "email"))
                .check(webMatches(getText(),containsString("")));

        Thread.sleep(1000);

        onWebView().withElement(findElement(Locator.ID, "password"))
                .perform(clearElement())
                .withElement(findElement(Locator.ID, "password"))
                .check(webMatches(getText(),containsString("")));

        Thread.sleep(2000);

        onWebView().withElement(findElement(Locator.XPATH,submitButtonXpath)).check(webMatches(getText(),containsString("Sign In")));

        Thread.sleep(2000);

        onWebView().withElement(findElement(Locator.ID, "label-email")).check(webMatches(getText(), containsString("Email")));
        onWebView().withElement(findElement(Locator.ID, "label-password")).check(webMatches(getText(), containsString("Password")));
    }

    @Test
    public void signInTestUiCheckInputsBad() throws Exception {

        /**
         * UI Failing Sign In Page Validation Test for Our ForRunners Application.
         * This UI test checks if the email and password text boxes are empty and are loaded
         * and present on the page.
         * It also checks if the Sign In button is there and has the appropriate label.
         * Also, there are tests verifying if the labels on top of the text boxes are present and
         * written appropriately
         * Fails Due to :
         * - email Locator id being wrong
         * - password Locator id being wrong
         * - Sign In Button Label being wrong
         * - Labels Over the Text Box Entries being wrong
         */

        Thread.sleep(7000);

        onWebView()
                .withElement(findElement(Locator.XPATH,menuXpath1)).perform(DriverAtoms.webClick())
                .withElement(findElement(Locator.XPATH,signInXpath)).perform(DriverAtoms.webClick());

        onWebView().withElement(findElement(Locator.ID, "emailbad"))
                .perform(clearElement())
                .withElement(findElement(Locator.ID, "emailbad"));

        Thread.sleep(1000);

        onWebView().withElement(findElement(Locator.ID, "passwordbad"))
                .perform(clearElement())
                .withElement(findElement(Locator.ID, "passwordbad"));

        Thread.sleep(2000);

        onWebView().withElement(findElement(Locator.XPATH,submitButtonXpath));
        onWebView().withElement(findElement(Locator.XPATH,submitButtonXpath)).check(webMatches(getText(),containsString("SIGN IN ")));

        Thread.sleep(2000);

        onWebView().withElement(findElement(Locator.ID, "label-email")).check(webMatches(getText(), containsString("E-mail")));
        onWebView().withElement(findElement(Locator.ID, "label-password")).check(webMatches(getText(), containsString("Pass")));

    }

    /**
     * THE TESTS LISTED BELOW ARE SIMULATION TESTS. THEY ACTUALLY SIMULATE USES CASES THAT
     * STANDARD USERS MIGHT GO THROUGH WHEN USING THE APP.
     */

    @Test
    public void signInPageBadTest() throws Exception {
        /**
         * UI Test simulating an negative and invalid sign in attempt.
         */

        Thread.sleep(7000);
        onWebView().forceJavascriptEnabled();

        onWebView()
                .withElement(findElement(Locator.XPATH,menuXpath1)).perform(DriverAtoms.webClick())
                .withElement(findElement(Locator.XPATH,signInXpath)).perform(DriverAtoms.webClick());

        onWebView().withElement(findElement(Locator.ID, "email"))
                .perform(clearElement())
                .perform(DriverAtoms.webKeys(badEmailTest))
                .withElement(findElement(Locator.ID, "email"))
                .withElement(findElement(Locator.ID, "password"))
                .perform(clearElement())
                .perform(DriverAtoms.webKeys(badPasswordTest))
                .withElement(findElement(Locator.XPATH,submitButtonXpath)).perform(DriverAtoms.webClick())
                .withElement(findElement(Locator.ID, "email2"))
                .check(webMatches(getText(), containsString("Please enter an Email Address")));
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
         * UI Test simulating a valid Sign In Page Validation for Our ForRunners Application.
         */

        Thread.sleep(8000);

        onWebView()
                .withElement(findElement(Locator.XPATH,menuXpath1)).perform(DriverAtoms.webClick())
                .withElement(findElement(Locator.XPATH,signInXpath)).perform(DriverAtoms.webClick());

        onWebView().withElement(findElement(Locator.ID, "email"))
                .perform(clearElement())
                .perform(DriverAtoms.webKeys(goodEmailTest))
                .withElement(findElement(Locator.ID, "email"))
                .withElement(findElement(Locator.ID, "password"))
                .perform(clearElement())
                .perform(DriverAtoms.webKeys(goodPasswordTest))
                .withElement(findElement(Locator.XPATH,submitButtonXpath)).perform(DriverAtoms.webClick());

        Thread.sleep(7000);

        onWebView()
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

    @Test
    public void signInTestCheckInputs() throws Exception {

        /**
         * UI Sign In Page Validation for Our ForRunners Application
         */

        Thread.sleep(7000);

        onWebView()
                .withElement(findElement(Locator.XPATH,menuXpath1)).perform(DriverAtoms.webClick())
                .withElement(findElement(Locator.XPATH,signInXpath)).perform(DriverAtoms.webClick());

        onWebView().withElement(findElement(Locator.ID, "email"))
                .perform(clearElement())
                .withElement(findElement(Locator.ID, "email"))
                .check(webMatches(getText(),containsString("")));
        Thread.sleep(1000);
        onWebView().withElement(findElement(Locator.ID, "password"))
                .perform(clearElement())
                .withElement(findElement(Locator.ID, "password"))
                .check(webMatches(getText(),containsString("")));
        Thread.sleep(2000);
        onWebView().withElement(findElement(Locator.XPATH,submitButtonXpath)).check(webMatches(getText(),containsString("Sign In")));;
        Thread.sleep(2000);
        onWebView().withElement(findElement(Locator.ID, "label-email")).check(webMatches(getText(), containsString("Email")));
        onWebView().withElement(findElement(Locator.ID, "label-password")).check(webMatches(getText(), containsString("Password")));
    }
    @Test
    public void signInTestCheckInputsBad() throws Exception {

        /**
         * UI Sign In Page Validation for Our ForRunners Application
         */

        Thread.sleep(7000);

        // Selects the WebView in your layout. If you have multiple WebViews you can also use a
        // matcher to select a given WebView, onWebView(withId(R.id.web_view)).

        onWebView()
                .withElement(findElement(Locator.XPATH,menuXpath1)).perform(DriverAtoms.webClick())
                .withElement(findElement(Locator.XPATH,signInXpath)).perform(DriverAtoms.webClick());

        onWebView().withElement(findElement(Locator.ID, "emailbad"))
                // checks the input that is inputted and checks if it matches a string.
                // Clear previous input
                .perform(clearElement())
                .withElement(findElement(Locator.ID, "emailbad"));
        //.perform(DriverAtoms.webClick());
        Thread.sleep(1000);
        onWebView().withElement(findElement(Locator.ID, "passwordbad"))
                .perform(clearElement())
                .withElement(findElement(Locator.ID, "passwordbad"));
        //.perform(DriverAtoms.webClick());
        Thread.sleep(2000);
        //.perform(DriverAtoms.webKeys(goodPasswordTest))
        onWebView().withElement(findElement(Locator.XPATH,submitButtonXpath));
        //.perform(DriverAtoms.webClick());
        Thread.sleep(2000);
        onWebView().withElement(findElement(Locator.ID, "label-email")).check(webMatches(getText(), containsString("Email")));
        onWebView().withElement(findElement(Locator.ID, "label-password")).check(webMatches(getText(), containsString("Password")));

    }

    @Test
    public void signInTestCheckLablesBad() throws Exception {

        /**
         * UI Sign In Page Validation for Our ForRunners Application
         */

        Thread.sleep(7000);

        // Selects the WebView in your layout. If you have multiple WebViews you can also use a
        // matcher to select a given WebView, onWebView(withId(R.id.web_view)).

        onWebView()
                .withElement(findElement(Locator.XPATH,menuXpath1)).perform(DriverAtoms.webClick())
                .withElement(findElement(Locator.XPATH,signInXpath)).perform(DriverAtoms.webClick());

        onWebView().withElement(findElement(Locator.XPATH,submitButtonXpath));
        Thread.sleep(2000);
        onWebView().withElement(findElement(Locator.ID, "label-email")).check(webMatches(getText(), containsString("Enter Email")));
        onWebView().withElement(findElement(Locator.ID, "label-password")).check(webMatches(getText(), containsString("Enter Password")));


    }







}
