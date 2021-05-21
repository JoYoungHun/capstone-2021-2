package kr.dove.spider;

import org.openqa.selenium.Capabilities;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.chrome.ChromeDriverService;
import org.openqa.selenium.chrome.ChromeOptions;
import org.openqa.selenium.remote.DesiredCapabilities;

import java.io.File;
import java.util.concurrent.TimeUnit;

public class SeleniumConfig {
    private final WebDriver driver;

    public SeleniumConfig() {
        ChromeDriverService service = new ChromeDriverService.Builder()
                .usingDriverExecutable(new File("chromedriver"))
                .usingAnyFreePort()
                .build();
        Capabilities capabilities = DesiredCapabilities.chrome();
        ChromeOptions options = new ChromeOptions();
        options.merge(capabilities);
        driver = new ChromeDriver(service, options);
        driver.manage().timeouts().implicitlyWait(5, TimeUnit.SECONDS);
    }

    static {
        System.setProperty("webdriver.chrome.driver", findFile("chromedriver"));
    }

    static private String findFile(String filename) {
        String[] paths = {"", "bin/", "target/classes"};
        for (String path : paths) {
            if (new File(path + filename).exists())
                return path + filename;
        }
        return "";
    }
}
