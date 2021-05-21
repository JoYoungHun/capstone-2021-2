package kr.dove.spider;

import kr.dove.spider.config.RetrofitClient;
import kr.dove.spider.domain.Video;
import kr.dove.spider.domain.VideoRepository;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.chrome.ChromeDriver;
import org.springframework.core.io.ClassPathResource;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import retrofit2.Response;

import java.io.IOException;
import java.util.*;
import java.util.concurrent.atomic.AtomicBoolean;
import java.util.stream.Collectors;

@Service
public class Spider {
    private final VideoRepository videoRepository;

    public Spider(VideoRepository videoRepository) {
        this.videoRepository = videoRepository;
    }

    public ResponseEntity<Object> crawl() {
        WebDriver browser = null;
        AtomicBoolean failed = new AtomicBoolean();
        final String nationalitySuffix = "&persist_gl=1&gl=US";

        // remove duplicates
        final Set<String> urls = new HashSet<>();
        final List<Video> boxes = new ArrayList<>();
        try {
            ClassPathResource resource = new ClassPathResource("selenium/chromedriver");
            System.setProperty("webdriver.chrome.driver", resource.getURL().getPath());
            browser = new ChromeDriver();
            browser.get("https://www.youtube.com/feed/trending?bp=6gQJRkVleHBsb3Jl".concat(nationalitySuffix));
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
                        captions = transcript.body() != null ? transcript.body().toString().substring(1, transcript.body().toString().length() - 1) : null;

                        if (title != null && captions != null)
                            boxes.add(Video.builder().id(id).title(title).captions(captions)
                                    .ref(href).created(new Date()).build());
                    }
                } catch (Exception e) {
                    e.printStackTrace();
                }
            }
            System.out.printf("TOTAL VIDEOS DETECTED BY DRIVER: %d\n", videos.size());
            System.out.printf("URLS: %s\n\n", urls.toString());

        } catch (IOException e) {
            failed.set(true);
            e.printStackTrace();
        } finally {
            if (browser != null)
                browser.close();

            // save documents
            if (!boxes.isEmpty())
                videoRepository.saveAll(boxes);
        }
        return new ResponseEntity<>(failed.get() ? HttpStatus.INTERNAL_SERVER_ERROR : HttpStatus.OK);
    }

    public Collection<Video> get(int page, int renderItem) {
        return videoRepository.findAll(PageRequest.of(page - 1, renderItem, Sort.Direction.DESC, "created"))
                .stream().collect(Collectors.toList());
    }

    public void test() {
//        Iterable<Video> videos = videoRepository.findAll();
//        int i = 0;
//        for (Video video : videos) {
//            System.out.println(video.getId());
//            i++;
//        }
//        System.out.printf("TOTAL: %d\n", i);

        List<Video> videos = videoRepository.findAllByTitleContains("B");
        for (Video v : videos) {
            System.out.println(v.getId() + " // " + v.getTitle());
        }
    }
}
