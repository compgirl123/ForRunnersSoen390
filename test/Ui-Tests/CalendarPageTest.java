
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
public class CalendarPageTest{

    @Rule
    public ActivityTestRule<MainActivity> mainactivitytest1 =new ActivityTestRule<MainActivity>(MainActivity.class);

    private static final String menuXpath1 = "/html/body/ion-nav-view/ion-side-menus/ion-side-menu-content/ion-nav-bar/div[2]/ion-header-bar/div[1]/span/button";
    private static final String calendarMenuXpath = "/html/body/ion-nav-view/ion-side-menus/ion-side-menu/ion-content/div/ion-list/div/ion-item[8]/a";
    private static final String addnewEvent = "/html/body/ion-nav-view/ion-side-menus/ion-side-menu-content/ion-nav-bar/div[2]/ion-header-bar/div[2]/span/button";
    private static final String eventName = "/html/body/ion-nav-view/ion-side-menus/ion-side-menu-content/ion-nav-view/ion-view[3]/ion-content/div/form/div/label[1]/input";
    private static final String startTime = "/html/body/ion-nav-view/ion-side-menus/ion-side-menu-content/ion-nav-view/ion-view[3]/ion-content/div/form/div/label[3]/input";
    private static final String endTime = "/html/body/ion-nav-view/ion-side-menus/ion-side-menu-content/ion-nav-view/ion-view[3]/ion-content/div/form/div/label[4]/input";

    @Test
    public void calendarUiClickTestGood() throws Exception{

        /**
         * UI Calendar Page Validation Test for Our ForRunners Application.
         * This UI test checks if the "+" button on the top right corner is present as well as
         * what occurs when that button is clicked.
         * After that button is clicked, it checks if the event name textbox, date dropdown
         * start time and end time text box are present as well as their labels.
         * The label for the save new event button is checked too!
         */

        // Login into app to ensure that profile page can be displayed
        SignInPageTest a = new SignInPageTest();
        a.signInPageGoodTest();

        onWebView().withElement(findElement(Locator.XPATH,menuXpath1))
                .perform(DriverAtoms.webClick());

        Thread.sleep(3000);

        onWebView().withElement(findElement(Locator.XPATH,calendarMenuXpath))
                .perform(DriverAtoms.webClick());

        Thread.sleep(5000);

        onWebView().withElement(findElement(Locator.ID,"addEvent"))
                .perform(DriverAtoms.webClick());

        Thread.sleep(3000);

        onWebView().withElement(findElement(Locator.ID,"eventName"))
                .check(webMatches(getText(), containsString("")));

        onWebView().withElement(findElement(Locator.ID,"event_name"))
                .check(webMatches(getText(), containsString("Event Name:")));

        onWebView().withElement(findElement(Locator.ID,"date_"));

        onWebView().withElement(findElement(Locator.ID,"dt"))
                .check(webMatches(getText(), containsString("Date:")));

        onWebView().withElement(findElement(Locator.ID,"eventStartTime"))
                .check(webMatches(getText(), containsString("")));

        onWebView().withElement(findElement(Locator.ID,"start_time"))
                .check(webMatches(getText(), containsString("Start time :")));

        onWebView().withElement(findElement(Locator.ID,"eventEndTime"))
                .check(webMatches(getText(), containsString("")));

        onWebView().withElement(findElement(Locator.ID,"ends"))
                .check(webMatches(getText(), containsString("Ends :")));

        onWebView().withElement(findElement(Locator.XPATH,"savebutton"))
                .check(webMatches(getText(), containsString("Save new event")));

        Thread.sleep(3000);

    }

    @Test
    public void emailButtonClickTestNegative() throws Exception{

        /**
         * UI Failing Calendar Page Validation Test for Our ForRunners Application.
         * This UI test checks if the email and password text boxes are empty and are loaded
         * and present on the page.
         * It also checks if the Sign In button is there and has the appropriate label.
         * Also, there are tests verifying if the labels on top of the text boxes are present and
         * written appropriately
         * Fails Due to :
         * - Event Label being wrong
         * - Date Label being wrong
         * - Start Time Label being wrong
         * - End Time Label being wrong
         * - Date Id being wrong
         * - Event Start Time Id being wrong
         * - Event End Time Id being wrong
         */

        // Login into app to ensure that profile page can be displayed
        SignInPageTest a = new SignInPageTest();
        a.signInPageGoodTest();

        onWebView().withElement(findElement(Locator.XPATH,menuXpath1))
                .perform(DriverAtoms.webClick());

        Thread.sleep(3000);

        onWebView().withElement(findElement(Locator.XPATH,calendarMenuXpath))
                .perform(DriverAtoms.webClick());

        Thread.sleep(5000);

        onWebView().withElement(findElement(Locator.ID,"addEvent"))
                .perform(DriverAtoms.webClick());

        Thread.sleep(3000);

        onWebView().withElement(findElement(Locator.ID,"eventName"))
                .check(webMatches(getText(), containsString("")));

        onWebView().withElement(findElement(Locator.ID,"event_name"))
                .check(webMatches(getText(), containsString("EventName:")));

        onWebView().withElement(findElement(Locator.ID,"dat3"));

        onWebView().withElement(findElement(Locator.ID,"dt"))
                .check(webMatches(getText(), containsString("Date :")));

        onWebView().withElement(findElement(Locator.ID,"eventStartTime"))
                .check(webMatches(getText(), containsString("")));

        onWebView().withElement(findElement(Locator.ID,"start"))
                .check(webMatches(getText(), containsString("StartTime :")));

        onWebView().withElement(findElement(Locator.ID,"eventEnd"))
                .check(webMatches(getText(), containsString("")));

        onWebView().withElement(findElement(Locator.ID,"ends"))
                .check(webMatches(getText(), containsString("End Time:")));

        onWebView().withElement(findElement(Locator.ID,"savebutton"))
                .check(webMatches(getText(), containsString("Save event")));

        Thread.sleep(3000);

    }




}

