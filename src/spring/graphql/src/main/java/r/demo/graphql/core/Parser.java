package r.demo.graphql.core;

import edu.stanford.nlp.ling.CoreLabel;
import edu.stanford.nlp.pipeline.CoreDocument;
import graphql.schema.DataFetcher;
import org.springframework.context.annotation.Lazy;
import org.springframework.stereotype.Service;
import r.demo.graphql.annotation.Gql;
import r.demo.graphql.annotation.GqlDataFetcher;
import r.demo.graphql.annotation.GqlType;
import r.demo.graphql.response.ParseResponse;
import r.demo.graphql.types.Paragraph;
import r.demo.graphql.utils.StanfordLemmatizer;

import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@Gql
@Service
public class Parser {
    private final StanfordLemmatizer lemmatizer;
    private final List<String> validPos;

    public Parser(@Lazy StanfordLemmatizer lemmatizer) {
        this.lemmatizer = lemmatizer;
        this.validPos = Arrays.asList("v.", "conj.", "ad.", "n.");
    }

    @GqlDataFetcher(type = GqlType.QUERY)
    public DataFetcher<?> parse() {
        return environment -> {
            try {
                String captions = environment.getArgument("captions");
                CoreDocument coreDocument = lemmatizer.parse(captions);
                List<Paragraph> sentences = coreDocument.sentences().stream()
                        .filter(coreSentence -> !coreSentence.text().matches("[^A-Za-z0-9]+"))
                        .map(coreSentence -> new Paragraph(coreSentence.text(), "", null))
                        .collect(Collectors.toList()),
                        words = coreDocument.tokens().stream()
                                .filter(token -> token.tag().matches("^[A-Z]+$") && validPos.contains(lemmatizer.partOfSpeech(token.tag())))
                                .map(token -> new Paragraph(token.lemma().toLowerCase(), "", token.tag())).collect(Collectors.toList());

                return ParseResponse.builder().sentences(sentences).words(words).build();
            } catch (Exception e) {
                List<Paragraph> empty = Collections.emptyList();
                return ParseResponse.builder().sentences(empty).words(empty).build();
            }
        };
    }
}
