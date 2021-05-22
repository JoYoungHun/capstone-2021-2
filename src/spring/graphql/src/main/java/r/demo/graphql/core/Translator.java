package r.demo.graphql.core;

import com.google.cloud.translate.v3.Translation;
import graphql.schema.DataFetcher;
import org.springframework.stereotype.Service;
import r.demo.graphql.annotation.Gql;
import r.demo.graphql.annotation.GqlDataFetcher;
import r.demo.graphql.annotation.GqlType;
import r.demo.graphql.config.GoogleTranslationClient;

import java.util.LinkedHashMap;
import java.util.stream.Collectors;

@Gql
@Service
public class Translator {
    private final GoogleTranslationClient client;

    public Translator(GoogleTranslationClient client) {
        this.client = client;
    }

    @GqlDataFetcher(type = GqlType.QUERY)
    public DataFetcher<?> translate() {
        return environment -> {
            String queryTxt = environment.getArgument("q");
            LinkedHashMap<String, Object> lhm = new LinkedHashMap<>();
            lhm.put("translated", client.getTranslatedParagraphs(queryTxt, "ko")
                    .stream().map(Translation::getTranslatedText).collect(Collectors.toList()));
            lhm.put("idx", environment.getArgument("idx"));

            return lhm;
        };
    }
}
