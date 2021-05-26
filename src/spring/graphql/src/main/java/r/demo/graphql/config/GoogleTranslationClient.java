package r.demo.graphql.config;

import com.google.cloud.translate.v3.*;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.annotation.PostConstruct;
import java.io.IOException;
import java.util.Collections;
import java.util.List;

@Component
public class GoogleTranslationClient {
    @Value("${project.name}")
    private String project;

    private TranslationServiceClient client;
    private LocationName parent;

    @PostConstruct
    public void init() throws IOException {
        this.client = TranslationServiceClient.create();
        this.parent = LocationName.of(project, "global");
    }

    public List<Translation> getTranslatedParagraphs(String paragraph, String targetLanguage) {
        try {
            TranslateTextRequest request =
                    TranslateTextRequest.newBuilder()
                            .setParent(parent.toString())
                            .setMimeType("text/plain")
                            .setTargetLanguageCode(targetLanguage)
                            .addContents(paragraph)
                            .build();

            TranslateTextResponse response = client.translateText(request);
            return response.getTranslationsList();
        } catch (RuntimeException e) {
            return Collections.emptyList();
        }
    }
}
