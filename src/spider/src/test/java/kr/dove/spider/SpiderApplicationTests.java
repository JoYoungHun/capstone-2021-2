package kr.dove.spider;

import kr.dove.spider.config.RetrofitClient;
import kr.dove.spider.domain.Video;
import org.junit.jupiter.api.Test;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.chrome.ChromeDriver;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.core.io.ClassPathResource;
import retrofit2.Response;

import javax.annotation.Resource;
import java.io.IOException;
import java.util.*;

@SpringBootTest
class SpiderApplicationTests {

    @Test
    void contextLoads() {
    }

    @Test
    public void selenium_test() {
        WebDriver browser = null;
        final String nationalitySuffix = "&persist_gl=1&gl=US";

        // remove duplicates
        final Set<String> urls = new HashSet<>();
        try {
            ClassPathResource resource = new ClassPathResource("selenium/chromedriver");
            System.setProperty("webdriver.chrome.driver", resource.getURL().getPath());
            browser = new ChromeDriver();
            browser.get("https://www.youtube.com/feed/trending?bp=6gQJRkVleHBsb3Jl".concat(nationalitySuffix));
            Thread.sleep(1500);
            List<WebElement> videos = browser.findElements(By.xpath("//*[@id=\"grid-container\"]/ytd-video-renderer"));
            for (WebElement element : videos) {
                try {
                    WebElement link = element.findElement(By.xpath(".//a[@id=\"thumbnail\"]"));
                    final String href = link.getAttribute("href");
                    if (!urls.contains(href)) {
                        urls.add(link.getAttribute("href"));
                        String id, title, captions;
                        id = href.substring(href.indexOf("v=") + 2);
                        title = element.findElement(By.xpath(".//a[@id=\"video-title\"]/yt-formatted-string")).getText();
                        Response<Object> transcript = RetrofitClient.getApis().transcript(id).execute();
                        captions = transcript.body() != null ? transcript.body().toString() : null;
                        System.out.printf("%s, %s, %s\n\n", id, title, captions);
                    }
                } catch (Exception e) {
                    e.printStackTrace();
                }
            }
            System.out.printf("TOTAL VIDEOS DETECTED BY DRIVER: %d\n", videos.size());
            System.out.printf("URLS: %s\n\n", urls.toString());

        } catch (IOException | InterruptedException e) {
            e.printStackTrace();
        } finally {
//            if (browser != null)
//            browser.close();
        }
    }
}
