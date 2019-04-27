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
public class SpotifyFeatureTest{

    @Rule
    public ActivityTestRule<MainActivity> mainactivitytest1 =new ActivityTestRule<MainActivity>(MainActivity.class);

    private static final String menuXpath1 = "/html/body/ion-nav-view/ion-side-menus/ion-side-menu-content/ion-nav-bar/div[2]/ion-header-bar/div[1]/span/button";
    private static final String spotifyXpathpage = "/html/body/ion-nav-view/ion-side-menus/ion-side-menu/ion-content/div/ion-list/div/ion-item[1]/a";

    @Test
    public void spotifyPageUiTestCheckButtonsGood() throws Exception {

        /**
         * UI Spotify Page Validation Test for Our ForRunners Application.
         * This UI test checks if all the elements are displayed on the screen
         * (including the name of the album, the track and the name of the artist)
         */

        // Login into app to ensure that profile page can be displayed
        SignInPageTest a = new SignInPageTest();
        a.signInPageGoodTest();

        onWebView().withElement(findElement(Locator.XPATH,menuXpath1))
                .perform(DriverAtoms.webClick());

        Thread.sleep(3000);

        onWebView().withElement(findElement(Locator.XPATH,spotifyXpathpage))
                .perform(DriverAtoms.webClick());

        onWebView().withElement(findElement(Locator.ID,"album-name"));
        onWebView().withElement(findElement(Locator.ID,"track-name"));
        onWebView().withElement(findElement(Locator.ID,"artist-name"));

        onWebView().withElement(findElement(Locator.ID,"play-preview-label")).check(webMatches(getText(),containsString("Play Preview")));
        onWebView().withElement(findElement(Locator.ID,"open-spotify-label")).check(webMatches(getText(),containsString("Open in Spotify")));

    }

    @Test
    public void spotifyPageUiTestCheckButtonsBad() throws Exception {

        /**
         * UI Failing Coach Page Validation Test for Our ForRunners Application.
         * Fails Due to :
         * - Track Name Locator id being wrong
         * - Play Preview label not matching the Locator id
         * - The Text for the Open Spotify Label not matching what should be shown on the screen.
         */

        // Login into app to ensure that profile page can be displayed
        SignInPageTest a = new SignInPageTest();
        a.signInPageGoodTest();

        onWebView().withElement(findElement(Locator.XPATH,menuXpath1))
                .perform(DriverAtoms.webClick());

        Thread.sleep(3000);

        onWebView().withElement(findElement(Locator.XPATH,spotifyXpathpage))
                .perform(DriverAtoms.webClick());

        onWebView().withElement(findElement(Locator.ID,"album-name"));
        onWebView().withElement(findElement(Locator.ID,"trackName"));
        onWebView().withElement(findElement(Locator.ID,"artist-name"));

        onWebView().withElement(findElement(Locator.ID,"playPreviewLabel")).check(webMatches(getText(),containsString("Play Preview")));
        onWebView().withElement(findElement(Locator.ID,"open-spotify-label")).check(webMatches(getText(),containsString("Spotify")));



    }


}