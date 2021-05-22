package kr.dove.spider;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping(value = "**")
public class HttpAcceptor {
    private final Spider spider;

    @GetMapping(value = "/crawl", produces = "application/json")
    public ResponseEntity<Object> crawl() {
        return spider.crawl();
    }

}
