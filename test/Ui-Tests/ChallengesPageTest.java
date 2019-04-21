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
public class ChallengesPageTest{

    @Rule
    public ActivityTestRule<MainActivity> mainactivitytest1 =new ActivityTestRule<MainActivity>(MainActivity.class);
    private static final String menuXpath1 = "/html/body/ion-nav-view/ion-side-menus/ion-side-menu-content/ion-nav-bar/div[2]/ion-header-bar/div[1]/span/button";
    private static final String challengesMenuXpath = "/html/body/ion-nav-view/ion-side-menus/ion-side-menu/ion-content/div/ion-list/div/ion-item[6]/a";

    @Test
    public void challengeTestCheckButtonsGood() throws Exception {

        /**
         *
         */

        // Login into app to ensure that profile page can be displayed
        SignInPageTest a = new SignInPageTest();
        a.signInPageGoodTest();

        onWebView().withElement(findElement(Locator.XPATH,menuXpath1))
                .perform(DriverAtoms.webClick());

        Thread.sleep(3000);

        onWebView().withElement(findElement(Locator.XPATH,challengesMenuXpath))
                .perform(DriverAtoms.webClick());

        Thread.sleep(3000);

        onWebView().withElement(findElement(Locator.ID, "label3km")).check(webMatches(getText(), containsString("A Great Place To Start")));
        onWebView().withElement(findElement(Locator.ID, "3kilo")).check(webMatches(getText(), containsString("3 km")));

        onWebView().withElement(findElement(Locator.ID, "label5km")).check(webMatches(getText(), containsString("The Next Step")));
        onWebView().withElement(findElement(Locator.ID, "5kilo")).check(webMatches(getText(), containsString("5 km")));

        onWebView().withElement(findElement(Locator.ID, "label10km")).check(webMatches(getText(), containsString("A Serious Goal")));
        onWebView().withElement(findElement(Locator.ID, "10kilo")).check(webMatches(getText(), containsString("10 km")));

        onWebView().withElement(findElement(Locator.ID, "customgoal")).check(webMatches(getText(), containsString("Custom Goal")));
        onWebView().withElement(findElement(Locator.ID, "distance")).check(webMatches(getText(), containsString("Distance (km)")));
        onWebView().withElement(findElement(Locator.ID, "time")).check(webMatches(getText(), containsString("Time (minute)")));

        onWebView().withElement(findElement(Locator.ID, "distancetextbox"))
                   .perform(clearElement())
                   .check(webMatches(getText(),containsString("")));
        onWebView().withElement(findElement(Locator.ID, "timetextbox"))
                   .perform(clearElement())
                   .check(webMatches(getText(),containsString("")));

        Thread.sleep(3000);

    }

    @Test
    public void challengeTestCheckButtonsBad() throws Exception {

        /**
         */

        // Login into app to ensure that profile page can be displayed
        SignInPageTest a = new SignInPageTest();
        a.signInPageGoodTest();

        onWebView().withElement(findElement(Locator.XPATH,menuXpath1))
                .perform(DriverAtoms.webClick());

        Thread.sleep(3000);

        onWebView().withElement(findElement(Locator.XPATH,challengesMenuXpath))
                .perform(DriverAtoms.webClick());

        Thread.sleep(3000);




    }

    @Test
    public void challengeTestStartTimer() throws Exception{
        // Login into app to ensure that profile page can be displayed
        SignInPageTest a = new SignInPageTest();
        a.signInPageGoodTest();

        onWebView().withElement(findElement(Locator.XPATH,menuXpath1))
                .perform(DriverAtoms.webClick());

        Thread.sleep(3000);

        onWebView().withElement(findElement(Locator.XPATH,challengesMenuXpath))
                .perform(DriverAtoms.webClick());

        Thread.sleep(3000);

        onWebView().withElement(findElement(Locator.ID,"3kmbutton"))
                .perform(DriverAtoms.webClick());

        Thread.sleep(3000);

        onWebView().withElement(findElement(Locator.ID,"startrunning"))
                .perform(DriverAtoms.webClick());

        Thread.sleep(10000);

    }

    @Test
    public void challengeTestCustomStartTimer() throws Exception{
        // Login into app to ensure that profile page can be displayed
        SignInPageTest a = new SignInPageTest();
        a.signInPageGoodTest();

        onWebView().withElement(findElement(Locator.XPATH,menuXpath1))
                .perform(DriverAtoms.webClick());

        Thread.sleep(3000);

        onWebView().withElement(findElement(Locator.XPATH,challengesMenuXpath))
                .perform(DriverAtoms.webClick());

        Thread.sleep(3000);

        onWebView().withElement(findElement(Locator.XPATH,"/html/body/ion-nav-view/ion-side-menus/ion-side-menu-content/ion-nav-view/ion-view/ion-content/div/div/div[4]/div[2]/form/label[1]/input"))
                .perform(DriverAtoms.webKeys(String.valueOf(2)));

        Thread.sleep(3000);

        onWebView().withElement(findElement(Locator.XPATH,"/html/body/ion-nav-view/ion-side-menus/ion-side-menu-content/ion-nav-view/ion-view/ion-content/div/div/div[4]/div[2]/form/label[2]/input"))
                .perform(DriverAtoms.webKeys(String.valueOf(3)));

        Thread.sleep(3000);

        onWebView().withElement(findElement(Locator.XPATH,"/html/body/ion-nav-view/ion-side-menus/ion-side-menu-content/ion-nav-view/ion-view/ion-content/div/div/div[4]/div[2]/form/button"))
                .perform(DriverAtoms.webClick());

        Thread.sleep(3000);

        onWebView().withElement(findElement(Locator.ID,"startrunning"))
                .perform(DriverAtoms.webClick());

        Thread.sleep(10000);

    }


}
