
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
public class SignUpTest {

    @Rule
    public ActivityTestRule<MainActivity> mainactivitytest1 =new ActivityTestRule<MainActivity>(MainActivity.class);


    private static final String goodEmailTest = "claudia.f.feochari@hotmail.com";
    private static final String goodPasswordTest = "test12345";

    private static final String badEmailTest = "testsamplewrongformattedemail";
    private static final String badPasswordTest = "blablabla";

    private static final String profileXpathemail = "/html/body/ion-nav-view/ion-side-menus/ion-side-menu-content/ion-nav-bar/div[2]/ion-header-bar/div[1]/span/button";
    private static final String menuXpath1 = "/html/body/ion-nav-view/ion-side-menus/ion-side-menu-content/ion-nav-bar/div[2]/ion-header-bar/div[1]/span/button";
    private static final String signUpXpath = "/html/body/ion-nav-view/ion-side-menus/ion-side-menu/ion-content/div/ion-list/div/ion-item[3]/a";


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
