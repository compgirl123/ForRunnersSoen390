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
public class CoachPageTest{

    @Rule
    public ActivityTestRule<MainActivity> mainactivitytest1 =new ActivityTestRule<MainActivity>(MainActivity.class);

    private static final String menuXpath1 = "/html/body/ion-nav-view/ion-side-menus/ion-side-menu-content/ion-nav-bar/div[2]/ion-header-bar/div[1]/span/button";
    private static final String coachXpathpage = "/html/body/ion-nav-view/ion-side-menus/ion-side-menu/ion-content/div/ion-list/div/ion-item[7]/a";

    @Test
    public void coachPageUiTestCheckButtonsGood() throws Exception {

        /**
         * UI Coach Page Validation Test for Our ForRunners Application.
         * This UI test checks if all the elements are displayed on the screen
         * (including a generic image as well as the labels for
         * the Workout and the tips)
         */

        // Login into app to ensure that profile page can be displayed
        SignInPageTest a = new SignInPageTest();
        a.signInPageGoodTest();

        onWebView().withElement(findElement(Locator.XPATH,menuXpath1))
                .perform(DriverAtoms.webClick());

        Thread.sleep(3000);

        onWebView().withElement(findElement(Locator.XPATH,coachXpathpage))
                .perform(DriverAtoms.webClick());

        onWebView().withElement(findElement(Locator.ID,"workoutlogo"));
        onWebView().withElement(findElement(Locator.ID,"workoutlabel")).check(webMatches(getText(),containsString("Workout")));
        onWebView().withElement(findElement(Locator.ID,"workoutsessiondescription")).check(webMatches(getText(),containsString("Workout Session Tutorials")));

        onWebView().withElement(findElement(Locator.ID,"tipslogo"));
        onWebView().withElement(findElement(Locator.ID,"tipslabel")).check(webMatches(getText(),containsString("Tips")));
        onWebView().withElement(findElement(Locator.ID,"tipssessiondescription")).check(webMatches(getText(),containsString("Workout Session Tutorials")));

    }

    @Test
    public void coachPageUiTestCheckButtonsBad() throws Exception {

        /**
         * UI Failing Coach Page Validation Test for Our ForRunners Application.
         * Fails Due to :
         * - Image Locator id being wrong for Workout Image
         * - Description Locator id for Tips being incorrect
         * - Workout description not matching the one shown on the Ui
         */

        // Login into app to ensure that profile page can be displayed
        SignInPageTest a = new SignInPageTest();
        a.signInPageGoodTest();

        onWebView().withElement(findElement(Locator.XPATH,menuXpath1))
                .perform(DriverAtoms.webClick());

        Thread.sleep(3000);

        onWebView().withElement(findElement(Locator.XPATH,coachXpathpage))
                .perform(DriverAtoms.webClick());

        onWebView().withElement(findElement(Locator.ID,"workout"));
        onWebView().withElement(findElement(Locator.ID,"workoutlabel")).check(webMatches(getText(),containsString("Workout")));
        onWebView().withElement(findElement(Locator.ID,"workoutsessiondescription")).check(webMatches(getText(),containsString("Workout Session")));

        onWebView().withElement(findElement(Locator.ID,"tipslogo"));
        onWebView().withElement(findElement(Locator.ID,"tipslabel")).check(webMatches(getText(),containsString("Tips")));
        onWebView().withElement(findElement(Locator.ID,"tipsdescription")).check(webMatches(getText(),containsString("Workout Session Tutorials")));



    }


}