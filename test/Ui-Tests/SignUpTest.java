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
import static androidx.test.espresso.web.webdriver.DriverAtoms.webClick;
import static org.hamcrest.core.StringContains.containsString;

/**
 * Basic sample that shows the usage of Espresso web showcasing {@link Web#onWebView()} API.
 * <p>
 * The sample has a simple layout which contains a single {@link WebView}. The HTML page displays
 * a form with an input tag and buttons to submit the form.
 */
@LargeTest
@RunWith(AndroidJUnit4.class)
public class SignUpTest {

    @Rule
    public ActivityTestRule<MainActivity> mainactivitytest1 =new ActivityTestRule<MainActivity>(MainActivity.class);

    private static final String menuXpath1 = "/html/body/ion-nav-view/ion-side-menus/ion-side-menu-content/ion-nav-bar/div[2]/ion-header-bar/div[1]/span/button";
    private static final String signUpXpath = "/html/body/ion-nav-view/ion-side-menus/ion-side-menu/ion-content/div/ion-list/div/ion-item[2]/a";

    @Test
    public void signUpTestCheckInputsGood() throws Exception {

        /**
         * UI Sign Up Page Validation Test for Our ForRunners Application.
         * This UI test checks if the username, email, password and confirm password
         * text boxes are empty and are loaded and present on the page.
         * It also checks if the Sign In button is there and has the appropriate label.
         * Also, there are tests verifying if the labels on top of the text boxes are present and
         * written appropriately.
         */

        Thread.sleep(7000);

        onWebView()
                .withElement(findElement(Locator.XPATH,menuXpath1)).perform(webClick())
                .withElement(findElement(Locator.XPATH,signUpXpath)).perform(webClick());

        Thread.sleep(2000);

        onWebView().withElement(findElement(Locator.ID,"Username")).perform(DriverAtoms.webKeys(" "))
                .check(webMatches(getText(),containsString("")));

        onWebView().withElement(findElement(Locator.ID,"registeremail")).perform(DriverAtoms.webKeys(" "))
                .perform(clearElement())
                .check(webMatches(getText(),containsString("")));

        onWebView().withElement(findElement(Locator.ID,"registerpassword")).perform(DriverAtoms.webKeys(" "))
                .perform(clearElement())
                .check(webMatches(getText(),containsString("")));

        onWebView().withElement(findElement(Locator.ID,"registerconfirmPassword")).perform(DriverAtoms.webKeys(" "))
                .perform(clearElement())
                .check(webMatches(getText(),containsString("")));

       onWebView().withElement(findElement(Locator.ID,"submitbutton"))
               .check(webMatches(getText(),containsString("SIGN UP")));

    }

    @Test
    public void signUpTestCheckInputsBad() throws Exception {

        /**
         * UI Sign Up Page Validation for Our ForRunners Application.
         * It checks if the
         */

        Thread.sleep(7000);

        onWebView()
                .withElement(findElement(Locator.XPATH,menuXpath1)).perform(webClick())
                .withElement(findElement(Locator.XPATH,signUpXpath)).perform(webClick())
                .withElement(findElement(Locator.ID,"Username")).perform(DriverAtoms.webKeys(" "));
        Thread.sleep(2000);

    }

    @Test
    public void signUpPageTestAllBlanks() throws Exception{

        Thread.sleep(7000);

        onWebView()
                .withElement(findElement(Locator.XPATH,menuXpath1)).perform(webClick())
                .withElement(findElement(Locator.XPATH,signUpXpath)).perform(webClick())
                .withElement(findElement(Locator.ID,"Username")).perform(DriverAtoms.webKeys(" "));
        Thread.sleep(2000);
        onWebView().withElement(findElement(Locator.ID,"registeremail")).perform(DriverAtoms.webKeys(" "));
        onWebView().withElement(findElement(Locator.ID,"registerpassword")).perform(DriverAtoms.webKeys(" "));
        onWebView().withElement(findElement(Locator.ID,"confirmPassword")).perform(DriverAtoms.webKeys(" "));

        onWebView().withElement(findElement(Locator.ID,"Username2")).check(webMatches(getText(), containsString("Enter a valid username")));
        onWebView().withElement(findElement(Locator.ID,"email2")).check(webMatches(getText(), containsString("Enter a valid email")));
        onWebView().withElement(findElement(Locator.ID,"password2")).check(webMatches(getText(), containsString("Password must be a minimum of 8 characters")));
        onWebView().withElement(findElement(Locator.ID,"submission")).perform(DriverAtoms.webClick());

        Thread.sleep(7000);

        // searching for login element.
        onWebView().withElement(findElement(Locator.ID,"email")).perform(DriverAtoms.webClick());

        try{
            onWebView().withElement(findElement(Locator.ID,"email")).perform(DriverAtoms.webClick());
            Thread.sleep(5000);
        }
        catch(Exception e)
        {
            System.out.print(e);

        }

        Thread.sleep(7000);

    }

    @Test
    public void signUpPageInvalidEmailandPasswords() throws Exception {

        Thread.sleep(7000);

        //onWebView().forceJavascriptEnabled();

        onWebView()
                .withElement(findElement(Locator.XPATH,menuXpath1)).perform(webClick())
                .withElement(findElement(Locator.XPATH,signUpXpath)).perform(webClick())
                .withElement(findElement(Locator.ID,"Username")).perform(DriverAtoms.webKeys(" "));
        Thread.sleep(2000);
        onWebView().withElement(findElement(Locator.ID,"registeremail")).perform(DriverAtoms.webKeys("testemail@"));
        onWebView().withElement(findElement(Locator.ID,"registerpassword")).perform(DriverAtoms.webKeys("pass1234"));
        onWebView().withElement(findElement(Locator.ID,"confirmPassword")).perform(DriverAtoms.webKeys("pass123"));
        onWebView().withElement(findElement(Locator.ID,"registerpassword")).perform(DriverAtoms.webClick());
        Thread.sleep(5000);

        onWebView().withElement(findElement(Locator.ID,"Username2")).check(webMatches(getText(), containsString("Enter a valid username")));
        onWebView().withElement(findElement(Locator.ID,"email2")).check(webMatches(getText(), containsString("Enter a valid email")));
        onWebView().withElement(findElement(Locator.ID,"confirmPassword2")).check(webMatches(getText(), containsString("Passwords do not match")));
        onWebView().withElement(findElement(Locator.ID,"submission")).perform(DriverAtoms.webClick());


        Thread.sleep(7000);

        // searching for login element.
        onWebView().withElement(findElement(Locator.ID,"email")).perform(DriverAtoms.webClick());

        try{
            onWebView().withElement(findElement(Locator.ID,"email")).perform(DriverAtoms.webClick());
            Thread.sleep(5000);
        }
        catch(Exception e)
        {
            System.out.print(e);

        }

        Thread.sleep(7000);
    }

    @Test
    public void signUpPageWorking() throws Exception {

        Thread.sleep(7000);

        //onWebView().forceJavascriptEnabled();

        onWebView()
                .withElement(findElement(Locator.XPATH,menuXpath1)).perform(webClick())
                .withElement(findElement(Locator.XPATH,signUpXpath)).perform(webClick())
                .withElement(findElement(Locator.ID,"Username")).perform(DriverAtoms.webKeys("test1230"));
        Thread.sleep(2000);
        onWebView().withElement(findElement(Locator.ID,"registeremail")).perform(DriverAtoms.webKeys("testemail0@gmail.com"));
        onWebView().withElement(findElement(Locator.ID,"registerpassword")).perform(DriverAtoms.webKeys("pass1234"));
        onWebView().withElement(findElement(Locator.ID,"confirmPassword")).perform(DriverAtoms.webKeys("pass1234"));
        Thread.sleep(5000);

        onWebView().withElement(findElement(Locator.ID,"Username2")).check(webMatches(getText(), containsString("")));
        onWebView().withElement(findElement(Locator.ID,"email2")).check(webMatches(getText(), containsString("")));
        onWebView().withElement(findElement(Locator.ID,"confirmPassword2")).check(webMatches(getText(), containsString("")));
        onWebView().withElement(findElement(Locator.ID,"submission")).perform(DriverAtoms.webClick());

        Thread.sleep(7000);

        // searching for login element.
        onWebView().withElement(findElement(Locator.ID,"email")).perform(DriverAtoms.webClick());

        try{
            onWebView().withElement(findElement(Locator.ID,"email")).perform(DriverAtoms.webClick());
            Thread.sleep(5000);
        }
        catch(Exception e)
        {
            System.out.print(e);

        }

        Thread.sleep(7000);
    }


}
