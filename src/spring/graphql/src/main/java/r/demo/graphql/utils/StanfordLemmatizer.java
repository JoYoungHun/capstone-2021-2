package r.demo.graphql.utils;

import edu.stanford.nlp.ling.CoreLabel;
import edu.stanford.nlp.pipeline.CoreDocument;
import edu.stanford.nlp.pipeline.CoreSentence;
import edu.stanford.nlp.pipeline.StanfordCoreNLP;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import r.demo.graphql.domain.word.Word;
import r.demo.graphql.domain.word.WordRepo;
import r.demo.graphql.types.Document;
import r.demo.graphql.types.Paragraph;

import java.util.*;
import java.util.stream.Collectors;

@RequiredArgsConstructor
@Service
public class StanfordLemmatizer {
    private final StanfordCoreNLP stanfordCoreNLP;
    private final WordRepo wordRepo;

    public CoreDocument parse(@NonNull String captions) {
        CoreDocument coreDocument;
        try {
            if ("".equals(captions)) throw new IllegalArgumentException();
            coreDocument = new CoreDocument(captions);
            stanfordCoreNLP.annotate(coreDocument);

            return coreDocument;
        } catch (Exception e) {
            return null;
        }

    }

    public List<Paragraph> lemmatize(@NonNull String text) {
        CoreDocument coreDocument;

        try {
            if ("".equals(text) || text.length() < 2) throw new IllegalArgumentException();
            coreDocument = new CoreDocument(text);
            stanfordCoreNLP.annotate(coreDocument);
            List<CoreLabel> labels = coreDocument.tokens();

            List<Paragraph> paragraphs = new ArrayList<>();
            Set<String> duplicated = new HashSet<>();
            for (CoreLabel label : labels) {
                // lemmatize original text(word)
                String lemma = label.lemma();
                if (!duplicated.contains(lemma)) {
                    duplicated.add(lemma);
                    paragraphs.add(new Paragraph(lemma, wordRepo.findLatestKorMeaning(lemma).map(Word::getKor).orElse("")));
                }
            }

            return paragraphs;
        } catch (Exception e) {
            return Collections.emptyList();
        }
    }

    public Document getPartOfSpeechAboutSentence(@org.springframework.lang.NonNull String sentence) {
        CoreDocument coreDocument;
        if (sentence.equals("") || sentence.length() < 1) return null;
        try {
            coreDocument = stanfordCoreNLP.processToCoreDocument(sentence);
            return Document.builder()
                    .split(coreDocument.tokens().stream().map(CoreLabel::originalText).collect(Collectors.toList()))
                    .pos(coreDocument.tokens().stream().map((token) -> this.partOfSpeech(token.tag())).collect(Collectors.toList())).build();
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

    public String partOfSpeech(@org.springframework.lang.NonNull String word) {
        if (word.startsWith("NNP") || word.startsWith("W") || word.startsWith("P")) return "pron.";
        else if (word.startsWith("N")) return "n.";
        else if (word.startsWith("V") || word.startsWith("UH")) return "v.";
        else if (word.startsWith("D")) return "a.";
        else if (word.startsWith("R")) return "ad.";
        else if (word.startsWith("J")) return "conj.";
        else if (word.startsWith("I")) return "i.";
        else return word;
    }
}
