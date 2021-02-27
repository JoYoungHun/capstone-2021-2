package r.demo.graphql;

import com.google.cloud.translate.v3.*;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;

import java.io.IOException;

@SpringBootTest
class GraphqlApplicationTests {

    @Test
    void contextLoads() {
    }

    @Test
    public void google_cloud_connect_test() throws IOException {
//        Translate translate = TranslateOptions.getDefaultInstance().getService();
//
//        Translation translation = translate.translate("¡Hola Mundo!");
//        System.out.printf("Translated Text:\n\t%s\n", translation.getTranslatedText());

        try (TranslationServiceClient client = TranslationServiceClient.create()) {
            // Supported Locations: `global`, [glossary location], or [model location]
            // Glossaries must be hosted in `us-central1`
            // Custom Models must use the same location as your model. (us-central1)
            LocationName parent = LocationName.of("capstone2021-305109", "global");

            String[] paragraphs = { "hola mundo", "hello world!", "it's the empire from a new city" };
            // Supported Mime Types: https://cloud.google.com/translate/docs/supported-formats
            for (String paragraph : paragraphs) {
                System.out.println("TRY: " + paragraph);
                TranslateTextRequest request =
                        TranslateTextRequest.newBuilder()
                                .setParent(parent.toString())
                                .setMimeType("text/plain")
                                .setTargetLanguageCode("ko")
                                .addContents(paragraph)
                                .build();

                TranslateTextResponse response = client.translateText(request);

                // Display the translation for each input text provided
                for (Translation translation : response.getTranslationsList()) {
                    System.out.printf("Translated text: %s\n", translation.getTranslatedText());
                }
            }
        }
    }
}
