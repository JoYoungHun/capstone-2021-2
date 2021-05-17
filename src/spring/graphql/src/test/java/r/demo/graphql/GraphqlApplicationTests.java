package r.demo.graphql;

import com.google.api.client.auth.oauth2.Credential;
import com.google.api.client.extensions.java6.auth.oauth2.AuthorizationCodeInstalledApp;
import com.google.api.client.extensions.jetty.auth.oauth2.LocalServerReceiver;
import com.google.api.client.googleapis.auth.oauth2.GoogleAuthorizationCodeFlow;
import com.google.api.client.googleapis.auth.oauth2.GoogleClientSecrets;
import com.google.api.client.googleapis.javanet.GoogleNetHttpTransport;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.JsonFactory;
import com.google.api.client.json.gson.GsonFactory;
import com.google.api.client.json.jackson2.JacksonFactory;
import com.google.api.services.youtube.YouTube;
import com.google.cloud.translate.v3.*;
import org.apache.commons.io.FileUtils;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import r.demo.graphql.domain.documents.autocomplete.Neuron;
import r.demo.graphql.domain.documents.autocomplete.NeuronRepository;

import java.io.*;
import java.security.GeneralSecurityException;
import java.util.Arrays;
import java.util.Calendar;
import java.util.Collection;
import java.util.Optional;

@SpringBootTest
class GraphqlApplicationTests {
    static final String CLIENT_SECRETS= "/Users/parkps/Downloads/capstone2021-a5b1e16cc1be.json";
    static final Collection<String> SCOPES =
            Arrays.asList("https://www.googleapis.com/auth/youtube.force-ssl");

    static final String APPLICATION_NAME = "API code samples";
    static final JsonFactory JSON_FACTORY = JacksonFactory.getDefaultInstance();

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

    @Test
    public void captions_download() throws Exception {
        YouTube youtubeService = getService();
        // TODO: Replace "YOUR_FILE" with the location where
        //       the downloaded content should be written.
        OutputStream output = new FileOutputStream("YOUR_FILE");

        // Define and execute the API request
        YouTube.Captions.Download request = youtubeService.captions()
                .download("cWb5Q03oDCc");
        request.getMediaHttpDownloader();
        request.executeMediaAndDownloadTo(output);
    }

    /**
     * Create an authorized Credential object.
     *
     * @return an authorized Credential object.
     * @throws IOException
     */
    public static Credential authorize(final NetHttpTransport httpTransport) throws IOException {
        // Load client secrets.
        File f = new File(CLIENT_SECRETS);
        InputStream in = FileUtils.openInputStream(f);
        GoogleClientSecrets clientSecrets =
                GoogleClientSecrets.load(JSON_FACTORY, new InputStreamReader(in));
        // Build flow and trigger user authorization request.
        GoogleAuthorizationCodeFlow flow =
                new GoogleAuthorizationCodeFlow.Builder(httpTransport, JSON_FACTORY, clientSecrets, SCOPES)
                        .build();
        return new AuthorizationCodeInstalledApp(flow, new LocalServerReceiver()).authorize("user");
    }

    /**
     * Build and return an authorized API client service.
     *
     * @return an authorized API client service
     * @throws GeneralSecurityException, IOException
     */
    public static YouTube getService() throws GeneralSecurityException, IOException {
        final NetHttpTransport httpTransport = GoogleNetHttpTransport.newTrustedTransport();
        Credential credential = authorize(httpTransport);
        return new YouTube.Builder(httpTransport, JSON_FACTORY, credential)
                .setApplicationName(APPLICATION_NAME)
                .build();
    }

    @Autowired
    private NeuronRepository neuronRepository;

    @Test
    public void elasticsearch_insert_test_demo() throws Exception {
//        Calendar c = Calendar.getInstance();
//        Neuron neuron = neuronRepository.save(Neuron.builder().user("test").word("김부선").autocomplete("김 김부 부선 김부선").clicked(1).recall(c.getTime()).build());
//        Neuron neuron1 = neuronRepository.save(Neuron.builder().user("test").word("김치찜").autocomplete("김 김치 치찜 김치찜").clicked(1).recall(c.getTime()).build());
//        System.out.println("NEURON 0: " + neuron.getId() + " // " + neuron.getAutocomplete());
//        System.out.println("NEURON 1: " + neuron1.getId() + " // " + neuron1.getAutocomplete());
//
//        Optional<Neuron> neuron2 = neuronRepository.findById(0L);
//        System.out.println(neuron2.isPresent() + " // " + neuron.getWord() + " // " + neuron2.map(Neuron::getWord));
//        System.out.println(neuron.getWord().equals(neuron2.map(Neuron::getWord).orElse("")));
    }
}
